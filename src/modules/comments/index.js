import express from 'express';
import middleware from '../../middlewares';
import CommentsController from './CommentsController';

const { authenticate } = middleware;
const Router = express.Router();

Router.post(
  '/comments',
  authenticate,
  CommentsController.createComment,
);

export default Router;
