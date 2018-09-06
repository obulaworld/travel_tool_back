import authenticate from './authenticate';
import Validator from './Validator';
import validateDirectReport from './validateDirectReport';

const middleware = {
  authenticate,
  Validator,
  validateDirectReport,
};

export default middleware;
