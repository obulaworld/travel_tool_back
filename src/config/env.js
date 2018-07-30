// a container for environment variables
import dotenv from 'dotenv';
import dbConfig from './db.config';
import checkMissingVariables from './utils';

dotenv.config();

const NODE_ENV = process.env.NODE_ENV || 'development';

const env = {
  // database
  DB_NAME: dbConfig[NODE_ENV].database,
  DB_USER: dbConfig[NODE_ENV].username,
  DB_PASSWORD: dbConfig[NODE_ENV].password,
  DB_DIALECT: dbConfig[NODE_ENV].dialect,
  // app
  PORT: process.env.PORT || 5000,
};

export default checkMissingVariables(env);
