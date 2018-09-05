import { Op } from 'sequelize';
import models from '../../database/models';
import Pagination from '../../helpers/Pagination';
import Utils from '../../helpers/Utils';

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
      return res.status(500).json({
        success: false,
        error: 'Server error',
      });
    }
  }

  static buildRequestQuery(req, limit, offset) {
    const { status } = req.query;
    const userId = req.user.UserInfo.id;
    const query = {
      where: {
        userId,
      },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    };
    if (status) {
      if (status === 'past') {
        query.where.status = {
          [Op.ne]: 'Open',
        };
      } else {
        query.where.status = {
          [Op.iLike]: status,
        };
      }
    }
    return query;
  }

  static async getRequestsCountData(userId) {
    const openRequestsCount = await models.Request.count({
      where: {
        status: 'Open',
        userId,
      },
    });

    const pastRequestsCount = await models.Request.count({
      where: {
        status: { [Op.ne]: 'Open' },
        userId,
      },
    });

    const count = {
      open: openRequestsCount,
      past: pastRequestsCount,
    };

    return count;
  }

  static async getUserRequests(req, res) {
    const userId = req.user.UserInfo.id;
    const { status } = req.query.status || '';
    const { page, limit, offset } = Pagination.initializePagination(req);
    const query = RequestsController.buildRequestQuery(req, limit, offset);
    try {
      const requests = await models.Request.findAndCountAll(query);
      const count = await RequestsController.getRequestsCountData(userId);
      const pagination = Pagination.getPaginationData(page, limit, requests);
      const message = Utils.getRequestResponseMessage(pagination, status);
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
      return res.status(500).json({
        success: false,
        error: 'Server error',
      });
    }
  }

  static async getUserRequestDetails(req, res) {
    const { requestId } = req.params;
    try {
      const requestData = await models.Request.find({
        where: { id: requestId },
        include: [{ model: models.Comment, as: 'comments' }],
      });
      if (!requestData) {
        return res.status(404).json({
          message: `Request with id ${requestId} does not exist`,
        });
      }
      return res.status(200).json({
        success: true,
        requestData,
      });
    } catch (error) { /* istanbul ignore next */
      return res.status(500).json({
        success: false,
        error: 'Server error',
      });
    }
  }
}

export default RequestsController;
