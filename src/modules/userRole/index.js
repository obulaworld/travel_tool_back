import express from 'express';
import { authenticate, Validator } from '../../middlewares';
import UserRoleController from './UserRoleController';

const Router = express.Router();

Router.get('/user', authenticate, UserRoleController.getAllUser);
Router.get('/user/roles', authenticate, UserRoleController.getRoles);
Router.put('/user/admin', authenticate, UserRoleController.autoAdmin);
Router.get('/user/:id', authenticate, UserRoleController.getOneUser);

Router.post(
  '/user',
  authenticate,
  Validator.validateUser,
  Validator.checkEmail,
  UserRoleController.addUser,
);

Router.post(
  '/user/role',
  authenticate,
  Validator.validateAddRole,
  UserRoleController.isAdmin,
  UserRoleController.addRole,
);

Router.put(
  '/user/role/update',
  authenticate,
  UserRoleController.isAdmin,
  Validator.validateUserRole,
  UserRoleController.updateUserRole,
);

Router.get('/user/roles/:id', authenticate, UserRoleController.getOneRole);

export default Router;
