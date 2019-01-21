import express from 'express';
import middleware from '../../middlewares';
import RemindersController from './remindersController';

const { authenticate, RoleValidator, ReminderValidator } = middleware;

const RemindersRouter = express.Router();

RemindersRouter.post(
  '/reminders',
  authenticate,
  RoleValidator.checkUserRole(
    ['Super Administrator', 'Travel Administrator', 'Travel Team Member']
  ),
  ReminderValidator.validateReminder,
  ReminderValidator.validateReminderTemplates,
  ReminderValidator.validateUniqueReminderCondition,
  RemindersController.createReminder,
);

RemindersRouter.get(
  '/reminders',
  authenticate,
  RoleValidator.checkUserRole(
    ['Super Administrator', 'Travel Administrator']
  ),
  RemindersController.viewReminders
);

RemindersRouter.put(
  '/reminders/conditions/disable/:conditionId',
  authenticate,
  RoleValidator.checkUserRole(
    ['Super Administrator', 'Travel Administrator', 'Travel Team Member']
  ),
  ReminderValidator.checkIfConditionExists,
  ReminderValidator.validateReason,
  RemindersController.disableReminderConditions,
);

RemindersRouter.put(
  '/reminders/conditions/enable/:conditionId',
  authenticate,
  RoleValidator.checkUserRole(
    ['Super Administrator', 'Travel Administrator', 'Travel Team Member']
  ),
  ReminderValidator.checkIfDisabledConditionExists,
  RemindersController.enableReminderConditions
);

export default RemindersRouter;
