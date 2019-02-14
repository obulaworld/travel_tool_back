import Validator from './Validator';
import models from '../database/models';
import CustomError from '../helpers/Error';

class TravelReasonsValidator {
  static verifyTravelReasonBody(req, res, next) {
    req.checkBody('title').notEmpty().trim()
      .withMessage('Please input a valid title')
      .len({ max: 18 })
      .withMessage('Title should not be more than 18 characters');
    req.checkBody('description')
      .len({ max: 140 })
      .withMessage('Description should not be more than 140 characters');

    const errors = req.validationErrors();
    Validator.errorHandler(res, errors, next);
  }

  static async verifyTitle(req, res, next) {
    try {
      const { title } = req.body;
      const lowerCaseTitle = title.toLowerCase();
      const TravelReason = await models.TravelReason.findOne({
        where: { title: lowerCaseTitle }
      });
      if (TravelReason) {
        return res.status(422).json({
          success: false,
          message: 'This travel reason already exists',
        });
      }
      next();
    } catch (error) {
      /* istanbul ignore next */
      return CustomError.handleError('An error occurred', 400, res);
    }
  }

  static async verifyId(req, res, next) {
    try {
      const userId = req.user.UserInfo.id;

      const user = await models.User.findOne({
        where: { userId }
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized access',
        });
      }
      req.body.id = user.id;
      next();
    } catch (error) {
      /* istanbul ignore next */
      return CustomError.handleError('An error occurred', 400, res);
    }
  }
}

export default TravelReasonsValidator;
