import healthCheckRouter from './healthCheck';
import requestsRouter from './requests';
import approvalsRouter from './approvals';
import userRoleRouter from './userRole';
import commentsRouter from './comments';
import notificationRouter from './notifications';
import occupationsRouter from './occupations';
import centerRouter from './centers';
import guestHouseRouter from './guestHouse';
import tripsRouter from './trips';
import analyticsRouter from './analytics';
import travelChecklistRouter from './travelChecklist';


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
  app.use(apiPrefix, centerRouter);
  app.use(apiPrefix, travelChecklistRouter);
  app.use(apiPrefix, analyticsRouter);
  return app;
};

export default routes;
