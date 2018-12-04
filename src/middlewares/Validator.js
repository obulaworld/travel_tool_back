/* eslint-disable indent */
import { validationResult } from 'express-validator/check';
import { Op } from 'sequelize';
import moment from 'moment';
import models from '../database/models';
import Error from '../helpers/Error';
import TravelChecklist from '../modules/travelChecklist/TravelChecklistController';

export default class Validator {
  static validateRequest(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }

  static checkGender(req, res, next) {
    if (req.body.gender !== 'Male' && req.body.gender !== 'Female') {
      return res.status(400).json({
        success: false,
        message: 'Gender can only be Male or Female'
      });
    }
    next();
  }

  static checkFaultRoomStatus(req, res, next) {
    const { body: { fault } } = req;
    if (fault !== true && fault !== false) {
      return res.status(400).json({
        success: false,
        message: 'Room status can only be true or false'
      });
    }
    next();
  }

  static errorHandler(res, errors, next) {
    if (errors) {
      const errorObj = errors.map(err => ({
        message: err.msg,
        name: err.param
      }));
      return res.status(422).json({
        success: false,
        message: 'Validation failed',
        errors: errorObj
      });
    }
    return next();
  }

  static validateUserRoleCheck(
    req,
    res,
    next,
    body,
    body2,
    body3,
    body4,
    body5
  ) {
    req.checkBody(body, `${body} is required`).notEmpty();
    req.checkBody(body2, `${body2} is required`).notEmpty();
    req.checkBody(body3, `${body3} is required`).notEmpty();
    req.checkBody(body4, `${body4} is required`).notEmpty();
    req.checkBody(body5, `${body5} is required`).notEmpty();

    const errors = req.validationErrors();
    Validator.errorHandler(res, errors, next);
  }

  static validateUser(req, res, next) {
    Validator.validateUserRoleCheck(req, res, next, 'fullName', 'email', 'picture');
  }

  static validateUserRole(req, res, next) { /* istanbul ignore next */
    Validator.validateUserRoleCheck(req, res, next, 'email', 'roleName');
  }

  static validatePersonalInformation(req, res, next) {
    Validator.validateUserRoleCheck(
      req,
      res,
      next,
      'passportName',
      'gender',
      'department',
      'occupation',
      'manager'
    );
  }

  static validateAddRole(req, res, next) { /* istanbul ignore next */
    Validator.validateUserRoleCheck(req, res, next, 'roleName', 'description');
  }

  static checkEmail(req, res, next) {
    if (req.body.email.split('@')[1] !== 'andela.com') {
      return res.status(400).json({
        success: false,
        message: 'Only Andela Email address allowed'
      });
    }
    next();
  }

  static validateStatus(req, res, next) {
    req
      .checkBody('newStatus', 'newStatus must be Approved or Rejected')
      .isIn(['Approved', 'Rejected']);
    const errors = req.validationErrors();
    Validator.errorHandler(res, errors, next);
  }

  static validateNotificationStatus(req, res, next) {
    Object.keys(req.body).forEach((key) => {
      req.body[`${key}`] = req.body[`${key}`].toLowerCase();
    });

    req
      .checkBody('currentStatus', 'currentStatus field is required')
      .notEmpty();
    req
      .checkBody('newStatus', 'newStatus field is required')
      .notEmpty();
    req
      .checkBody('notificationType', 'notificationType field is required')
      .notEmpty();

    req
      .checkBody('currentStatus', 'currentStatus must be "unread"')
      .isIn(['unread']);
    req
      .checkBody('newStatus', 'newStatus must be "read"')
      .isIn(['read']);
    req
      .checkBody(
        'notificationType', 'notificationType can only be pending or general'
      )
      .isIn(['pending', 'general']);
    const errors = req.validationErrors();
    Validator.errorHandler(res, errors, next);
  }

  static validateComment(req, res, next) {
    req.checkBody('comment', 'Comment is required').notEmpty();
    req.checkBody('requestId', 'RequestId is required').notEmpty();
    const errors = req.validationErrors();
    Validator.errorHandler(res, errors, next);
  }


  static async validateGuestHouse(req, res, next) {
    req.checkBody('houseName', 'House name is required').notEmpty();
    req.checkBody('location', 'Location is required').notEmpty();
    req.checkBody('bathRooms', 'bathRooms is required and must be a Number')
      .isInt();
    req.checkBody('imageUrl', 'Image Url is required').notEmpty();
    req.checkBody('rooms.*.roomName', 'Room Name is required').notEmpty();
    req.checkBody('rooms.*.roomType', 'Room Type is required').notEmpty();
    req.checkBody('rooms.*.bedCount', 'Number of beds is required and must be a number').isInt();
    const errors = req.validationErrors();
    Validator.errorHandler(res, errors, next);
  }

