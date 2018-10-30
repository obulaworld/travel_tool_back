import authenticate from './authenticate';
import Validator from './Validator';
import validateDirectReport from './validateDirectReport';
import tripValidator from './tripValidator';
import RoleValidator from './RoleValidator';
import analyticsValidator from './analyticsValidator';

const middleware = {
  authenticate,
  Validator,
  validateDirectReport,
  tripValidator,
  RoleValidator,
  analyticsValidator
};

export default middleware;
