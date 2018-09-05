import healthCheckRouter from './healthCheck';
import requestsRouter from './requests';
import userRoleRouter from './userRole';
import commentsRouter from './comments';

const apiPrefix = '/api/v1';

const routes = (app) => {
  app.use(apiPrefix, healthCheckRouter);
  app.use(apiPrefix, requestsRouter);
  app.use(apiPrefix, userRoleRouter);
  app.use(apiPrefix, commentsRouter);
  return app;
};

export default routes;
