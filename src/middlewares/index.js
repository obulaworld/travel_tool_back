import authenticate from './authenticate';
import Validator from './Validator';
import validateDirectReport from './validateDirectReport';
import tripValidator from './tripValidator';
import RoleValidator from './RoleValidator';

const middleware = {
  authenticate,
  Validator,
  validateDirectReport,
  tripValidator,
  RoleValidator
};

export default middleware;
