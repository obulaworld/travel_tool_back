import AuthRouter from './auth';

const apiPrefix = '/api/v1';

const routes = (app) => {
  app.use(apiPrefix, AuthRouter);
  return app;
};

export default routes;
