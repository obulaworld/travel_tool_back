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
  Validator.validateGuestHouse,
  GuestHouseController.postGuestHouse);

Router.put('/guesthouses/:id',
  authenticate,
  Validator.checkUserRole,
  Validator.validateGuestHouse,
  GuestHouseController.editGuestHouse);

Router.get(
  '/guesthouses/:guestHouseId',
  authenticate,
  Validator.checkDate,
  Validator.checkUserRole,
  GuestHouseController.getGuestHouseDetails
);

export default Router;
