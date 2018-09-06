import models from '../../database/models';
import Pagination from '../../helpers/Pagination';
import Utils from '../../helpers/Utils';
import { createSubquery, countByStatus } from '../../helpers/requests';
import handleServerError from '../../helpers/serverError';

class RequestsController {
  static async createRequest(req, res) {
    try {
      const requestData = {
        ...req.body,
        id: Utils.generateUniqueId(),
        userId: req.user.UserInfo.id,
      };
      const newRequest = await models.Request.create(requestData);
      return res.status(201).json({
        success: true,
        message: 'Request created successfully',
        request: newRequest,
      });
    } catch (error) { /* istanbul ignore next */
      return handleServerError(error, res);
    }
  }

  static async getUserRequests(req, res) {
    const userId = req.user.UserInfo.id;
    const { status } = req.query.status || '';
    const { page, limit, offset } = Pagination.initializePagination(req);
    const subquery = createSubquery(req, limit, offset, 'Request');
    try {
      const requests = await models.Request.findAndCountAll(subquery);
      const count = await countByStatus(models.Request, userId);
      const pagination = Pagination.getPaginationData(page, limit, requests);
      const message = Utils.getResponseMessage(pagination, status, 'Request');
      return res.status(200).json({
        success: true,
        message,
        requests: requests.rows,
        meta: {
          count,
          pagination,
        },
      });
    } catch (error) { /* istanbul ignore next */
      return handleServerError('Server Error', res);
    }
  }

  static async getUserRequestDetails(req, res) {
    const { requestId } = req.params;
    try {
      const requestData = await models.Request.findById(requestId);
      if (!requestData) {
        return res.status(404).json({
          message: `No request with ${requestId} found!`,
        });
      }
      return res.status(200).json({
        success: true,
        requestData,
      });
    } catch (error) { /* istanbul ignore next */
      return handleServerError('Server Error', res);
    }
  }
}

export default RequestsController;
