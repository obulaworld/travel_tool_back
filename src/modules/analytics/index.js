import express from 'express';
import middleware from '../../middlewares';
import TripsController from './trips/TripsController';
import AnalyticsController from './travelRequests/analyticsController';


const Router = express.Router();

const { authenticate, RoleValidator, analyticsValidator } = middleware;

Router.get(
  '/analytics/trips/departments',
  authenticate,
  RoleValidator.checkUserRole(
    ['Super Administrator', 'Travel Administrator']
  ),
  analyticsValidator.validateFilterAndType,
  TripsController.getTripsPerMonth,
);

Router.get('/analytics',
  authenticate, RoleValidator.checkUserRole(['Super Administrator', 'Travel Administrator']),
  AnalyticsController.analytics);

export default Router;
