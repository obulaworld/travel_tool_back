import healthCheckRouter from './healthCheck';
import requestsRouter from './requests';
import userRoleRouter from './userRole';

const apiPrefix = '/api/v1';

const routes = (app) => {
  app.use(apiPrefix, healthCheckRouter);
  app.use(apiPrefix, requestsRouter);
  app.use(apiPrefix, userRoleRouter);
  return app;
};

export default routes;
