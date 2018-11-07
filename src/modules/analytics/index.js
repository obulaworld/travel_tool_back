import express from 'express';
import middleware from '../../middlewares';
import TripsController from './trips/TripsController';
import AnalyticsController from './travelRequests/analyticsController';
import ReadinessController from './travelReadiness/ReadinessController';
import { travelReadinessValidators } from '../../helpers/validators';


const Router = express.Router();

const {
  authenticate, RoleValidator, analyticsValidator, Validator
} = middleware;

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

Router.get(
  '/analytics/readiness',
  authenticate,
  travelReadinessValidators,
  Validator.validateRequest,
  RoleValidator.checkUserRole(
    ['Super Administrator', 'Travel Administrator']
  ),
  ReadinessController.getReadinessCsv
);


export default Router;