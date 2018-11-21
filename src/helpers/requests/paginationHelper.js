import models from '../../database/models';
import { createSearchClause, getModelSearchColumns, createIncludeSubquery } from '.';

const { Op } = models.Sequelize;
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

export const getVerifiedRecords = async (model, location, search, status) => {
  let count = 0;
  const requestSearchClause = createSearchClause(
    getModelSearchColumns('Request'), search, 'Request',
  );
  const tripInclude = createIncludeSubquery(models.Trip, search, false);
  count = await model.count({
    distinct: true,
    where: { status },
    include: [{
      model: models.Request,
      as: 'Request',
      where: { status, [Op.or]: requestSearchClause },
      include: [{ ...tripInclude[0], where: { origin: { [Op.iLike]: `${location}%` } } }],
    }],
  });
  if (!count) {
    const tripWhere = { ...tripInclude[0].where, origin: { [Op.iLike]: `${location}%` } };
    count = await model.count({
      distinct: true,
      where: { status },
      include: [{
        model: models.Request,
        as: 'Request',
        where: { status },
        include: [{ ...tripInclude[0], where: { ...tripWhere } }],
      }],
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

export const countVerifiedByStatus = async (model, location, search) => {
  const count = {};
  count.approved = await getVerifiedRecords(model, location, search, 'Approved');
  count.verified = await getVerifiedRecords(model, location, search, 'Verified');
  return count;
};

export const getTotalCount = (status, statusCount) => {
  const statusTypeA = ('approved' in statusCount) ? 'approved' : 'open';
  const statusTypeB = ('verified' in statusCount) ? 'verified' : 'past';
  let totalCount = statusCount[statusTypeA] + statusCount[statusTypeB];
  if (status === statusTypeA) totalCount = statusCount[statusTypeA];
  if (status && status !== statusTypeA) totalCount = statusCount[statusTypeB];
  return totalCount;
};
