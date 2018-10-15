import healthCheckRouter from './healthCheck';
import requestsRouter from './requests';
import approvalsRouter from './approvals';
import userRoleRouter from './userRole';
import commentsRouter from './comments';
import notificationRouter from './notifications';
import occupationsRouter from './occupations';
import guestHouseRouter from './guestHouse';
import tripsRouter from './trips';

const apiPrefix = '/api/v1';

const routes = (app) => {
  app.use(apiPrefix, healthCheckRouter);
  app.use(apiPrefix, requestsRouter);
  app.use(apiPrefix, approvalsRouter);
  app.use(apiPrefix, userRoleRouter);
  app.use(apiPrefix, commentsRouter);
  app.use(apiPrefix, notificationRouter);

  app.use(apiPrefix, occupationsRouter);
  app.use(apiPrefix, guestHouseRouter);
  app.use(apiPrefix, tripsRouter);
  return app;
};

export default routes;
