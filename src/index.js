import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import cors from 'cors';
import morgan from 'morgan';
import debug from 'debug';
import dotenv from 'dotenv';
import expressValidator from 'express-validator';
import modules from './modules';
import env from './config/environment';

dotenv.config();

const logger = debug('log');
const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(passport.initialize());

// body parser for url params and json
app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true,
}));
app.use(bodyParser.json());

app.use(expressValidator());

// set base url for api
modules(app);

// catch all routers
app.use('*', (req, res) => res.status(404)
  .json({
    message: 'Not Found. Use /api/v1 to access the Api',
  }));

if (process.env.NODE_ENV !== 'test') {
  app.listen(env.PORT);
}
logger(`Find me on http://localhost:${env.PORT}`);

export default app;
