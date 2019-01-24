import * as _ from 'lodash';
import models from '../../database/models';
import CustomError from '../../helpers/Error';
import RemindersController from '../reminders/remindersController';
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
        : await models.ReminderEmailTemplate.findAndCountAll(
          {
            paranoid: false,
          }
        );
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
      CustomError.handleError(error.message, 500, res);
    }
  }
  
  static async disableEmailTemplate(req, res) {
    try {
      const { templateId } = req.params;
      const { reason } = req.body;
      const emailTemplate = await models.ReminderEmailTemplate.findById(templateId);

      if (!emailTemplate) {
        return res.status(404).json({
          success: false,
          message: 'Email Template does not exist',
        });
      }

      if (!reason || !reason.trim()) {
        return res.status(409).json({
          success: false,
          message: 'Reason for disabling Email Template is required',
        });
      }

      await emailTemplate.update({
        disabled: true,
      });

      const Reason = await RemindersController.createDisableReason(
        req, 'reminderEmailTemplateId', emailTemplate
      );

      return res.status(200).json({
        success: true,
        message: `${emailTemplate.name} has been successfully disabled`,
        updatedTemplate: emailTemplate,
        reason: Reason
      });
    } catch (error) { /* istanbul ignore next */
      CustomError.handleError(error.message, 500, res);
    }
  }

  static async enableEmailTemplate(req, res) {
    try {
      const { templateId } = req.params;
      const emailTemplate = await models.ReminderEmailTemplate.findById(templateId);
      if (!emailTemplate) {
        return res.status(404).json({
          success: false,
          message: 'Reminder email Template does not exist',
        });
      }
      await emailTemplate.update({
        disabled: false,
      });
      return res.status(200).json({
        success: true,
        message: 'Reminder email template has been successfully enabled',
        updatedTemplate: emailTemplate,
      });
    } catch (error) {
      CustomError.handleError(error.message, 500, res);
    }
  }
}
