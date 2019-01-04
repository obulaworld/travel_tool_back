import Validator from './Validator';
import CustomError from '../helpers/Error';
import models from '../database/models';

const { Op } = models.Sequelize;

export default class travelReadinessDocumentsValidator {
  static validateVisa(req, res, next) {
    req.checkBody('visa.country', 'country should be provided').notEmpty().ltrim();
    req.checkBody('visa.entryType', 'entryType is either Single or Multiple')
      .custom(entryType => entryType === 'Single' || entryType === 'Multiple');
    req.checkBody('visa.dateOfIssue', 'issue date date must be provided in the form  mm/dd/yyyy')
      .notEmpty().ltrim().matches(/^(0[1-9]|1[012])[- \/.](0[1-9]|[12][0-9]|3[01])[- \/.]((?:19|20)\d\d)$/);/* eslint-disable-line*/
    req.checkBody('visa.expiryDate', 'expiry date date must be provided in the form mm/dd/yyyy')
      .notEmpty().ltrim().matches(/^(0[1-9]|1[012])[- \/.](0[1-9]|[12][0-9]|3[01])[- \/.]((?:19|20)\d\d)$/);/* eslint-disable-line*/
    req.checkBody('visa.cloudinaryUrl', 'url is invalid').notEmpty()
      .matches(/[a-z0-9-\.]+\.[a-z]{2,4}\/?([^\s<>\#%“\,\{\}\\|\\\^\[\]`]+)?$/);/* eslint-disable-line*/
    req.checkBody('visa.expiryDate', 'expiry date should be greater than date of issue')
      .custom((date) => {
        const expiryDate = new Date(date);
        const dateOfIssue = new Date(req.body.visa.dateOfIssue);
        return expiryDate > dateOfIssue;
      });
    const errors = req.validationErrors();
    Validator.errorHandler(res, errors, next);
  }

  static async validateUniqueVisa(req, res, next) {
    if (req.body.visa) {
      const { country, expiryDate } = req.body.visa;
      const exists = await models.TravelReadinessDocuments.findOne({
        where: {
          [Op.and]:
            [{ 'data.country': country.trim() },
              { 'data.expiryDate': expiryDate.trim() },
              { userId: req.user.UserInfo.id },
              { type: 'visa' }]
        }
      });
      if (exists) {
        return res.status(409).json({
          success: false,
          message: 'validation error',
          errors: [
            {
              message: 'You already added the document'
            }
          ]
        });
      }
    }
    next();
  }

  static validateInput(req, res, next) {
    if (req.body.passport) {
      const errors = req.validationErrors();
      Validator.errorHandler(res, errors, next);
    } else if (req.body.visa) {
      travelReadinessDocumentsValidator.validateVisa(req, res, next);
    } else {
      CustomError.handleError('Please provide a valid document type', 400, res);
    }
  }
}
