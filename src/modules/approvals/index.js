import express from 'express';
import middleware from '../../middlewares';
import validators from '../../helpers/validators';
import ApprovalsController from './approvals';

const ApprovalsRouter = express.Router();

const { authenticate, Validator } = middleware;

ApprovalsRouter.get(
  '/approvals',
  authenticate,
  validators,
  Validator.validateGetRequests,
  ApprovalsController.getUserApprovals,
);

export default ApprovalsRouter;
