import models from '../database/models';
import Validator from './Validator';

export default class TravelStipendValidator {
  static async validateNewStipend(req, res, next) {
    req.checkBody('stipend', 'stipend is required and must be a positive number')
      .isInt({ gt: -1 });
    req.checkBody('center', 'center is required').notEmpty();
    const errors = req.validationErrors();
    if (errors.length) {
      return Validator.errorHandler(res, errors, next);
    }
    return next();
  }

  static async checkCenter(req, res, next) {
    const { center } = req.body;

    const foundCenter = await models.Center.find({
      where: {
        location: center
      }
    });
    if (!foundCenter) {
      return res.status(404).json({
        success: false,
        message: 'This Center does not exist'
      });
    }
    const foundStipend = await models.TravelStipends
      .find(
        {
          include: [{
            association: 'center',
            where: {
              location: center
            }
          }]
        }
      );

    if (foundStipend) {
      return res.status(409).json({
        success: false,
        message: 'A travel stipend already exists for this center'
      });
    }
    return next();
  }

  static async checkValidationErrors(req, res, next) {
    if (req.validationErrors()) {
      req.getValidationResult().then((result) => {
        const errors = result.array({ onlyFirstError: true });
        return Validator.errorHandler(res, errors, next);
      });
    } else {
      return next();
    }
  }

  static async validateUpdatePayload(req, res, next) {
    req.checkBody('stipend', 'stipend has not been provided')
      .notEmpty()
      .isInt()
      .withMessage('stipend should be an integer')
      .exists()
      .withMessage('stipend has not been provided');

    TravelStipendValidator.checkValidationErrors(req, res, next);
  }

  static async validateUpdateParams(req, res, next) {
    req.checkParams('id')
      .isInt()
      .withMessage('stipendId should be an integer');

    TravelStipendValidator.checkValidationErrors(req, res, next);
  }
}
