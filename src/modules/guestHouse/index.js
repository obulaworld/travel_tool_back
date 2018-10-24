import express from 'express';
import GuestHouseController from './GuestHouseController';
import middlewares from '../../middlewares';

const { authenticate, Validator, RoleValidator } = middlewares;
const Router = express.Router();

Router.get(
  '/guesthouses',
  authenticate,
  RoleValidator.checkUserRole(
    ['Super Administrator', 'Travel Administrator']
  ),
  GuestHouseController.getGuestHouses
);

Router.post(
  '/guesthouses',
  authenticate,
  RoleValidator.checkUserRole(
    ['Super Administrator', 'Travel Administrator']
  ),
  Validator.validateImage,
  Validator.validateGuestHouse,
  GuestHouseController.postGuestHouse
);

Router.get(
  '/availablerooms',
  authenticate,
  Validator.validateAvailableRooms,
  GuestHouseController.getAvailableRooms
);

Router.put(
  '/room/:id',
  authenticate,
  RoleValidator.checkUserRole(
    ['Super Administrator', 'Travel Administrator']
  ),
  Validator.checkFaultRoomStatus,
  GuestHouseController.updateRoomFaultyStatus
);


Router.put('/guesthouses/:id',
  authenticate,
  RoleValidator.checkUserRole(
    ['Super Administrator', 'Travel Administrator']
  ),
  Validator.validateImage,
  Validator.validateGuestHouse,
  GuestHouseController.editGuestHouse);

Router.get(
  '/guesthouses/:guestHouseId',
  authenticate,
  Validator.checkDate,
  RoleValidator.checkUserRole(
    ['Super Administrator', 'Travel Administrator']
  ),
  GuestHouseController.getGuestHouseDetails
);

export default Router;
