import express from 'express';
import middleware from '../../middlewares';
import validators from '../../helpers/validators';
import ApprovalsController from './approvals';

const ApprovalsRouter = express.Router();

const { authenticate, Validator, validateDirectReport } = middleware;

ApprovalsRouter.get(
  '/approvals',
  authenticate,
  validators,
  Validator.validateGetRequests,
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
