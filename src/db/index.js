import Sequelize from 'sequelize';
import env from '../config/env';
import createUserModel from './models/User';

const connection = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASSWORD, {
  dialect: env.DB_DIALECT,
});

const db = {}; // to contain connection object and Models
db.connection = connection;
db.Sequelize = Sequelize;

// include models
db.User = createUserModel(connection, Sequelize);

export default db;
