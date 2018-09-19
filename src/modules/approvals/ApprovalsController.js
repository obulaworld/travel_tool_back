import models from '../../database/models';
import { createSubquery, countByStatus } from '../../helpers/requests';
import handleServerError from '../../helpers/serverError';
import Pagination from '../../helpers/Pagination';
import Utils from '../../helpers/Utils';
import notFoundError from '../../helpers/notFoundError';

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
      status: 'Open'
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
    subquery.include = ['Request'];

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
          pagination,
        },
      });
    } catch (error) { /* istanbul ignore next */
      return handleServerError('Server error', res);
    }
  }

  // updates rewuest table with new request
  static async updateRequestStatus(req, res) {
    const { newStatus } = req.body;
    const { request } = req;
    try {
      const updateApproval = await ApprovalsController.updateApprovals(
        res, [request, newStatus]
      );
      if (updateApproval) {
        const updatedRequest = await request.update({
          status: newStatus,
        });

        await ApprovalsController.generateCountAndMessage(
          res, updatedRequest
        );
      }
    } catch (error) {
      /* istanbul ignore next */
      return handleServerError(error, res);
    }
  }

  // finds and updates approval table with new request status
  static async updateApprovals(res, request) {
    try {
      const requestToApprove = await models.Approval.find({
        where: {
          requestId: request[0].id
        }
      });

      if (!requestToApprove) {
        const error = 'Request not found';
        return notFoundError(error, res);
      }
      const { status } = requestToApprove;
      if (['Approved', 'Rejected'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Request has been ${status.toLowerCase()} already`
        });
      }
      return await requestToApprove.update({
        status: request[1]
      });
    } catch (error) {
      /* istanbul ignore next */
      return handleServerError(error, res);
    }
  }

  static async generateCountAndMessage(res, updatedRequest) {
    const message = Utils.getRequestStatusUpdateResponse(
      updatedRequest.status,
    );
    return res.status(200).json({
      success: true,
      message,
      updatedRequest: {
        request: updatedRequest,
      },
    });
  }
}

export default ApprovalsController;
