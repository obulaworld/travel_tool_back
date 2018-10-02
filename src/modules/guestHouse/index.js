import express from 'express';
import GuestHouseController from './GuestHouseController';
import middlewares from '../../middlewares';

const { authenticate, Validator } = middlewares;
const Router = express.Router();

Router.get('/guesthouses',
  authenticate,
  Validator.checkUserRole,
  GuestHouseController.getGuestHouses);

Router.post('/guesthouses',
  authenticate,
  Validator.checkUserRole,
  Validator.validateCreateGuestHouse,
  Validator.checkUserRole,
  GuestHouseController.postGuestHouse);

export default Router;
