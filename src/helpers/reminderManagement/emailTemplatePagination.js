import { Op } from 'sequelize';
import models from '../../database/models';

const include = [{
  model: models.User,
  as: 'creator',
  attributes: {
    exclude: [
      'manager', 'occupation', 'department',
      'id', 'createdAt', 'updatedAt',
      'location', 'picture', 'gender', 'passportName'
    ]
  }
}];

export const searchEmailTemplates = search => ({
  paranoid: false,
  where: {
    [Op.or]: [
      { name: { [Op.iLike]: `${search}` } },
      { from: { [Op.iLike]: `${search}` } },
      { cc: { [Op.iLike]: `${search}` } },
      { subject: { [Op.iLike]: `${search}` } },
      { message: { [Op.iLike]: `${search}` } },
    ]
  }
});

export const paginateTemplates = async (limit, offset) => {
  const templates = await models.ReminderEmailTemplate.findAll({
    paranoid: false,
    include,
    offset,
    limit,
    order: [['id', 'DESC']],
  });
  return templates;
};

export const paginateWithQuery = async (limit, offset, search) => {
  const templates = await models.ReminderEmailTemplate.findAll({
    order: [['id', 'DESC']],
    ...searchEmailTemplates(search),
    paranoid: false,
    include,
    limit,
    offset,
  });
  return templates;
};
