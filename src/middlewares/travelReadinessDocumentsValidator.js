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
    travelReadinessDocumentsValidator.validateDateWithExpiry(req, 'visa');
    req
      .checkBody('visa.cloudinaryUrl', 'url is invalid')
      .notEmpty()
      .matches(urlCheck);
    req
      .checkBody('visa.visaType', 'visaType is either H-2A or H-2B')
      .custom(visaType => visaType === 'H-2A' || visaType === 'H-2B');
    const errors = req.validationErrors();
    Validator.errorHandler(res, errors, next);
  }

  static documentExistsError(res, req) {
    let document = 'visa';
    if (req.body.passport) {
      document = 'passport';
    } else if (req.body.other) {
      document = 'document';
    }
    return res.status(409).json({
      success: false,
      message: 'validation error',
      errors: [
        { message: `You already added this ${document}` }
      ]
    });
  }

  static validateInput(req, res, next) {
    const validTypes = ['other', 'visa', 'passport'];
    const isType = Object.keys(req.body).filter(type => validTypes.includes(type)).length;
   
    if (!isType) {
      return CustomError.handleError('Please provide a valid document type', 400, res);
    }
    
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
    }
    if (req.body.visa) {
      travelReadinessDocumentsValidator.validateVisa(req, res, next);
    }
    if (req.body.other) {
      travelReadinessDocumentsValidator.validateOtherDocument(req, res, next);
    }
  }

  static getWereClause(
    type,
    operation,
    fields,
    req,
  ) {
    const dataFields = fields.map(field => ({ [`data.${field}`]: req.body[type][field] }));
    return {
      [operation]: [
        ...dataFields,
        { userId: req.user.UserInfo.id },
        { type },
      ]
    };
  }

  static async findDocument(req) {
    let where;
    if (req.body.passport) {
      const { passportNumber } = req.body.passport;
      where = {
        'data.passportNumber': {
          [Op.eq]: passportNumber.trim()
        }
      };
    } else if (req.body.other) {
      where = this.getWereClause('other', Op.and, ['name', 'expiryDate'], req);
    } else if (req.body.visa) {
      where = this.getWereClause('visa', Op.and, ['country', 'expiryDate'], req);
    }
    const document = await models.TravelReadinessDocuments.findOne({
      where,
    });
    return document;
  }

  static async validateUniqueDocument(req, res, next) {
    const document = await travelReadinessDocumentsValidator.findDocument(req);
    if (document) {
      return travelReadinessDocumentsValidator.documentExistsError(res, req);
    }
    next();
  }


  static validateOtherDocument(req, res, next) {
    if (req.body.other) {
      req.checkBody('other.name', 'document name should be provided').notEmpty().ltrim();
      req.checkBody(
        'other.name',
        'document that contains visa or passport keyword is not allowed in this category'
      )
        .custom((name) => {
          if (name === undefined) {
            return Promise.resolve();
          }
          if (name.match(/passport|visa/ig) === null) {
            return Promise.reject(new Error());
          }
        });
      req.checkBody('other.cloudinaryUrl', 'url is invalid').notEmpty()
        .matches(urlCheck);
      travelReadinessDocumentsValidator.validateDateWithExpiry(req, 'other');
      const errors = req.validationErrors();
      Validator.errorHandler(res, errors, next);
    }
  }


  static validateDateWithExpiry(req, type) {
    req.checkBody(`${type}.dateOfIssue`, 'issue date date must be provided in the form  mm/dd/yyyy')
      .notEmpty().ltrim().matches(checkDate);
    req.checkBody(`${type}.expiryDate`, 'expiry date date must be provided in the form mm/dd/yyyy')
      .notEmpty().ltrim().matches(checkDate);
    req.checkBody(`${type}.expiryDate`, 'expiry date should be greater than date of issue')
      .custom((date) => {
        const expiryDate = new Date(date);
        const dateOfIssue = new Date(req.body[type].dateOfIssue);
        return expiryDate > dateOfIssue;
      });
  }
}
