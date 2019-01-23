import cron from 'node-cron';
import moment from 'moment';
import { Op } from 'sequelize';
import NotificationEngine from '../notifications/NotificationEngine';
import CustomError from '../../helpers/Error';
import models from '../../database/models';

export default class ReminderEmails {
  static sendMail() {
    // run cron job everyday at midnight
    const task = cron.schedule('0 0 0 * * *', () => {
      ReminderEmails.executeMailSend();
    });
    task.start();
  }

  static async executeMailSend() {
    try {
      const reminders = await models.Reminder.findAll({
        include: [
          {
            model: models.Condition,
            as: 'condition',
          }, {
            model: models.ReminderEmailTemplate,
            as: 'emailTemplate'
          }]
      });
      const userGroup = await Promise.all(reminders.map(async (reminder) => {
        const usergroup = await models.TravelReadinessDocuments.findAll({
          where: {
            type: reminder.condition.documentType.toLowerCase(),
            data: {
              expiryDate: {
                [Op.eq]: ReminderEmails.dayRange(reminder.frequency)
              }
            },
          },
          attributes: ['id', 'type', 'userId'],
          include: [
            {
              model: models.User,
              as: 'user'
            }]
        });
        return usergroup;
      }));
      return await NotificationEngine.sendReminderEmail(userGroup, reminders);
    } catch (error) { /* istanbul ignore next */ CustomError.handleError(error.message, 500); }
  }

  static dayRange(frequency) {
    const today = new Date();
    const [length, period] = frequency.split(' ');
    const resultantExpiryDate = moment(today)
      .add(parseInt(length, 10), period).format('MM/DD/YYYY');
    return resultantExpiryDate.toString();
  }
}
