require('dotenv').config();

const commonEnvOptions = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD || '',
  dialect: process.env.DB_DIALECT || 'postgres',
};

module.exports = {
  production: {
    database: process.env.DB_NAME,
    ...commonEnvOptions,
  },
  development: {
    database: process.env.DB_NAME,
    ...commonEnvOptions,
  },
};
