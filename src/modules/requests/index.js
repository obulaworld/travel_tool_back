import express from 'express';
import middleware from '../../middlewares';
import validators from '../../helpers/validators';
import RequestsController from './RequestsController';

const RequestsRouter = express.Router();

const { authenticate, Validator } = middleware;

RequestsRouter.get(
  '/requests',
  authenticate,
  validators,
  Validator.validateGetRequests,
  RequestsController.getUserRequests,
);

RequestsRouter.get(
  '/requests/:requestId',
  authenticate,
  RequestsController.getUserRequestDetails,
);

RequestsRouter.post(
  '/requests',
  authenticate,
  Validator.validateCreateRequests, // check req.body
  RequestsController.createRequest,
);

export default RequestsRouter;
