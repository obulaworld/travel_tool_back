import models from '../../database/models';
import Error from '../Error';
import Pagination from '../Pagination';

const { Op } = models.Sequelize;
const { sequelize } = models;

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

export const createIncludeSubquery = (model, search, usePrefix = true) => {
  const prefix = usePrefix ? `${model.name.toLowerCase()}s` : null;
  const searchClause = createSearchClause(
    getModelSearchColumns(model.name),
    search,
    prefix,
  );
  const where = { [Op.or]: searchClause };
  const include = composeInclude(model, `${model.name.toLowerCase()}s`, where);
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
    order: [['createdAt', 'DESC']],
  };
  if (!status) return subQuery;
  return includeStatusSubquery(subQuery, status, modelName);
}

export const getOpenRequestRecords = async (model, userId, search) => {
  let count = 0;
  const searchClause = createSearchClause(
    getModelSearchColumns(model.name),
    search,
    model.name,
  );
  const tripInclude = createIncludeSubquery(models.Trip, search);
  count = await model.count({
    distinct: true,
    where: { status: 'Open', userId, [Op.or]: searchClause },
    include: [{ ...tripInclude[0], where: undefined }],
  });
  if (!count) {
    count = await model.count({
      distinct: true,
      where: { status: 'Open', userId },
      include: tripInclude,
    });
  }
  return count;
};

export const getPastRequestRecords = async (model, userId, search) => {
  let count = 0;
  const searchClause = createSearchClause(
    getModelSearchColumns(model.name),
    search,
    model.name,
  );
  const tripInclude = createIncludeSubquery(models.Trip, search);
  count = await model.count({
    distinct: true,
    where: { status: { [Op.ne]: 'Open' }, userId, [Op.or]: searchClause },
    include: [{ ...tripInclude[0], where: undefined }],
  });
  if (!count) {
    count = await model.count({
      distinct: true,
      where: { status: { [Op.ne]: 'Open' }, userId },
      include: tripInclude,
    });
  }
  return count;
};

export const getOpenApprovalRecords = async (model, userId, search) => {
  let count = 0;
  const requestSearchClause = createSearchClause(
    getModelSearchColumns('Request'),
    search,
    'Request',
  );
  const tripInclude = createIncludeSubquery(models.Trip, search, false);
  count = await model.count({
    distinct: true,
    where: { status: 'Open', approverId: userId },
    include: [
      {
        model: models.Request,
        as: 'Request',
        where: { status: 'Open', [Op.or]: requestSearchClause },
        include: [{ ...tripInclude[0], where: undefined }],
      },
    ],
  });
  if (!count) {
    count = await model.count({
      distinct: true,
      where: { status: 'Open', approverId: userId },
      include: [
        {
          model: models.Request,
          as: 'Request',
          where: { status: 'Open' },
          include: tripInclude,
        },
      ],
    });
  }
  return count;
};

export const getPastApprovalRecords = async (model, userId, search) => {
  let count = 0;
  const requestSearchClause = createSearchClause(
    getModelSearchColumns('Request'),
    search,
    'Request',
  );
  const tripInclude = createIncludeSubquery(models.Trip, search, false);
  count = await model.count({
    distinct: true,
    where: { status: { [Op.ne]: 'Open' }, approverId: userId },
    include: [
      {
        model: models.Request,
        as: 'Request',
        where: { status: { [Op.ne]: 'Open' }, [Op.or]: requestSearchClause },
        include: [{ ...tripInclude[0], where: undefined }],
      },
    ],
  });
  if (!count) {
    count = await model.count({
      distinct: true,
      where: { status: { [Op.ne]: 'Open' }, approverId: userId },
      include: [
        {
          model: models.Request,
          as: 'Request',
          where: { status: { [Op.ne]: 'Open' } },
          include: tripInclude,
        },
      ],
    });
  }
  return count;
};

export const countByStatus = async (model, userId, search) => {
  const count = {};
  if (model.name === 'Approval') {
    count.open = await getOpenApprovalRecords(model, userId, search);
    count.past = await getPastApprovalRecords(model, userId, search);
  } else {
    count.open = await getOpenRequestRecords(model, userId, search);
    count.past = await getPastRequestRecords(model, userId, search);
  }
  return count;
};

export const getTotalCount = (status, statusCount) => {
  let totalCount = statusCount.open + statusCount.past;
  if (status === 'open') totalCount = statusCount.open;
  if (status && status !== 'open') totalCount = statusCount.past;
  return totalCount;
};

export function asyncWrapper(...args) {
  const [res, asyncFunction, ...rest] = args;
  /* istanbul ignore next */
  return asyncFunction(...rest).catch(() => Error.handleError('Server Error', 500, res));
}

export const retrieveParams = (req) => {
  const { page, limit, offset } = Pagination.initializePagination(req);
  return {
    page,
    limit,
    offset,
    status: req.query.status || '',
    search: req.query.search || '',
  };
};
