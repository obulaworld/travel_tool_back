import * as _ from 'lodash';
import models from '../../database/models';
import CustomError from '../../helpers/Error';

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
}
