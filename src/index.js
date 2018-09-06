import debug from 'debug';
import dotenv from 'dotenv';
import env from './config/environment';
import app from './app';

dotenv.config();

const logger = debug('log');

app.listen(env.PORT, () => {
  logger(`Find me on http://localhost:${env.PORT}`);
});
