import express from 'express';
import middlewares from '../../middlewares';
import CommentsController from './CommentsController';

const Router = express.Router();
const { authenticate } = middlewares;

Router.post(
  '/comments',
  authenticate,
  CommentsController.createComment,
);

export default Router;
