import express from 'express';
import middleware from '../../middlewares';
import TravelChecklistController from './TravelChecklistController';
import {
  validateChecklistItem,
  deleteChecklistItem
} from '../../helpers/validators';

const TravelChecklistRouter = express.Router();

const { authenticate, Validator, RoleValidator } = middleware;

TravelChecklistRouter.get(
  '/checklists',
  authenticate,
  RoleValidator.validateChecklistQuery,
  RoleValidator.validateRequestIdQuery,
  RoleValidator.validateDestinationNameQuery,
  TravelChecklistController.getChecklistsResponse
);

TravelChecklistRouter.delete(
  '/checklists/:checklistId',
  authenticate,
  RoleValidator.checkUserRole(
    ['Super Administrator', 'Travel Administrator']
  ),
  deleteChecklistItem,
  Validator.validateRequest,
  TravelChecklistController.deleteChecklistItem,
);

TravelChecklistRouter.post(
  '/checklists',
  authenticate,
  RoleValidator.checkUserRole(
    ['Super Administrator', 'Travel Administrator']
  ),
  validateChecklistItem,
  Validator.validateRequest,
  TravelChecklistController.createChecklistItem,
);

TravelChecklistRouter.put(
  '/checklists/:checklistId',
  authenticate,
  RoleValidator.checkUserRole(
    ['Super Administrator', 'Travel Administrator']
  ),
  validateChecklistItem,
  Validator.validateRequest,
  TravelChecklistController.updateChecklistItem,
);

export default TravelChecklistRouter;
