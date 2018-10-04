import { validationResult } from 'express-validator/check';
import moment from 'moment';
import models from '../database/models';

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
    Validator.validateUserRoleCheck(req, res, next, 'fullName', 'email');
  }

  static validateUserRole(req, res, next) {
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

  static validateAddRole(req, res, next) {
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

  static validateGuestHouse(req, res, next) {
    req.checkBody('houseName', 'House name is required').notEmpty();
    req.checkBody('location', 'Location is required').notEmpty();
    req.checkBody('bathRooms', 'bathRooms is required and must be a Number')
      .isInt();
    req.checkBody('imageUrl', 'Image Url is required').notEmpty();
    req.checkBody('rooms.*.roomName', 'Room Name is required').notEmpty();
    req.checkBody('rooms.*.roomType', 'Room Type is required').notEmpty();
    req.checkBody('rooms.*.bedCount',
      'Number of beds is required and must be a number')
      .isInt();
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

  static async checkUserRole(req, res, next) {
    const emailAddress = req.user.UserInfo.email;
    const methodName = req.method;
    const action = { POST: 'create', GET: 'view', PUT: 'update' };
    const reg = /[a-z0-9-\.]+\.[a-z]{2,4}\/?([^\s<>\#%“\,\{\}\\|\\\^\[\]`]+)?$/; /* eslint-disable-line*/
    const checkUrl = reg.test(req.body.imageUrl);
    try {
      const userRole = await models.User.findOne({
        where: {
          email: emailAddress
        },
      });
      if (userRole.roleId !== 29187 && userRole.roleId !== 10948) {
        return res.status(401).json({
          success: false,
          message: `Only a Travel Admin can ${action[methodName]} a Guest House`
        });
      }
      if (action[methodName] === 'create' && !checkUrl) {
        return res.status(400).json({
          success: false,
          message: 'Only Url allowed for Image'
        });
      }
      next();
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'User not found in database'
      });
    }
  }


  static async validateRole(req, res, next) {
    const emailAddress = req.user.UserInfo.email;
    try {
      const userRole = await models.User.findOne({
        where: {
          email: emailAddress
        },
      });
      if (userRole.roleId !== 29187 && userRole.roleId !== 10948) {
        return res.status(401).json({
          success: false,
          message: 'Only a Travel Admin can edit fault status a Guest House'
        });
      }
      next();
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'User not found in database'
      });
    }
  }
}
