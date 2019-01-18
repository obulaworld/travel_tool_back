import * as _ from 'lodash';
import models from '../../database/models';
import CustomError from '../../helpers/Error';
import {
  paginateTemplates,
  paginateWithQuery,
  searchEmailTemplates
} from '../../helpers/reminderManagement/emailTemplatePagination';

export default class EmailTemplateController {
  static async createEmailTemplate(req, res) {
    try {
      const { user: { UserInfo: { id } } } = req;
      const user = await models.User.findOne({
        where: {
          userId: id,
        },
        attributes: {
          exclude: [
            'manager', 'occupation', 'department',
            'createdAt', 'updatedAt',
            'location', 'picture', 'gender', 'passportName'
          ]
        }
      });
      const data = {
        ...req.body,
        createdBy: user.id
      };
      data.cc = _.uniq(data.cc).join(',');
      const reminderEmailTemplate = await models.ReminderEmailTemplate.create(data);
      reminderEmailTemplate.creator = user;
      res.status(201).json({
        success: true,
        message: 'Reminder Email Template created successfully',
        reminderEmailTemplate
      });
    } catch (error) {
      /* istanbul ignore next */
      CustomError.handleError(error.message, 500, res);
    }
  }
  
  static async listEmailTemplates(req, res) {
    try {
      const limit = 6;
      const { query: { page, search } } = req;
      const data = search
        ? await models.ReminderEmailTemplate.findAndCountAll(searchEmailTemplates(search))
        : await models.ReminderEmailTemplate.findAndCountAll({ paranoid: false });
      const { count } = data;
      const pageCount = Math.ceil(count / limit);
      const currentPage = page < 1 || !page || pageCount === 0 ? 1 : Math.min(page, pageCount);
      const offset = limit * (currentPage - 1);
      const templates = search
        ? await paginateWithQuery(limit, offset, search)
        : await paginateTemplates(limit, offset);
      const output = {
        success: true,
        message: 'success',
        metaData: {
          templates,
          pagination: {
            pageCount,
            currentPage,
            totalCount: count
          }
        }
      };
      res.status(200).json(output);
    } catch (error) {
      /* istanbul ignore next */
      CustomError.handleError(error.message, 500, res);
    }
  }
}
