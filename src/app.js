import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import cors from 'cors';
import morgan from 'morgan';
import bugsnag from 'bugsnag';
import expressValidator from 'express-validator';
import modules from './modules';
import MailTravelMembers from './modules/userRole/MailTravelMembers';
import CloudinaryDeletion from './modules/travelChecklist/CloudinaryDeletion';

const app = express();

if (
  !process.env.NODE_ENV.match('test')
  /* istanbul ignore next */
  && process.env.BUGSNAG_API_KEY
) {
  /* istanbul ignore next */
  bugsnag.register(process.env.BUGSNAG_API_KEY);
  /* istanbul ignore next */
  app.use(bugsnag.requestHandler);
  /* istanbul ignore next */
  app.use(bugsnag.errorHandler);
}

app.use(cors());
app.use(morgan('dev'));
app.use(passport.initialize());

((req, res) => {
  MailTravelMembers.sendMail(req, res);
})();


CloudinaryDeletion.executeResourceDelete();
// body parser for url params and json
app.use(
  bodyParser.urlencoded({
    limit: '50mb',
    extended: true
  })
);
app.use(bodyParser.json());

app.use(expressValidator());

// set base url for api
modules(app);

// catch all routers
app.use('*', (req, res) => res.status(404).json({
  message: 'Not Found. Use /api/v1 to access the Api'
}));

export default app;
