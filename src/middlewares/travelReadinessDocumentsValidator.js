import moment from 'moment';
import Validator from './Validator';
import CustomError from '../helpers/Error';
import models from '../database/models';
import {
  urlCheck, checkDate, checkImageUrl, checkName
} from '../helpers/reg';

const { Op } = models.Sequelize;

export default class travelReadinessDocumentsValidator {
  static validateVisa(req, res, next) {
    req
      .checkBody('visa.country', 'country should be provided')
      .notEmpty()
      .ltrim();
    req
      .checkBody('visa.entryType', 'entryType is either Single or Multiple')
      .custom(entryType => entryType === 'Single' || entryType === 'Multiple');
    req
      .checkBody('visa.dateOfIssue', 'issue date date must be provided in the form  mm/dd/yyyy')
      .notEmpty()
      .ltrim()
      .matches(checkDate);
    req
      .checkBody('visa.expiryDate', 'expiry date date must be provided in the form mm/dd/yyyy')
      .notEmpty()
      .ltrim()
      .matches(checkDate);
    req
      .checkBody('visa.cloudinaryUrl', 'url is invalid')
      .notEmpty()
      .matches(urlCheck);
    req
      .checkBody('visa.visaType', 'visaType is either H-2A or H-2B')
      .custom(visaType => visaType === 'H-2A' || visaType === 'H-2B');
    req
      .checkBody('visa.expiryDate', 'expiry date should be greater than date of issue')
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
          [Op.and]: [
            { 'data.country': country.trim() },
            { 'data.expiryDate': expiryDate.trim() },
            { userId: req.user.UserInfo.id },
            { type: 'visa' }
          ]
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
      next();
    }
    next();
  }

  static validateInput(req, res, next) {
    if (req.body.passport) {
      const isValidDate = date => moment(date, 'YYYY/MM/DD', true).isValid();
      const { dateOfIssue } = req.body.passport;
      req
        .checkBody('passport.name', 'name is required')
        .notEmpty()
        .ltrim();
      req
        .checkBody('passport.passportNumber', 'passport is required')
        .notEmpty()
        .ltrim();
      req
        .checkBody('passport.nationality', 'nationality is required')
        .notEmpty()
        .ltrim();
      req
        .checkBody('passport.dateOfBirth', 'dateOfBirth is required')
        .notEmpty()
        .ltrim();
      req
        .checkBody('passport.dateOfIssue', 'dateOfIssue is required')
        .notEmpty()
        .ltrim();
      req
        .checkBody('passport.placeOfIssue', 'placeOfIssue is required')
        .notEmpty()
        .ltrim();
      req
        .checkBody('passport.expiryDate', 'expiryDate is required')
        .notEmpty()
        .ltrim();
      req
        .checkBody('passport.expiryDate', 'expiry date cannot be before date of issue')
        .isAfter(dateOfIssue);
      req
        .checkBody('passport.cloudinaryUrl', 'cloudinaryUrl is required')
        .notEmpty()
        .ltrim();
      req
        .checkBody('passport.passportNumber', 'passport number is not valid')
        .custom((passportNumber) => {
          const checkPassportNum = checkName.test(passportNumber);
          if (checkPassportNum || !passportNumber) {
            return Promise.reject(new Error());
          }
        });
      req
        .checkBody('passport.cloudinaryUrl', 'cloudinaryUrl is not a valid url')
        .custom((cloudinaryUrl) => {
          const checkUrl = checkImageUrl.test(cloudinaryUrl);
          if (checkUrl || !cloudinaryUrl) {
            return Promise.reject(new Error());
          }
        });
      req
        .checkBody(
          'passport.dateOfBirth',
          'The date of birth format you provided is not valid, use: YYYY/DD/MM'
        )
        .custom((birthDate) => {
          if (isValidDate(birthDate) || !birthDate) {
            return Promise.reject(new Error());
          }
        });
      req
        .checkBody(
          'passport.dateOfIssue',
          'The date of issue format you provided is not valid, use: YYYY/DD/MM'
        )
        .custom((issueDate) => {
          if (isValidDate(issueDate) || !issueDate) {
            return Promise.reject(new Error());
          }
        });
      req
        .checkBody(
          'passport.expiryDate',
          'The date of issue format you provided is not valid, use: YYYY/DD/MM'
        )
        .custom((dateOfExpiry) => {
          if (isValidDate(dateOfExpiry) || dateOfExpiry.length === 0) {
            return Promise.reject(new Error());
          }
        });

      const errors = req.validationErrors();
      Validator.errorHandler(res, errors, next);
    } else if (req.body.visa) {
      travelReadinessDocumentsValidator.validateVisa(req, res, next);
    } else {
      CustomError.handleError('Please provide a valid document type', 400, res);
    }
  }

  static async validatePassportUnique(req, res, next) {
    if (req.body.passport) {
      const { passportNumber } = req.body.passport;
      const passport = await models.TravelReadinessDocuments.findOne({
        where: {
          'data.passportNumber': {
            [Op.eq]: passportNumber.trim()
          }
        }
      });
      if (passport) {
        CustomError.handleError('The passport already exists', 409, res);
      } else {
        next();
      }
    }
  }
}
