import express from 'express';
import middleware from '../../middlewares';
import TravelReasonsController from './TravelReasonsController';

const { authenticate, RoleValidator, TravelReasonsValidator } = middleware;

const TravelReasonsRouter = express.Router();

TravelReasonsRouter.post(
  '/request/reasons',
  authenticate,
  RoleValidator
    .checkUserRole(['Super Administrator', 'Travel Administrator', 'Travel Team Member']),
  TravelReasonsValidator.verifyId,
  TravelReasonsValidator.verifyTravelReasonBody,
  TravelReasonsValidator.verifyTitle,
  TravelReasonsController.createTravelReason,
);

TravelReasonsRouter.get(
  '/request/reasons',
  authenticate,
  RoleValidator.checkUserRole(
    ['Super Administrator', 'Travel Administrator', 'Travel Team Member']
  ),
  TravelReasonsValidator.validateParams,
  TravelReasonsController.getTravelReasons,
);

TravelReasonsRouter.delete(
  '/request/reasons/:reasonId',
  authenticate,
  RoleValidator.checkUserRole(
    ['Super Administrator', 'Travel Administrator', 'Travel Team Member']
  ),
  TravelReasonsValidator.verifyParam,
  TravelReasonsValidator.verifyId,
  TravelReasonsController.deleteReason,
);

export default TravelReasonsRouter;
