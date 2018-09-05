import express from 'express';
import { authenticate } from '../../middlewares';
import CommentsController from './CommentsController';

const Router = express.Router();

Router.post(
  '/comments',
  authenticate,
  CommentsController.createComment,
);

export default Router;
