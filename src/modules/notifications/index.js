import express from 'express';
import middleware from '../../middlewares';
import NotificationController from './NotificationsController';

const NotificationsRouter = express.Router();

const { authenticate, Validator } = middleware;

NotificationsRouter.get(
  '/notifications',
  authenticate,
  Validator.validateGetRequests,
  NotificationController.RetrieveNotifications
);

export default NotificationsRouter;
