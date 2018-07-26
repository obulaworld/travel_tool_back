import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import cors from 'cors';
import morgan from 'morgan';
import debug from 'debug';
import routes from './routes';
import env from './config/env';
import db from './db';

const logger = debug('log');
const app = express();
const port = env.PORT;

app.use(cors());
app.use(morgan('dev'));
app.use(passport.initialize());

// body parser for url params and json
app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true,
}));
app.use(bodyParser.json());

// set base url for api
app.use('/api/v1/', routes);

// catch all routers
app.use('*', (req, res) => res.status(404)
  .json({
    message: 'Not Found. Use /api/v1 to access the Api',
  }));

// sync the database
db.connection.sync()
  .then(() => logger('Database ready'));

app.listen(port);
logger(`Find me on http://localhost:${port}`);

export default app;
