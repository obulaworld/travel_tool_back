import express from 'express';
import middleware from '../../middlewares';
import { getRequestsValidators } from '../../helpers/validators';
import ApprovalsController from './ApprovalsController';

const ApprovalsRouter = express.Router();

const { authenticate, Validator, validateDirectReport } = middleware;

ApprovalsRouter.get(
  '/approvals',
  authenticate,
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
