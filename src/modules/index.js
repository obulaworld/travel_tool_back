import healthCheckRouter from './healthCheck';
import requestsRouter from './requests';

const apiPrefix = '/api/v1';

const routes = (app) => {
  app.use(apiPrefix, healthCheckRouter);
  app.use(apiPrefix, requestsRouter);
  return app;
};

export default routes;