  static validateMaintainanceRecord(req, res, next) {
    req.checkBody('reason', 'Maintainace reason is required').notEmpty();
    req.checkBody('start', 'start date must be provided').notEmpty();
    req.checkBody('start', 'start date must be formatted correcty mm/dd/yyyy')
    .matches(/^(0[1-9]|1[012])[- \/.](0[1-9]|[12][0-9]|3[01])[- \/.]((?:19|20)\d\d)$/); /* eslint-disable-line*/
    req.checkBody('end', 'Maintainance end data must be provided').notEmpty();
    req.checkBody('end', 'end date must be formatted correcty mm/dd/yyyy')
    .matches(/^(0[1-9]|1[012])[- \/.](0[1-9]|[12][0-9]|3[01])[- \/.]((?:19|20)\d\d)$/); /* eslint-disable-line*/
    req.checkBody('start', 'end date should be greater than start date').custom((start) => {
      const dateStart = new Date(start);
      const dateEnd = new Date(req.body.end);
      return dateEnd >= dateStart;
    });
    const errors = req.validationErrors();
    Validator.errorHandler(res, errors, next);
  }

  static checkDate(req, res, next) {
    const { startDate, endDate } = req.query;
    if (!startDate && !endDate) return next();
    const isValidStartDate = moment(startDate, 'YYYY-MM-DD', true).isValid();
    const isValidEndDate = moment(endDate, 'YYYY-MM-DD', true).isValid();

    if (!isValidStartDate || !isValidEndDate) {
      return res.status(400).json({
        success: false,
        message: 'Invalid start date or end date'
      });
    }
    next();
  }

