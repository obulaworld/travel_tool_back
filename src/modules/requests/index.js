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
  Validator.validateTripBeds,
  RequestsController.createRequest,
);

RequestsRouter.put(
  '/requests/:requestId',
  authenticate,
  editAndCreateRequestValidators,
  Validator.validateRequest,
  Validator.validateTripBeds,
  RequestsController.updateRequest,
);

RequestsRouter.delete(
  '/requests/:requestId',
  authenticate,
  Validator.validateRequest,
  RequestsController.deleteRequest,
);

export default RequestsRouter;
