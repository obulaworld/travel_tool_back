import express from 'express';
import middleware from '../../middlewares';
import TravelReadinessController from './TravelReadinessController';

const { authenticate, TravelReadinessDocumentValidator } = middleware;
const TravelReadinessRouter = express.Router();

TravelReadinessRouter.post(
  '/travelreadiness',
  authenticate,
  TravelReadinessDocumentValidator.validateInput,
  TravelReadinessDocumentValidator.validateUniqueVisa,
  TravelReadinessController.addTravelReadinessDocument,
);

export default TravelReadinessRouter;
