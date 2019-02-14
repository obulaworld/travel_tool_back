import { Op } from 'sequelize';
import models from '../database/models';

class Pagination {
  static initializePagination(req) {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const offset = limit * (page - 1);
    const paginationInit = {
      page,
      limit,
      offset,
    };
    return paginationInit;
  }

  static getPaginationData(page, limit, count) {
    const pageCount = Math.ceil(count / limit);
    const pagination = {
      pageCount,
      currentPage: +page,
      dataCount: count,
    };
    return pagination;
  }

  static options(req) {
    const { query: { search } } = req;
    const countOptions = search ? {
      where: {
        [Op.or]: [
          { title: { [Op.iLike]: `${search}` } },
          { description: { [Op.iLike]: `${search}` } },
        ]
      }
    } : {};
    const findOptions = {
      ...countOptions,
      include: [{
        model: models.User,
        as: 'creator',
        attributes: ['email', 'fullName', 'userId']
      }]
    };
    return {
      countOptions,
      findOptions
    };
  }
}

export default Pagination;
