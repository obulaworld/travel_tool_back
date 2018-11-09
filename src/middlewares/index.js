import authenticate from './authenticate';
import Validator from './Validator';
import validateDirectReport from './validateDirectReport';
import tripValidator from './tripValidator';
import RoleValidator from './RoleValidator';
import analyticsValidator from './analyticsValidator';
import DocumentsValidator from './DocumentsValidator';

const middleware = {
  authenticate,
  Validator,
  validateDirectReport,
  tripValidator,
  RoleValidator,
  analyticsValidator,
  DocumentsValidator
};

export default middleware;
