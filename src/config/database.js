require('dotenv').config();

const defaultConfig = {
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  dialect: process.env.DATABASE_DIALECT || 'postgres',
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
