import models from '../../database/models';
import {
  createSearchClause, getModelSearchColumns
} from '../requests/index';

const { Op } = models.Sequelize;
const { sequelize } = models;

export function updateStatus(status) {
  return (['approved', 'rejected']
    .includes(status.toLowerCase())) ? status.toLowerCase() : 'open';
}

export function updateCondition(status, condition) {
  return (['approved', 'rejected']
    .includes(status.toLowerCase())) ? 'LIKE' : condition;
}

export function createApprovalSubquery({
  req, limit, offset, search, searchRequest
}) {
  let status = req.query.status ? req.query.status : '';
  const userName = req.user.UserInfo.name;
  const requestStatus = 'Request.status';
  const searchClause = createSearchClause(
    getModelSearchColumns('Request'), search, 'Request'
  );
  const tripSearchClause = createSearchClause(
    getModelSearchColumns('Trip'), search
  );
  let condition = (status.toLowerCase() === 'open') ? 'LIKE' : 'NOT LIKE';
  const tripWhere = { [Op.or]: tripSearchClause };
  const requestWhere = {
    [Op.or]: searchClause
  };
  const where = (searchRequest) ? requestWhere : {};
  if (status) {
    status = updateStatus(status);
    condition = updateCondition(status, condition);
    where[requestStatus] = sequelize
      .where(sequelize.fn(
        'LOWER',
        sequelize.cast(sequelize.col(requestStatus), 'varchar'),
      ), condition, `%${status.toLowerCase()}%`);
  }
  const subQuery = {
    where: { approverId: userName },
    include: [{
      model: models.Request,
      as: `${models.Request.name}`,
      where,
      include: [{
        model: models.Trip,
        as: `${models.Trip.name.toLowerCase()}s`,
        where: (!searchRequest) ? tripWhere : {},
      }]
    }],
    limit,
    offset,
    order: [['createdAt', 'DESC']]
  };
  return subQuery;
}
