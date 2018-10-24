import express from 'express';
import middleware from '../../middlewares';
import {
  getRequestsValidators,
  editAndCreateRequestValidators,
} from '../../helpers/validators';
import RequestsController from './RequestsController';

const RequestsRouter = express.Router();

const { authenticate, Validator } = middleware;

RequestsRouter.get(
  '/requests',
  authenticate,
  getRequestsValidators,
  Validator.validateRequest,
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
  editAndCreateRequestValidators,
  Validator.validateRequest, // check req.body
  RequestsController.createRequest,
);

RequestsRouter.put(
  '/requests/:requestId',
  authenticate,
  editAndCreateRequestValidators,
  Validator.validateRequest,
  RequestsController.updateRequest,
);

export default RequestsRouter;
