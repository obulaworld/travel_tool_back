import express from 'express';
import middleware from '../../middlewares';
import CommentsController from './CommentsController';

const { authenticate, Validator } = middleware;
const Router = express.Router();

Router.post(
  '/comments',
  authenticate,
  Validator.validateComment,
  CommentsController.createComment,
);

Router.put(
  '/comments/:id',
  authenticate,
  Validator.validateComment,
  CommentsController.editComment,
);

export default Router;
