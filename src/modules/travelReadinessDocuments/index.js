import express from 'express';
import middleware from '../../middlewares';
import TravelReadinessController from './TravelReadinessController';

const { authenticate, TravelReadinessDocumentValidator, RoleValidator } = middleware;
const TravelReadinessRouter = express.Router();

TravelReadinessRouter.post(
  '/travelreadiness',
  authenticate,
  TravelReadinessDocumentValidator.validateInput,
  TravelReadinessDocumentValidator.validateUniqueVisa,
  TravelReadinessDocumentValidator.validatePassportUnique,
  TravelReadinessController.addTravelReadinessDocument,
);

TravelReadinessRouter.get(
  '/travelreadiness/users',
  authenticate,
  RoleValidator.checkUserRole(
    ['Super Administrator', 'Travel Administrator']
  ),
  TravelReadinessController.getAllUsersReadiness,
);

TravelReadinessRouter.get(
  '/travelreadiness/users/:userId',
  authenticate,
  RoleValidator.checkUserRole(
    ['Super Administrator', 'Travel Administrator']
  ),
  TravelReadinessController.getUserReadiness,
);

TravelReadinessRouter.get(
  '/travelreadiness/documents/:documentId',
  authenticate,
  RoleValidator.checkUserRole(
    ['Super Administrator', 'Travel Administrator']
  ),
  TravelReadinessController.getTravelReadinessDocument,
);

TravelReadinessRouter.put(
  '/travelreadiness/documents/:documentId/verify',
  authenticate,
  RoleValidator.checkUserRole(['Super Administrator', 'Travel Administrator']),
  TravelReadinessController.verifyTravelReadinessDocuments
);

export default TravelReadinessRouter;
