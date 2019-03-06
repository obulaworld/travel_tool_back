import express from 'express';
import middleware from '../../middlewares';
import { getRequestsValidators } from '../../helpers/validators';
import ApprovalsController from './ApprovalsController';
import BudgetApprovalsController from './BudgetApprovalsController';

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


ApprovalsRouter.get(
  '/approvals/budget',
  authenticate,
  RoleValidator.checkUserRole(['Super Administrator', 'Budget Checker']),
  getRequestsValidators,
  Validator.validateRequest,
  BudgetApprovalsController.getBudgetApprovals
);

ApprovalsRouter.put(
  '/approvals/:requestId',
  authenticate,
  Validator.validateStatus,
  validateDirectReport,
  ApprovalsController.updateRequestStatus,
);

export default ApprovalsRouter;
