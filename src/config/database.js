const env = require('./environment.js');

const defaultConfig = {
  username: env.DATABASE_USERNAME,
  database: env.DATABASE_NAME,
  password: env.DATABASE_PASSWORD,
  host: env.DATABASE_HOST || 'localhost',
  port: env.DATABASE_PORT || '5432',
  dialect: env.DATABASE_DIALECT || 'postgres',
};


const database = {
  development: {
    ...defaultConfig,
  },
  test: {
    ...defaultConfig,
  },
  staging: {
    ...defaultConfig,
  },
  production: {
    ...defaultConfig,
  },
};

// DO NOT CHANGE EVER!!!
module.exports = database;
