import models from '../../database/models';
import {
  countByStatus,
  getTotalCount,
  asyncWrapper,
  retrieveParams
} from '../../helpers/requests';
import {
  createApprovalSubquery
} from '../../helpers/approvals';
import Error from '../../helpers/Error';
import Pagination from '../../helpers/Pagination';
import Utils from '../../helpers/Utils';
import NotificationEngine from '../notifications/NotificationEngine';
import UserRoleController from '../userRole/UserRoleController';

const noResult = 'No records found';
let params = {};
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

  static setParameters(req) {
    params = retrieveParams(req);
    params.userName = req.user.UserInfo.name;
    params.parameters = {
      req,
      limit: params.limit,
      offset: params.offset,
      search: params.search
    };
  }

  static async sendResult(req, res, result) {
    const count = await asyncWrapper(res, countByStatus, models.Approval,
      params.userName, params.search);
    const pagination = Pagination.getPaginationData(
      params.page, params.limit, getTotalCount(params.status, count)
    );
    const { fillWithRequestData } = ApprovalsController;
    const message = (params.search && !result.count)
      ? noResult
      : Utils.getResponseMessage(pagination, params.status, 'Approval');
    const approvals = result.rows.map(fillWithRequestData);
    return res.status(200)
      .json({
        success: true,
        message,
        approvals,
        meta: {
          count,
          pagination
        }
      });
  }

  static async getApprovalsFromDb(subquery) {
    const result = await models.Approval.findAndCountAll(subquery);
    return result;
  }

  static async processQuery(req, res, repeat) {
    // create query using `approverId` as the column name bearing the user id
    const subquery = createApprovalSubquery({
      ...params.parameters,
      searchRequest: !repeat
    });
    let result = { count: 0 };
    result = await
    asyncWrapper(res, ApprovalsController.getApprovalsFromDb, subquery);
    if (!result.count && repeat) {
      return ApprovalsController.processQuery(req, res, false);
    }
    return ApprovalsController.sendResult(req, res, result);
  }

  static async getUserApprovals(req, res) {
    ApprovalsController.setParameters(req);
    try {
      await ApprovalsController.processQuery(req, res, true);
    } catch (error) { /* istanbul ignore next */
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
      const recipientEmail = await UserRoleController
        .getRecipient(null, userId);
      const notificationData = {
        senderId: user.UserInfo.id,
        senderName: name,
        senderImage: picture,
        recipientId: userId,
        notificationType: 'general',
        requestId: id,
        message: (status === 'Approved')
          ? 'approved your request'
          : 'rejected your request',
        notificationLink: `/requests/${id}`
      };

      const emailData = ApprovalsController
        .emailData(updatedRequest, recipientEmail, name);

      const emailNotification = await NotificationEngine
        .sendMail(emailData);

      const inAppNotification = NotificationEngine
        .notify(notificationData);
      return (
        ['Approved', 'Rejected'].includes(status)
        && inAppNotification && emailNotification
      );
    } catch (error) { /* istanbul ignore next */
      return Error.handleError(error, 500, res);
    }
  }

  static emailData(request, recipient, name) {
    return {
      recipient: {
        name: request.name,
        email: recipient && recipient.email
      },
      sender: name,
      topic: `Travela ${request.status} Request`,
      type: request.status,
      redirectLink:
      `${process.env.REDIRECT_URL}/requests/${request.id}`,
      requestId: request.id
    };
  }
}

export default ApprovalsController;
