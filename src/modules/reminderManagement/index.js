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

ReminderManagementRouter.get(
  '/reminderManagement/emailTemplates',
  authenticate,
  RoleValidator.checkUserRole(
    ['Super Administrator', 'Travel Administrator']
  ),
  EmailTemplateController.listEmailTemplates,
);

ReminderManagementRouter.put(
  '/reminderManagement/emailTemplates/disable/:templateId',
  authenticate,
  RoleValidator.checkUserRole(
    ['Super Administrator', 'Travel Administrator']
  ),
  EmailTemplateController.disableEmailTemplate,
);

ReminderManagementRouter.put(
  '/reminderManagement/emailTemplates/enable/:templateId',
  authenticate,
  RoleValidator.checkUserRole(
    ['Super Administrator', 'Travel Administrator']
  ),
  ReminderEmailTemplateValidator.validateReqParams,
  EmailTemplateController.enableEmailTemplate,
);

export default ReminderManagementRouter;
