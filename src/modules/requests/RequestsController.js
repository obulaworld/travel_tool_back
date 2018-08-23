import Sequelize from 'sequelize';
import models from '../../database/models';
import Pagination from '../../helpers/Pagination';

const { Op } = Sequelize;

class RequestsController {
  static buildRequestQuery(req, limit, offset) {
    const { status } = req.query;
    const userId = req.user.UserInfo.id;
    const query = {
      where: {
        userId,
      },
      limit,
      offset,
      order: [
        ['createdAt', 'DESC'],
      ],
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

  static async getUserRequests(req, res) {
    const { page, limit, offset } = Pagination.initializePagination(req);
    const query = RequestsController.buildRequestQuery(req, limit, offset);
    try {
      const requests = await models.Request.findAndCountAll(query);
      const pastRequestsCount = await models.Request
        .count({ where: { status: { [Op.ne]: 'Open' } } });
      const openRequestsCount = await models.Request
        .count({ where: { status: 'Open' } });
      const pagination = Pagination.getPaginationData(page, limit, requests);
      return res.status(200).json({
        success: true,
        requests: requests.rows,
        openRequestsCount,
        pastRequestsCount,
        pagination,
        url: req.url,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error,
      });
    }
  }
}

export default RequestsController;
