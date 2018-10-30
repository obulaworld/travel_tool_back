import express from 'express';
import middleware from '../../middlewares';
import TripsController from './trips/TripsController';

const TripsRouter = express.Router();

const { authenticate, RoleValidator, analyticsValidator } = middleware;

TripsRouter.get(
  '/analytics/trips/departments',
  authenticate,
  RoleValidator.checkUserRole(
    ['Super Administrator', 'Travel Administrator']
  ),
  analyticsValidator.validateFilterAndType,
  TripsController.getTripsPerMonth,
);

export default TripsRouter;
