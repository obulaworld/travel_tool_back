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
}
