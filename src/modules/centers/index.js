import express from 'express';
import CentersController from './CentersController';
import middlewares from '../../middlewares';

const { authenticate, RoleValidator, Validator } = middlewares;
const Router = express.Router();

Router.get('/centers', authenticate, CentersController.getCenters);

Router.patch(
  '/center/user/:id',
  authenticate,
  RoleValidator.validateUpdateCenter,
  RoleValidator.validateUpdateCenterBody,
  RoleValidator.checkUserRole(['Super Administrator', 'Travel Administrator']),
  Validator.centerExists,
  CentersController.changeCenter
);

Router.get('/centers',
  authenticate,
  CentersController.getCenters);

Router.post('/centers',
  authenticate,
  Validator.validateNewCentre,
  RoleValidator.checkUserRole(['Super Administrator']),
  CentersController.createCenter);

export default Router;
