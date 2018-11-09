import _ from 'lodash';
import models from '../database/models';
import CustomError from '../helpers/Error';

const { sequelize } = models;

export default class DocumentsValidator {
  static async validateDocumentName(req, res, next) {
    let { name } = req.body;
    if (!name) {
      return CustomError.handleError('Name field cannot be empty!', 400, res);
    }

    const { id: userId } = req.user.UserInfo;
    name = name.toString().toLowerCase().trim();
    const where = {
      userId,
      name: sequelize
        .where(sequelize.fn(
          'LOWER',
          sequelize.col('name'),
        ), 'LIKE', `${name}`),
    };
    const query = { where };
    return DocumentsValidator.checkDocumentName(name, query, req, res, next);
  }

  static async checkDocumentName(name, query, req, res, next) {
    const regex = /(^[A-Za-z])([0-9a-zA-Z _-]+)$/;
    if (!regex.test(name)) {
      return CustomError.handleError('Name is not valid!', 400, res);
    }

    const documents = await DocumentsValidator.getDocumentFromDb(query, res);
    if (documents.length) {
      return CustomError.handleError(
        `You already have a document with name: '${name}'!`, 400, res
      );
    }
    req.body.name = _.capitalize(name);
    next();
  }

  static async getDocumentFromDb(query, res) {
    try {
      const documents = await models.Document.findAll(query);
      return documents;
    } catch (error) { /* istanbul ignore next */
      return CustomError.handleError('Server Error', 500, res);
    }
  }
}
