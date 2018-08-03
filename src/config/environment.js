import envExists from './utils';

const env = {
  PORT: process.env.PORT || 5000,
};

export default envExists(env);
