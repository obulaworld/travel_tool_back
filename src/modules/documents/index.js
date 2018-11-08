import express from 'express';
import middleware from '../../middlewares';
import DocumentsController from './DocumentsController';

const DocumentsRouter = express.Router();
const { authenticate } = middleware;

DocumentsRouter.delete(
  '/documents/:documentId',
  authenticate,
  DocumentsController.deleteDocument
);

DocumentsRouter.get(
  '/documents',
  authenticate,
  DocumentsController.fetchDocuments
);

export default DocumentsRouter;
