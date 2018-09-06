import models from '../../database/models';

const { Op } = models.Sequelize;
const { sequelize } = models;

export function createSubquery(req, limit, offset, modelName) {
  const { status } = req.query;
  const userId = req.user.UserInfo.id;

  let userIdColName = 'userId';
  if (modelName === 'Approval') userIdColName = 'approverId';
  // userId where subquery
  let subQuery = {
    where: { [userIdColName]: userId },
    limit,
    offset,
    order: [['createdAt', 'DESC']],
  };
  if (!status) return subQuery;
  // create a status where subquery
  let subqueryLogic;
  if (status === 'past') subqueryLogic = { [Op.ne]: 'Open' };
  else subqueryLogic = { [Op.iLike]: status };
  // construct status subquery
  const statusWhereSubquery = sequelize.where(
    sequelize.cast(sequelize.col(`${modelName}.status`), 'varchar'),
    subqueryLogic
  );
  // join the queries
  subQuery = {
    ...subQuery,
    where: sequelize.and(subQuery.where, statusWhereSubquery)
  };
  return subQuery;
}


export const countByStatus = async (model, userId) => {
  let userIdColName = 'userId';
  if (model.name === 'Approval') userIdColName = 'approverId';

  const openRecords = await model.count({
    where: {
      status: 'Open',
      [userIdColName]: userId,
    },
  });

  const pastRecords = await model.count({
    where: {
      status: { [Op.ne]: 'Open' },
      [userIdColName]: userId,
    },
  });

  const count = {
    open: openRecords,
    past: pastRecords,
  };

  return count;
};
