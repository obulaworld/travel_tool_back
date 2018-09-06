import models from '../../database/models';

const { Op } = models.Sequelize;
const { sequelize } = models;

const includeStatusSubquery = (subQuery, status, modelName) => {
  let subqueryLogic;
  if (status === 'past') subqueryLogic = { [Op.ne]: 'Open' };
  else subqueryLogic = { [Op.iLike]: status };
  // construct status subquery
  const statusWhereSubquery = sequelize.where(
    sequelize.cast(sequelize.col(`${modelName}.status`), 'varchar'),
    subqueryLogic
  );
  return {
    ...subQuery,
    where: sequelize.and(subQuery.where, statusWhereSubquery)
  };
};

export function createSubquery(req, limit, offset, modelName) {
  const { status } = req.query;
  let userId = req.user.UserInfo.id;
  const userName = req.user.UserInfo.name;
  let userIdColName = 'userId';
  if (modelName === 'Approval') {
    /* FIX: Approvals should use manager's email or unique ID instead of name */
    userIdColName = 'approverId';
    userId = userName;
  }
  // userId where subquery
  const subQuery = {
    where: { [userIdColName]: userId },
    limit,
    offset,
    order: [['createdAt', 'DESC']]
  };
  if (!status) return subQuery;
  return includeStatusSubquery(subQuery, status, modelName);
}

export const countByStatus = async (model, userId) => {
  let userIdColName = 'userId';
  if (model.name === 'Approval') userIdColName = 'approverId';

  const openRecords = await model.count({
    where: {
      status: 'Open',
      [userIdColName]: userId
    }
  });

  const pastRecords = await model.count({
    where: {
      status: { [Op.ne]: 'Open' },
      [userIdColName]: userId
    }
  });

  const count = {
    open: openRecords,
    past: pastRecords
  };

  return count;
};
