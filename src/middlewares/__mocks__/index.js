const mockAuthenticate = (req, res, next) => {
  const user = { UserInfo: { id: '-LJV4b1QTCYewOtk5F63' } };
  req.user = user;
  next();
};

const invokeNextMiddleware = (req, res, next) => next();

const middleware = {
  authenticate: jest.fn(mockAuthenticate),
  Validator: {
    validateGetRequests: jest.fn(invokeNextMiddleware),
    validateCreateRequests: jest.fn(invokeNextMiddleware),
    validateUser: jest.fn(invokeNextMiddleware),
    validateAddRole: jest.fn(invokeNextMiddleware),
    validateUserRole: jest.fn(invokeNextMiddleware),
    checkEmail: jest.fn(invokeNextMiddleware)
  },
  validateDirectReport: jest.fn(invokeNextMiddleware)
};

export default middleware;
