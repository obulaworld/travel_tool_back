import models from '../../database/models';
import { createSubquery, countByStatus } from '../../helpers/requests';
import Error from '../../helpers/Error';
import Pagination from '../../helpers/Pagination';
import Utils from '../../helpers/Utils';
import NotificationEngine from '../notifications/NotificationEngine';

class ApprovalsController {
  static fillWithRequestData(approval) {
    const request = approval.Request;
    request.status = approval.status;
    return request;
  }

  static async createApproval(newRequest) {
    const approvalData = {
      requestId: newRequest.id,
      approverId: newRequest.manager,
      status: newRequest.status
    };
    const newApproval = await models.Approval.create(approvalData);
    return newApproval;
  }

  static async getUserApprovals(req, res) {
    const { page, limit, offset } = Pagination.initializePagination(req);
    const userName = req.user.UserInfo.name;
    const { status } = req.query.status || '';
    // create query using `approverId` as the column name bearing the user id
    const subquery = createSubquery(req, limit, offset, 'Approval');
    subquery.include = [
      {
        model: models.Request,
        as: 'Request',
        include: [{
          model: models.Trip,
          as: 'trips',
        }],
      },
    ];

    try {
      const result = await models.Approval.findAndCountAll(subquery);
      // FIXME: countByStatus should use a unique user identity, not userName
      const count = await countByStatus(models.Approval, userName);
      const pagination = Pagination.getPaginationData(page, limit, result);
      const { fillWithRequestData } = ApprovalsController;
      const message = Utils.getResponseMessage(pagination, status, 'Approval');
      const approvals = result.rows.map(fillWithRequestData);
      return res.status(200).json({
        success: true,
        message,
        approvals,
        meta: {
          count,
          pagination
        }
      });
    } catch (error) {
      /* istanbul ignore next */
      return Error.handleError('Server error', 500, res);
    }
  }

  // updates request table with new request
  static async updateRequestStatus(req, res) {
    const { newStatus } = req.body;
    const { request, user } = req;
    try {
      const updateApproval = await ApprovalsController.updateApprovals(res, [
        request,
        newStatus,
        user
      ]);
      if (updateApproval.approverId) {
        const updatedRequest = await request.update({
          status: newStatus
        });

        ApprovalsController.sendNotificationAfterApproval(
          user,
          updatedRequest,
          res
        );

        await ApprovalsController.generateCountAndMessage(res, updatedRequest);
      }
    } catch (error) {
      /* istanbul ignore next */
      return Error.handleError(error, 500, res);
    }
  }

  // updates approval table with new request status
  static async updateApprovals(res, request) {
    try {
      const requestToApprove = await models.Approval.find({
        where: {
          requestId: request[0].id
        }
      });

      if (!requestToApprove) {
        const error = 'Request not found';
        return Error.handleError(error, 404, res);
      }

      const { status } = requestToApprove;
      if (['Approved', 'Rejected'].includes(status)) {
        const error = `Request has been ${status.toLowerCase()} already`;
        return Error.handleError(error, 400, res);
      }

      return await requestToApprove.update({
        status: request[1]
      });
    } catch (error) {
      /* istanbul ignore next */
      return Error.handleError(error, 500, res);
    }
  }

  static async generateCountAndMessage(res, updatedRequest) {
    const message = Utils.getRequestStatusUpdateResponse(updatedRequest.status);
    return res.status(200).json({
      success: true,
      message,
      updatedRequest: {
        request: updatedRequest
      }
    });
  }

  static async sendNotificationAfterApproval(user, updatedRequest, res) {
    try {
      const { status, id, userId } = updatedRequest;
      const { name, picture } = user.UserInfo;
      const notificationData = {
        senderId: user.UserInfo.id,
        senderName: name,
        senderImage: picture,
        recipientId: userId,
        notificationType: 'general',
        requestId: id,
        message: 'approved your request',
        notificationLink: `/requests/${id}`
      };

      return (
        status === 'Approved'
        && (await NotificationEngine.notify(notificationData))
      );
    } catch (error) {
      return Error.handleError(error, 500, res);
    }
  }
}

export default ApprovalsController;
