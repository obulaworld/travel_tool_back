const mockAuthenticate = (req, res, next) => {
  const user = { UserInfo: { id: '-LJV4b1QTCYewOtk5F63' } };
  req.user = user;
  return next();
};

const invokeNextMiddleware = (req, res, next) => next();

const mockValidateDirectReport = (req, res, next) => {
  const request = { id: 1, name: 'Michelle Smith', status: 'Approved' };
  req.request = request;
  return next();
};

const middleware = {
  authenticate: jest.fn(mockAuthenticate),
  Validator: {
    validateGetRequests: jest.fn(invokeNextMiddleware),
    validateCreateRequests: jest.fn(invokeNextMiddleware),
    validateUser: jest.fn(invokeNextMiddleware),
    validateAddRole: jest.fn(invokeNextMiddleware),
    validateUserRole: jest.fn(invokeNextMiddleware),
    checkEmail: jest.fn(invokeNextMiddleware),
    validateStatus: jest.fn(invokeNextMiddleware),
  },
  validateDirectReport: jest.fn(mockValidateDirectReport),
};

export default middleware;
