import express from 'express';
import CentersController from './CentersController';
import middlewares from '../../middlewares';

const { authenticate } = middlewares;
const Router = express.Router();

Router.get('/centers',
  authenticate,
  CentersController.getCenters);

export default Router;
