import express from 'express';
import middleware from '../../middlewares';
import { getRequestsValidators } from '../../helpers/validators';
import ApprovalsController from './ApprovalsController';

const ApprovalsRouter = express.Router();

const {
  authenticate, Validator, validateDirectReport, RoleValidator
} = middleware;

ApprovalsRouter.get(
  '/approvals',
  authenticate,
  RoleValidator.checkUserRole(
    ['Super Administrator', 'Travel Administrator', 'Manager', 'Travel Team Member']
  ),
  getRequestsValidators,
  Validator.validateRequest,
  ApprovalsController.getUserApprovals,
);

ApprovalsRouter.put(
  '/approvals/:requestId',
  authenticate,
  Validator.validateStatus,
  validateDirectReport,
  ApprovalsController.updateRequestStatus,
);

export default ApprovalsRouter;
