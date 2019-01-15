import authenticate from './authenticate';
import Validator from './Validator';
import validateDirectReport from './validateDirectReport';
import tripValidator from './tripValidator';
import RoleValidator from './RoleValidator';
import analyticsValidator from './analyticsValidator';
import DocumentsValidator from './DocumentsValidator';
import ChecklistValidator from './checklistValidator';
import travelCalendarValidator from './travelCalendarValidator';
import RequestValidator from './RequestValidator';
import TravelReadinessDocumentValidator from './travelReadinessDocumentsValidator';
import ReminderEmailTemplateValidator from './reminderEmailTemplateValidator';
import ReminderValidator from './reminderValidator';

const middleware = {
  authenticate,
  Validator,
  validateDirectReport,
  tripValidator,
  RoleValidator,
  analyticsValidator,
  DocumentsValidator,
  ChecklistValidator,
  travelCalendarValidator,
  RequestValidator,
  TravelReadinessDocumentValidator,
  ReminderValidator,
  ReminderEmailTemplateValidator
};

export default middleware;
