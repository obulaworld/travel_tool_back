import express from 'express';
import middleware from '../../middlewares';
import TravelStipendController from './TravelStipendController';

const {
  authenticate,
  RoleValidator,
  TravelStipendValidator
} = middleware;
const TravelStipendRouter = express.Router();

TravelStipendRouter.post(
  '/travelStipend',
  authenticate,
  TravelStipendValidator.validateNewStipend,
  TravelStipendValidator.checkCenter,
  RoleValidator.checkUserRole(
    ['Super Administrator', 'Travel Administrator', 'Travel Team Member']
  ),
  TravelStipendController.createTravelStipend,
);

TravelStipendRouter.get('/travelStipend',
  authenticate,
  RoleValidator.checkUserRole(
    ['Super Administrator', 'Travel Administrator', 'Travel Team Member']
  ),
  TravelStipendController.getAllTravelStipends);
  
export default TravelStipendRouter;
