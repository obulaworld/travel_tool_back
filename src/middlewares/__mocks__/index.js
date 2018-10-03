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
    validateRequest: jest.fn(invokeNextMiddleware),
    validateCreateRequests: jest.fn(invokeNextMiddleware),
    validateUser: jest.fn(invokeNextMiddleware),
    validateAddRole: jest.fn(invokeNextMiddleware),
    validateUserRole: jest.fn(invokeNextMiddleware),
    checkEmail: jest.fn(invokeNextMiddleware),
    checkGender: jest.fn(invokeNextMiddleware),
    validateStatus: jest.fn(invokeNextMiddleware),
    validatePersonalInformation: jest.fn(invokeNextMiddleware),
    validateWorkInformation: jest.fn(invokeNextMiddleware),
    validateManager: jest.fn(invokeNextMiddleware),
    validateComment: jest.fn(invokeNextMiddleware),
    validateNotificationStatus: jest.fn(invokeNextMiddleware),
    validateGuestHouse: jest.fn(invokeNextMiddleware),
    checkUserRole: jest.fn(invokeNextMiddleware),
    checkUrl: jest.fn(invokeNextMiddleware),
  },
  validateDirectReport: jest.fn(mockValidateDirectReport)
};

export default middleware;
