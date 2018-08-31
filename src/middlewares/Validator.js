import { validationResult } from 'express-validator/check';

export default class Validator {
  static validateCreateRequests(req, res, next) {
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('name', 'Name should be between 3 and 50 characters long')
      .isLength({ min: 3, max: 50 });
    req.checkBody('origin', 'Travel origin is required').notEmpty();
    req.checkBody('destination', 'Travel destination is required').notEmpty();
    req.checkBody('manager', 'Manager name is required').notEmpty();
    req.checkBody('gender', 'Gender is required').notEmpty();
    req.checkBody('department', 'Your department is required').notEmpty();
    req.checkBody('role', 'Your role is required').notEmpty();
    req.checkBody('departureDate', 'Departure date is required').notEmpty();
    req.checkBody('arrivalDate', 'Arrival date is required')
      .notEmpty();

    const errors = req.validationErrors();
    if (errors) {
      const errorObj = errors
        .map(err => ({ message: err.msg, name: err.param }));
      return res.status(422).json({
        success: false,
        message: 'Validation failed while creating a new request',
        errors: errorObj,
      });
    }
    return next();
  }

  static validateGetRequests(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422)
        .json({
          success: false,
          errors: errors.array(),
        });
    }
    next();
  }
}
