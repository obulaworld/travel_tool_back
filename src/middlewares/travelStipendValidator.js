import models from '../database/models';
import Validator from './Validator';

export default class TravelStipendValidator {
  static async validateNewStipend(req, res, next) {
    req.checkBody('stipend', 'stipend is required and must be a Number').isInt();
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
}
