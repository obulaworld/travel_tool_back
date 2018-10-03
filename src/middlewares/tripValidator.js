
import models from '../database/models';
import Validator from './Validator';

export default class TripValidator {
  static validateCheckType(req, res, next) {
    req.checkBody('checkType', 'Check type is required').notEmpty();
    req.checkBody('checkType', 'checkType must be "checkIn" or "checkOut"')
      .isIn(['checkIn', 'checkOut']);
    const errors = req.validationErrors();
    Validator.errorHandler(res, errors, next);
  }

  static async checkTripExists(req, res, next) {
    const { tripId } = req.params;
    try {
      const trip = await models.Trip.findById(tripId);
      if (!trip) {
        return res.status(400).json({
          success: false,
          message: 'Trip does not exist'
        });
      }
      next();
    } catch (error) {
      /* istanbul ignore next */
      return res.status(400).json({
        success: false,
        message: 'An error occurred'
      });
    }
  }

  static async checkTripOwner(req, res, next) {
    const { tripId } = req.params;
    const userId = req.user.UserInfo.id;
    try {
      const trip = await models.Trip.findOne({
        where: { id: tripId },
        include: [{
          required: true,
          model: models.Request,
          as: 'request',
          where: { userId },
        }]
      });
      if (!trip) {
        return res.status(403).json({
          success: false,
          message: 'You don\'t have access to this trip'
        });
      }
      next();
    } catch (error) {
      /* istanbul ignore next */
      return res.status(400).json({
        success: false,
        message: 'An error occurred'
      });
    }
  }

  static async checkTripApproved(req, res, next) {
    const { tripId } = req.params;
    const userId = req.user.UserInfo.id;
    try {
      const trip = await models.Trip.findOne({
        where: { id: tripId },
        include: [{
          required: true,
          model: models.Request,
          as: 'request',
          where: { userId, status: 'Approved' },
        }]
      });
      if (!trip) {
        return res.status(400).json({
          success: false,
          message: 'This trip is not approved'
        });
      }
      next();
    } catch (error) {
      /* istanbul ignore next */
      return res.status(400).json({
        success: false,
        message: 'An error occurred'
      });
    }
  }
}
