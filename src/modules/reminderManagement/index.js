import express from 'express';
import middleware from '../../middlewares';
import EmailTemplateController from './EmailTemplateController';

const ReminderManagementRouter = express.Router();
const { authenticate, RoleValidator, ReminderEmailTemplateValidator } = middleware;

ReminderManagementRouter.post(
  '/reminderManagement/emailTemplates',
  authenticate,
  RoleValidator.checkUserRole(
    ['Super Administrator', 'Travel Administrator']
  ),
  ReminderEmailTemplateValidator.validateReminderEmailTemplate,
  ReminderEmailTemplateValidator.validateCCEmails,
  ReminderEmailTemplateValidator.validateUniqueName,
  EmailTemplateController.createEmailTemplate
);

export default ReminderManagementRouter;
