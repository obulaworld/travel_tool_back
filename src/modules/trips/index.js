import express from 'express';
import middleware from '../../middlewares';
import TripsController from './TripsController';

const TripsRouter = express.Router();

const { authenticate, tripValidator } = middleware;

TripsRouter.put(
  '/trips/:tripId',
  authenticate,
  tripValidator.validateCheckType,
  tripValidator.checkTripExists,
  tripValidator.checkTripOwner,
  tripValidator.checkTripApproved,
  TripsController.updateCheckStatus,
);

TripsRouter.get(
  '/trips',
  authenticate,
  TripsController.getTrips,
);

export default TripsRouter;
