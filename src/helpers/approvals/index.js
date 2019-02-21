import models from '../../database/models';
import {
  createSearchClause, getModelSearchColumns
} from '../requests/index';

const { Op } = models.Sequelize;
const { sequelize } = models;

export function updateStatus(status) {
  return (['approved', 'rejected', 'verified']
    .includes(status.toLowerCase())) ? status.toLowerCase() : 'open';
}

export function updateCondition(status, condition) {
  return (['approved', 'rejected']
    .includes(status.toLowerCase())) ? 'LIKE' : condition;
}

export const createStatusCondition = (status) => {
  const condition = (status.toLowerCase() === 'open' || status.toLowerCase() === 'verified')
    ? 'LIKE' : 'NOT LIKE';
  return condition;
};

export const createExtendedClause = (verified, location) => {
  let requestWhereExtended = {};
  let tripWhereExtended = {};
  if (verified) {
    requestWhereExtended = {
      status: { [Op.in]: ['Approved', 'Verified'] }
    };
    tripWhereExtended = {
      origin: {
        [Op.iLike]: `${location}%`
      }
    };
  }
  return { requestWhereExtended, tripWhereExtended };
};

export function createApprovalSubquery({
  req, limit, offset, search, searchRequest
}) {
  const { verified } = req.query;
  let status = req.query.status ? req.query.status : '';
  const userName = req.user.UserInfo.name;
  const { location } = req.user;
  const requestStatus = 'Request.status';
  // tripWhereExtended
  const { requestWhereExtended, tripWhereExtended } = createExtendedClause(verified, location);
  const searchClause = createSearchClause(
    getModelSearchColumns('Request'), search, 'Request'
  );
  const tripSearchClause = createSearchClause(
    getModelSearchColumns('Trip'), search
  );
  let condition = createStatusCondition(status);
  const tripWhere = { [Op.or]: tripSearchClause };
  const requestWhere = {
    [Op.or]: searchClause
  };
  const where = (searchRequest) ? { ...requestWhere, ...requestWhereExtended }
    : requestWhereExtended;
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
    where: (verified) ? {} : { approverId: userName },
    include: [{
      model: models.Request,
      as: `${models.Request.name}`,
      where,
      include: [{
        model: models.Trip,
        as: `${models.Trip.name.toLowerCase()}s`,
        where: (!searchRequest) ? { ...tripWhere, ...tripWhereExtended } : tripWhereExtended,
      }]
    }],
    limit,
    offset,
    order: [['createdAt', 'DESC']]
  };
  return subQuery;
}
