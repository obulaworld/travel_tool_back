/* istanbul ignore file */
const dotenv = require('dotenv');

dotenv.config();

const defaultUser = {
  fullName: 'Samuel Kubai',
  email: 'samuel.kubai@andela.com',
  userId: process.env.DEFAULT_SUPER_USER_ID,
  passportName: 'Samuel Kubai',
  department: 'Success',
  occupation: 'Software Developer',
  manager: 'Samuel Kubai',
  gender: 'Male',
  location: 'Nairobi',
  picture: 'http://picture'
};

module.exports = process.env.NODE_ENV !== 'test'
  ? {
    productionAPI: process.env.ANDELA_PROD_API_MIGRATION,
    bambooHRAPI: process.env.BAMBOOHR_API,
    defaultUser,
    jwtToken: process.env.USER_JWT
  }
  : {
    productionAPI: 'protocol://andela.dummy.url',
    bambooHRAPI: 'protocol://bamboohr.dummy.url/?id={bambooHRId}',
    defaultUser,
    jwtToken: 'test token'
  };
