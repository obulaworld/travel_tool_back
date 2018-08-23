import express from 'express';
import { auth, checkValidations } from '../../middlewares';
import validators from '../../helpers/validators';
import RequestsController from './RequestsController';

const Router = express.Router();

Router.get(
  '/requests',
  auth,
  validators,
  checkValidations,
  RequestsController.getUserRequests,
);


export default Router;