  static async validateGuestHouseDataSet(req, res, next) {
    const { houseName, rooms } = req.body;
    const houseNameExists = await Validator.getGuestHouseFromDb({ houseName: { [Op.iLike]: `%${houseName}%` } });
    const availableGuestHouses = JSON.parse(JSON.stringify(houseNameExists));

    if (req.method === 'PUT') {
      const guestHouseId = req.params.id;
      const originalGuestHouse = await Validator.getGuestHouseFromDb({ id: guestHouseId });
      const theOriginalGuestHouse = JSON.parse(JSON.stringify(...originalGuestHouse));
      if (availableGuestHouses.find(house => house.houseName === theOriginalGuestHouse.houseName)) {
        availableGuestHouses.splice(availableGuestHouses.indexOf(theOriginalGuestHouse));
      }
    }
    if (availableGuestHouses.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Kindly use another name, this guesthouse name already exists'
      });
    }

    // rooms validation
    const roomExists = rooms.find(indexRoom => Validator.ifRoomPresent(indexRoom, rooms));
    if (roomExists) {
      return res.status(400).json({
        success: false,
        message: 'Kindly use another name, this room name already exists for this guest house'
      });
    }
    next();
  }

  static ifRoomPresent(indexRoom, rooms) {
    const resultRooms = rooms.filter(eachRoom => indexRoom.roomName.toLowerCase() === eachRoom.roomName.toLowerCase());
    return resultRooms.length > 1;
  }

  static async getGuestHouseFromDb(condition) {
    const query = { where: condition };
    const guestHouse = await models.GuestHouse.findAll(query);
    return guestHouse;
  }

  static async getUserFromDb(query) {
    const user = await models.User.findOne(query);
    return user;
  }

  /* istanbul ignore next */
  static async checkUserRole(req, res, next) {
    const emailAddress = req.user.UserInfo.email;
    const methodName = req.method;
    const action = { POST: 'create', GET: 'view', PUT: 'update' };
    const reg = /[a-z0-9-\.]+\.[a-z]{2,4}\/?([^\s<>\#%“\,\{\}\\|\\\^\[\]`]+)?$/; /* eslint-disable-line*/
    const checkUrl = reg.test(req.body.imageUrl);
    try {
      const query = { where: { email: emailAddress } };
      const user = await Validator.getUserFromDb(query, res);
      if (user.roleId !== 29187 && user.roleId !== 10948) {
        return res.status(401).json({
          success: false,
          message: `Only a Travel Admin can ${action[methodName]} a Guest House`
        });
      }
      if (action[methodName] === 'create' && !checkUrl) {
        return res.status(400).json({
          success: false, message: 'Only Url allowed for Image'
        });
      }
      next();
    } catch (error) {
      res.status(404).json({
        success: false, message: 'User not found in database'
      });
    }
  }

  static validateAvailableRooms(req, res, next) {
    const {
      gender,
      departureDate,
      location,
      arrivalDate
    } = req.query;

    if (!departureDate || !gender || !location) {
      return res.status(422).json({
        success: false,
        message: 'Please fill the details for departure date, gender and location'
      });
    }
    const isValidDeparturedate = moment(departureDate, 'YYYY-MM-DD', true).isValid();
    const isValidArrivalDate = moment(arrivalDate, 'YYYY-MM-YY', true).isValid();

    if (!isValidDeparturedate || (arrivalDate && !isValidArrivalDate)) {
      return res.status(422).json({
        success: false,
        message: 'Invalid departure or arrival dates'
      });
    }
    next();
  }

  static async validateImage(req, res, next) {
    const reg = /[a-z0-9-\.]+\.[a-z]{2,4}\/?([^\s<>\#%“\,\{\}\\|\\\^\[\]`]+)?$/; /* eslint-disable-line*/
    const checkUrl = reg.test(req.body.imageUrl);
    if (!checkUrl) {
      return res.status(400).json({
        success: false, message: 'Only Url allowed for Image'
      });
    }
    next();
  }

  static async getUserId(req, res, next) {
    const { id } = req.params;
    const user = await models.User.find({ where: { userId: id } });
    if (!user) {
      return Error.handleError('User not found', 404, res);
    }
    req.user = user;
    next();
  }

  static async centerExists(req, res, next) {
    const { center } = req.body;
    if (center) {
      const findCenter = await models.Center.findOne({
        where: { location: { [Op.iLike]: center } }, attributes: ['id']
      });
      if (!findCenter) {
        const error = 'Center does not exist';
        return Error.handleError(error, 404, res);
      }
      req.centerId = findCenter.id;
      next();
    } else {
      next();
    }
  }

  static checkSignedInUser(req, res, next) {
    if (req.user.UserInfo.id !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: 'You cannot perform this operation'
      });
    }
    next();
  }

  static async validateNewCentre(req, res, next) {
    const { newLocation: location } = req.body;
    if (!location) return Error.handleError('Please provide a new location', 400, res);
    const message = 'Please provide a valid location';
    if (typeof location !== 'string') return Error.handleError(message, 400, res);
    const foundLocation = await models.Center
      .findOne({ where: { location: { [Op.iLike]: location } } });
    if (foundLocation) {
      return res.status(409).json({
        success: false,
        message: 'This centre already exists'
      });
    }
    return next();
  }

  static async checkTripBeds(trips, res, next) {
    let isValid = true;
    trips.forEach(async (trip, i) => {
      if (trip.bedId > 0) {
        const bed = await models.Bed.findById(trip.bedId, {
          include: [{
            required: true,
            model: models.Room,
            as: 'rooms',
            include: [{
              required: true,
              model: models.GuestHouse,
              as: 'guestHouses',
              where: { location: trip.destination }
            }]
          }]
        });
        if (!bed) isValid = false;
      }
      if (trips.length === i + 1) {
        if (isValid) {
          return next();
        }
        return res.status(400).json({
          success: false,
          message: 'A bed in this trip does not belong to its destination guesthouse'
        });
      }
    });
  }

  static async validateTripBeds(req, res, next) {
    try {
      const { trips } = req.body;
      Validator.checkTripBeds(trips, res, next);
    } catch (error) {
      return Error.handleError(error, 404, res);
    }
  }

  static async checkStatusIsApproved(req, res, next) {
    try {
      const { requestId } = req.params;
      const request = await models.Request.findById(requestId);
      const approval = await models.Approval.findOne({ where: { requestId } });
      const checkApproval = (!approval || approval.status !== 'Approved');
      if (request.status !== 'Approved' && checkApproval) {
        return res.status(400).json({
          success: false,
          message: 'This request cannot be updated'
        });
      }
      return next();
    } catch (error) {
      /* istanbul ignore next */
      return Error.handleError(error, 404, res);
    }
  }

  static async validateRequestHasTrips(req, res, next) {
    try {
      const { requestId } = req.params;
      const trip = await models.Trip.findOne({ where: { requestId } });

      if (!trip) {
        const error = 'No trip exists for this request';
        return Error.handleError(error, 404, res);
      }
      return next();
    } catch (error) {
      /* istanbul ignore next */
      return Error.handleError(error, 500, res);
    }
  }

  static async validateTeamMemberLocation(req, res, next) {
    try {
      const { requestId } = req.params;
      let { location } = req.user;
      location = location.toLowerCase();
      const trip = await models
        .Trip.findOne({ where: { requestId }, order: [['departureDate', 'ASC']] });
      if (trip && (trip.origin !== location && !trip.origin.toLowerCase().startsWith(location))) {
        const error = 'You don\'t have access to perform this action';
        return Error.handleError(error, 403, res);
      }
      return next();
    } catch (error) {
      /* istanbul ignore next */
      return Error.handleError(error, 500, res);
    }
  }

  static async validateDepartureDate(req, res, next) {
    try {
      const { requestId } = req.params;
      const trip = await models
        .Trip.findOne({ order: [['departureDate', 'ASC']], where: { requestId } });
      const currentDate = new Date();
      const month = currentDate.getMonth() + 1;
      const date = currentDate.getDate();
      const currentDateString = `${currentDate.getFullYear()}-${month}-${date}`;
      if (moment(trip.departureDate).isSameOrAfter(currentDateString)) {
        return next();
      }
      return res.status(400).json({
        success: false,
        message: 'Departure date for a trip in this request has passed'
      });
    } catch (error) {
      /* istanbul ignore next */
      return Error.handleError(error, 500, res);
    }
  }

  static async validateCheckListComplete(req, res, next) {
    try {
      const { requestId } = req.params;
      const percentage = await TravelChecklist.checkListPercentageNumber(req, res, requestId);
      if (percentage === 100) {
        return next();
      }
      return res.status(400).json({
        success: false,
        message: 'The checklist submission is yet to be completed'
      });
    } catch (error) {
      /* istanbul ignore next */
      return Error.handleError(error, 500, res);
    }
  }
}
