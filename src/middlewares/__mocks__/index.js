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

const mockGetUserId = (req, res, next) => {
  const user = { id: 1 };
  req.user = user;
  next();
};

const middleware = {
  authenticate: jest.fn(mockAuthenticate),
  Validator: {
    validateRequest: jest.fn(invokeNextMiddleware),
    validateCreateRequests: jest.fn(invokeNextMiddleware),
    validateUser: jest.fn(invokeNextMiddleware),
    checkEmail: jest.fn(invokeNextMiddleware),
    checkGender: jest.fn(invokeNextMiddleware),
    validateStatus: jest.fn(invokeNextMiddleware),
    validatePersonalInformation: jest.fn(invokeNextMiddleware),
    validateWorkInformation: jest.fn(invokeNextMiddleware),
    validateManager: jest.fn(invokeNextMiddleware),
    validateComment: jest.fn(invokeNextMiddleware),
    validateNotificationStatus: jest.fn(invokeNextMiddleware),
    validateCreateGuestHouse: jest.fn(invokeNextMiddleware),
    checkDate: jest.fn(invokeNextMiddleware),
    checkFaultRoomStatus: jest.fn(invokeNextMiddleware),
    checkUrl: jest.fn(invokeNextMiddleware),
    validateGuestHouse: jest.fn(invokeNextMiddleware),
    validateMaintainanceRecord: jest.fn(invokeNextMiddleware),
    validateImage: jest.fn(invokeNextMiddleware),
    getUserId: jest.fn(mockGetUserId),
    centerExists: jest.fn(invokeNextMiddleware),
    validateChecklistQuery: jest.fn(invokeNextMiddleware),
    getUserFromDb: jest.fn(invokeNextMiddleware),
    validateAvailableRooms: jest.fn(invokeNextMiddleware),
    checkSignedInUser: jest.fn(invokeNextMiddleware),
    validateNewCentre: jest.fn(invokeNextMiddleware),
    validateTripBeds: jest.fn(invokeNextMiddleware),
    checkTripBeds: jest.fn(invokeNextMiddleware),
    checkStatusIsApproved: jest.fn(invokeNextMiddleware),
    validateRequestHasTrips: jest.fn(invokeNextMiddleware),
    validateTeamMemberLocation: jest.fn(invokeNextMiddleware),
    validateDepartureDate: jest.fn(invokeNextMiddleware),
    validateCheckListComplete: jest.fn(invokeNextMiddleware)

  },
  RoleValidator: {
    validateUpdateRole: jest.fn(invokeNextMiddleware),
    validateRoleAssignment: jest.fn(invokeNextMiddleware),
    roleExists: jest.fn(invokeNextMiddleware),
    checkUserRole: jest.fn(() => invokeNextMiddleware),
    validateAddRole: jest.fn(invokeNextMiddleware),
    validateUserRole: jest.fn(invokeNextMiddleware),
    validateUpdateCenterBody: jest.fn(invokeNextMiddleware),
    validateUpdateCenter: jest.fn(invokeNextMiddleware),
    checkUserRoleById: jest.fn(invokeNextMiddleware),
    validateChecklistQuery: jest.fn(invokeNextMiddleware),
    validateRequestIdQuery: jest.fn(invokeNextMiddleware),
    validateDestinationNameQuery: jest.fn(invokeNextMiddleware),
    validateMaintainanceRecord: jest.fn(invokeNextMiddleware)
  },
  tripValidator: {
    validateCheckType: jest.fn(invokeNextMiddleware),
    checkTripExists: jest.fn(invokeNextMiddleware),
    checkTripOwner: jest.fn(invokeNextMiddleware),
    checkTripApproved: jest.fn(invokeNextMiddleware),
    checkTravelAdmin: jest.fn(invokeNextMiddleware),
    validateBed: jest.fn(invokeNextMiddleware),
    checkBedExists: jest.fn(invokeNextMiddleware),
    isBedAvailable: jest.fn(invokeNextMiddleware),
    validateReason: jest.fn(invokeNextMiddleware),
    isRoomFaulty: jest.fn(invokeNextMiddleware),
    isGenderAllowed: jest.fn(invokeNextMiddleware),
    checkTripCheckedOut: jest.fn(invokeNextMiddleware)
  },
  analyticsValidator: {
    validateFilterAndType: jest.fn(invokeNextMiddleware)
  },
  travelCalendarValidator: {
    validateRequestQuery: jest.fn(invokeNextMiddleware)
  },
  validateDirectReport: jest.fn(mockValidateDirectReport),
  DocumentsValidator: {
    validateDocumentName: jest.fn(invokeNextMiddleware),
    checkDocumentName: jest.fn(invokeNextMiddleware),
    getDocumentFromDb: jest.fn(invokeNextMiddleware),
    validateCloudinaryPayload: jest.fn(invokeNextMiddleware)
  },
  ChecklistValidator: {
    validateSubmission: jest.fn(invokeNextMiddleware),
    validateTrip: jest.fn(invokeNextMiddleware),
    getChecklistItem: jest.fn(invokeNextMiddleware),
  },
  guestHouseValidator: {
    checkRoom: jest.fn(invokeNextMiddleware),
    checkMaintenanceRecord: jest.fn(invokeNextMiddleware)
  }
};

export default middleware;
