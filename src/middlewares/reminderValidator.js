import Validator from './Validator';
import models from '../database/models';

class ReminderValidator {
  static validateReminder(req, res, next) {
    req.checkBody('conditionName', 'Condition Name is required').notEmpty().trim()
      .len({ min: 4 })
      .withMessage('Condition name should be more than 4 characters');
    req.checkBody('documentType', 'Document Type is either Passport or Visa').trim()
      .isIn(['Passport', 'Visa']);
    req.checkBody('reminders', 'Reminders should be a list of reminders').isArray().notEmpty();
    req.checkBody('reminders.*.frequency', 'Reminder frequency is required').notEmpty().trim();
    req.checkBody('reminders.*.reminderEmailTemplateId', 'Reminder email template is required')
      .notEmpty().trim().isInt()
      .withMessage('Reminder email template must be a number');

    const errors = req.validationErrors();
    Validator.errorHandler(res, errors, next);
  }


  static async validateReminderTemplates(req, res, next) {
    const { reminders } = req.body;
    const reminderTemplates = await models.ReminderEmailTemplate.findAll({
      attributes: ['id', 'name']
    });

    const validPeriods = ['Days', 'Weeks', 'Months', 'Years'];
    const errors = [];

    reminders.forEach((reminder, index) => {
      const reminderExists = reminderTemplates
        .some(template => Number(reminder.reminderEmailTemplateId) === template.id);

      if (!reminderExists) {
        errors.push({
          location: 'body',
          param: `reminders[${index}].reminderEmailTemplateId`,
          msg: 'Reminder email template does not exist',
          value: `${reminder.reminderEmailTemplateId}`
        });
      }

      const [length, period] = reminder.frequency.split(' ');

      const isNumber = /^\d+$/.test(length);
      const isValidPeriod = validPeriods.includes(period);

      if (!isNumber || !isValidPeriod) {
        errors.push({
          location: 'body',
          param: `reminders[${index}].frequency`,
          msg: 'Invalid reminder frequency value',
          value: reminder.frequency
        });
      }
    });
    if (errors.length) return Validator.errorHandler(res, errors, next);
    next();
  }

  static async validateUniqueReminderCondition(req, res, next) {
    const { conditionName } = req.body;
    const existingCondition = await models.Condition.findOne({
      where: {
        conditionName,
      }
    });

    if (existingCondition) {
      const errors = [
        {
          msg: 'Reminder condition name already exists',
          param: 'conditionName'
        }
      ];
      return Validator.errorHandler(res, errors, next);
    }
    next();
  }

  static async checkIfDisabledConditionExists(req, res, next) {
    const { conditionId } = req.params;

    if (!Number.isInteger(Number(req.params.conditionId))) {
      return res.status(422).json({ success: false, message: 'The Condition ID is not an integer' });
    }
    const condition = await models.Condition.findOne({
      where: { id: conditionId, disabled: true }
    });

    if (condition) {
      return next();
    }

    return res.status(404).json({ success: false, message: 'Condition not found' });
  }


  static async checkIfConditionExists(req, res, next) {
    const { conditionId } = req.params;

    if (!Number.isInteger(Number(conditionId))) {
      return res.status(422).json({ success: false, message: 'Condition ID is not an integer' });
    }
    const condition = await models.Condition.findOne({
      where: { id: conditionId, disabled: false }
    });

    if (condition) {
      return next();
    }
    return res.status(404).json({ success: false, message: 'Condition not found' });
  }

  static async validateReason(req, res, next) {
    req.checkBody('reason', 'Reason for disabling is required')
      .notEmpty().trim();
    req.checkBody('reason', 'Reason must contain at least five characters')
      .len({ min: 5 });
    const errors = req.validationErrors();
    Validator.errorHandler(res, errors, next);
  }
}

export default ReminderValidator;
