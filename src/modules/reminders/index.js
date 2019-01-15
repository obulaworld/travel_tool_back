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

export default RemindersRouter;
