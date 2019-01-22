import { Op, Sequelize } from 'sequelize';
import * as _ from 'lodash';
import models from '../../database/models';
import CustomError from '../../helpers/Error';

export default class RemindersController {
  static async createReminder(req, res) {
    try {
      const { reminders, ...conditionData } = req.body;
      await models.sequelize.transaction(async () => {
        const condition = await models.Condition.create({
          ...conditionData,
          userId: req.user.UserInfo.id,
        });
        const createdReminders = await models.Reminder.bulkCreate(
          reminders.map(reminder => ({
            ...reminder,
            conditionId: condition.id,
          })),
          { returning: true }
        );
        return res.status(201).json({
          success: true,
          message: 'Reminder successfully created',
          reminder: {
            condition,
            reminders: createdReminders,
          }
        });
      });
    } catch (error) { /* istanbul ignore next */
      CustomError.handleError(error.message, 500, res);
    }
  }

  static async viewReminders(req, res) {
    try {
      const documentType = req.query.document;
      const documentCount = await models.Condition.findAll({
        group: ['documentType'],
        attributes: ['documentType', [Sequelize.fn('count', 'documentType'), 'count']],
        raw: true
      });
      const query = {
        include: [{
          model: models.User,
          as: 'user',
          attributes: {
            exclude: [
              'passportName', 'department', 'occupation',
              'manager', 'userId', 'gender', 'picture',
              'location', 'updatedAt', 'createdAt', 'id', 'email']
          }
        }],
        where: documentType ? {
          documentType: {
            [Op.iLike]: `%${documentType}%`
          }
        } : {}
      };
      const reminders = await models.Condition.findAll(query);
      res.status(200).json({
        success: true,
        message: `Successfully retrieved ${documentType || 'reminder'}s`,
        reminders,
        meta: { documentCount: _.mapValues(_.keyBy(documentCount, 'documentType'), 'count') }
      });
    } catch (error) {
      CustomError.handleError(error.message, 500, res);
    }
  }
}
