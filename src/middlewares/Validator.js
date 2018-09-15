import { validationResult } from 'express-validator/check';

export default class Validator {
  static validateCreateRequests(req, res, next) {
    req.checkBody('name', 'Name is required').notEmpty();
    req
      .checkBody('name', 'Name should be between 3 and 50 characters long')
      .isLength({ min: 3, max: 50 });
    req.checkBody('origin', 'Travel origin is required').notEmpty();
    req.checkBody('destination', 'Travel destination is required').notEmpty();
    req.checkBody('manager', 'Manager name is required').notEmpty();
    req.checkBody('gender', 'Gender is required').notEmpty();
    req.checkBody('department', 'Your department is required').notEmpty();
    req.checkBody('role', 'Your role is required').notEmpty();
    req.checkBody('departureDate', 'Departure date is required').notEmpty();
    req.checkBody('arrivalDate', 'Arrival date is required').notEmpty();

    const errors = req.validationErrors();
    Validator.errorHandler(res, errors, next);
  }

  static validateGetRequests(req, res, next) {
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

  static validateUserRoleCkeck(
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
    Validator.validateUserRoleCkeck(req, res, next, 'fullName', 'email');
  }

  static validateUserRole(req, res, next) {
    Validator.validateUserRoleCkeck(req, res, next, 'email', 'roleName');
  }

  static validatePersonalInformation(req, res, next) {
    Validator.validateUserRoleCkeck(
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
    Validator.validateUserRoleCkeck(req, res, next, 'roleName', 'description');
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

  static validateComment(req, res, next) {
    req.checkBody('comment', 'Comment is required').notEmpty();
    req.checkBody('requestId', 'RequestId is required').notEmpty();
    const errors = req.validationErrors();
    Validator.errorHandler(res, errors, next);
  }
}
