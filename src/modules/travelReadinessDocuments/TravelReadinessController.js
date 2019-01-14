import models from '../../database/models';
import CustomError from '../../helpers/Error';
import Utils from '../../helpers/Utils';
import NotificationEngine from '../notifications/NotificationEngine';
import TravelReadinessUtils from './TravelReadinessUtils';
import UserRoleController from '../userRole/UserRoleController';
import RoleValidator from '../../middlewares/RoleValidator';


export default class TravelReadinessController {
  static async addTravelReadinessDocument(req, res) {
    try {
      let newDocument;

      const documentTypes = {
        passport: 'passport',
        visa: 'visa',
        other: 'other',
      };
      const document = Object.keys(documentTypes).find(type => req.body[type]);

      if (document) {
        const data = req.body[document];
        const newData = { ...data };
        Object.keys(newData)
          .forEach((key) => {
            newData[key] = newData[key].trim();
          });
        newDocument = {
          id: Utils.generateUniqueId(),
          type: documentTypes[document],
          data: newData,
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

  static async getTravelReadinessDocument(req, res) {
    const { documentId } = req.params;
    try {
      const document = await models.TravelReadinessDocuments.findOne({
        where: { id: documentId }
      });

      if (!document) {
        return res.status(404).json({
          success: false,
          message: `Document with id ${documentId} does not exist`,
        });
      }

      const handleResponse = () => {
        res.status(200).json({
          success: true,
          message: 'Document successfully fetched',
          document
        });
      };

      // check if logged in user/admin is the one requesting this resource
      if (req.user.UserInfo.id !== document.userId) {
        return RoleValidator.checkUserRole(
          ['Super Administrator', 'Travel Administrator']
        )(req, res, handleResponse);
      }

      return handleResponse();
    } catch (error) { /* istanbul ignore next */
      CustomError.handleError(error.message, 500, res);
    }
  }

  static async getAllUsersReadiness(req, res) {
    try {
      const users = await models.User.findAll({
        where: { location: req.user.location },
        include: [
          {
            model: models.TravelReadinessDocuments,
            as: 'travelDocuments',
          },
        ]
      });
      return res.status(200).json({
        success: true,
        message: 'Fetched users successfully',
        users,
      });
    } catch (error) { /* istanbul ignore next */
      CustomError.handleError(error.message, 500, res);
    }
  }

  static async getUserReadiness(req, res) {
    const { id } = req.params;
    try {
      const user = await models.User.findOne({
        where: { userId: id },
        include: [
          {
            model: models.TravelReadinessDocuments,
            as: 'travelDocuments',
          },
        ]
      });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: `User with id ${id} does not exist`,
        });
      }

      const userData = user.dataValues;
      const { travelDocuments } = userData;
      const readinessDocuments = {};

      travelDocuments.forEach((i) => {
        readinessDocuments[i.type] = readinessDocuments[i.type] || [];
        readinessDocuments[i.type].push(i);
      });
      userData.travelDocuments = readinessDocuments;

      return res.status(200).json({
        success: true,
        message: 'Fetched user readiness successfully',
        user,
      });
    } catch (error) { /* istanbul ignore next */
      CustomError.handleError(error.message, 500, res);
    }
  }

  static async verifyTravelReadinessDocuments(req, res) {
    try {
      const { documentId } = req.params;

      const travelReadiness = await models.TravelReadinessDocuments.findById(documentId);

      if (!travelReadiness) {
        return res.status(404).json({
          success: false,
          message: 'Document does not exist',
        });
      }
      const recipient = await UserRoleController.getRecipient(null, travelReadiness.userId);
      travelReadiness.isVerified = true;
      travelReadiness.save();
      await TravelReadinessController.sendMailToUser(travelReadiness, recipient, req.user);
      return res.status(200).json({
        success: true,
        message: 'Document successfully verified',
        updatedDocument: travelReadiness,
      });
    } catch (error) { /* istanbul ignore next */
      CustomError.handleError(error.message, 500, res);
    }
  }

  static async sendMailToUser(details, user, travelAdmin) {
    const topic = 'Travel Readiness Document Verification';
    const type = 'Travel Readiness Document Verified';
    const mailData = await TravelReadinessUtils.getMailData(details, user, topic, type, travelAdmin);
    NotificationEngine.sendMail(mailData);
  }
}
