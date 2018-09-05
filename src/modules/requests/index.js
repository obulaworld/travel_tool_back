import express from 'express';
import { authenticate, Validator } from '../../middlewares';
import validators from '../../helpers/validators';
import RequestsController from './RequestsController';

const Router = express.Router();

Router.get(
  '/requests',
  authenticate,
  validators,
  Validator.validateGetRequests,
  RequestsController.getUserRequests,
);

Router.get(
  '/requests/:requestId',
  authenticate,
  RequestsController.getUserRequestDetails,
);

Router.post(
  '/requests',
  authenticate,
  Validator.validateCreateRequests, // check req.body
  RequestsController.createRequest,
);

export default Router;
