import models from '../../database/models';
import Error from '../Error';
import Pagination from '../Pagination';


const { Op } = models.Sequelize;
const { sequelize } = models;

const oneWayRangeQuery = departureDate => ({
  [Op.or]: [
    { departureDate },
    {
      [Op.and]: [
        { departureDate: { [Op.lte]: departureDate } },
        { returnDate: { [Op.gte]: departureDate } }
      ]
    }
  ]
});

const multiRangeQuery = (departureDate, returnDate, checkStatus) => ({
  [Op.or]: [{
    [Op.and]: [
      { departureDate: { [Op.lte]: departureDate } },
      {
        returnDate: {
          [Op.or]: [{ [Op.and]: [{ [Op.lte]: returnDate }, { [Op.gte]: departureDate }] },
            { [Op.gte]: returnDate }]
        }
      },
      { checkStatus: { [Op.ne]: checkStatus } }
    ]
  },
  { departureDate: { [Op.gte]: departureDate, [Op.lte]: returnDate } }
  ]
});

export const generateRangeQuery = (dateFrom, dateTo, checkStatus) => {
  const [departureDate, returnDate] = [new Date(dateFrom), new Date(dateTo)];

  return !dateTo ? oneWayRangeQuery(departureDate) : multiRangeQuery(departureDate, returnDate, checkStatus);
};

export const includeStatusSubquery = (subQuery, status, modelName) => {
  let subqueryLogic;
  if (status === 'past') subqueryLogic = { [Op.ne]: 'Open' };
  else subqueryLogic = { [Op.iLike]: status };
  // construct status subquery
  const statusWhereSubquery = sequelize.where(
    sequelize.cast(sequelize.col(`${modelName}.status`), 'varchar'),
    subqueryLogic,
  );
  return {
    ...subQuery,
    where: sequelize.and(subQuery.where, statusWhereSubquery),
  };
};

export const createSearchClause = (columns, search, modelName) => {
  const clause = [];
  const columnPrefix = modelName ? `${modelName}.` : '';
  columns.forEach((column) => {
    const item = {
      [`${columnPrefix}${column}`]: sequelize.where(
        sequelize.fn(
          'LOWER',
          sequelize.cast(sequelize.col(`${columnPrefix}${column}`), 'varchar'),
        ),
        'LIKE',
        `%${search.toLowerCase()}%`,
      ),
    };
    clause.push(item);
  });
  return clause;
};

export const getModelSearchColumns = (modelName) => {
  let columnNames = [];
  if (modelName === 'Request') {
    columnNames = ['id', 'name', 'status', 'tripType'];
  } else if (modelName === 'Trip') {
    columnNames = ['origin', 'destination', 'departureDate'];
  }
  return columnNames;
};

export const composeInclude = (model, alias, where) => [
  {
    model,
    as: alias,
    where,
  },
];

export const composeTripInclude = (model, alias, where) => [
  {
    ...composeInclude(model, alias, where)[0],
    include: [{
      ...composeInclude(models.Bed, 'beds', null)[0],
      include: [{
        ...composeInclude(models.Room, 'rooms', null)[0],
        include: [{ ...composeInclude(models.GuestHouse, 'guestHouses', null)[0] }]
      }]
    }]
  },
];

export const createIncludeSubquery = (model, search, usePrefix = true) => {
  const prefix = usePrefix ? `${model.name.toLowerCase()}s` : null;
  const searchClause = createSearchClause(
    getModelSearchColumns(model.name),
    search,
    prefix,
  );
  const where = { [Op.or]: searchClause };
  let include = composeInclude(model, `${model.name.toLowerCase()}s`, where);
  if (model === models.Trip) {
    include = composeTripInclude(model, `${model.name.toLowerCase()}s`, where);
  }
  return include;
};

export function createSubquery({
  req, limit, offset, modelName, search
}) {
  const { status } = req.query;
  const userId = req.user.UserInfo.id;
  const searchClause = createSearchClause(
    getModelSearchColumns(modelName),
    search,
    modelName,
  );
  const tripInclude = createIncludeSubquery(models.Trip, search);
  const subQuery = {
    where: {
      userId,
      [Op.or]: searchClause,
    },
    include: [...tripInclude],
    limit,
    offset,
    order: [['createdAt', 'DESC'], [{ model: models.Trip, as: 'trips' }, 'departureDate']],
  };
  if (!status) return subQuery;
  return includeStatusSubquery(subQuery, status, modelName);
}

export function asyncWrapper(...args) {
  const [res, asyncFunction, ...rest] = args;
  /* istanbul ignore next */
  return asyncFunction(...rest).catch(() => Error.handleError('Server Error', 500, res));
}

export const retrieveParams = (req) => {
  const { page, limit, offset } = Pagination.initializePagination(req);
  return {
    page, limit, offset, status: req.query.status || '', search: req.query.search || '',
  };
};

export const srcRequestWhereClause = () => ({ status: ['Approved', 'Verified'] });
