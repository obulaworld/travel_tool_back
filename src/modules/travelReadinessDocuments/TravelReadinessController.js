import models from '../../database/models';
import CustomError from '../../helpers/Error';
import Utils from '../../helpers/Utils';

export default class TravelReadinessController {
  static async addTravelReadinessDocument(req, res) {
    try {
      let newDocument;

      const documentTypes = {
        passport: 'passport',
        visa: 'visa'
      };
      const document = Object.keys(documentTypes).find(type => req.body[type]);

      if (document) {
        const data = req.body[document];
        Object.keys(data)
          .forEach((key) => {
            data[key] = data[key].trim();
          });
        newDocument = {
          id: Utils.generateUniqueId(),
          type: documentTypes[document],
          data: req.body[document],
          userId: req.user.UserInfo.id
        };
      }

      const addedDocument = await models.TravelReadinessDocuments.create(newDocument);
      res.status(201).json({
        success: true,
        message: 'document successfully added',
        addedDocument,
      });
    } catch (error) { /* istanbul ignore next */
      CustomError.handleError(error.message, 500, res);
    }
  }
}
