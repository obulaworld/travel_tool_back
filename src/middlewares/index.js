import authenticate from './authenticate';
import Validator from './Validator';
import validateDirectReport from './validateDirectReport';
import tripValidator from './tripValidator';

const middleware = {
  authenticate,
  Validator,
  validateDirectReport,
  tripValidator
};

export default middleware;
