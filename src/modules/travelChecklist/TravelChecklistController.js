import cloudinary from 'cloudinary';
import Utils from '../../helpers/Utils';
import models from '../../database/models';
import TravelChecklistHelper from '../../helpers/travelChecklist';
import TripsController from '../trips/TripsController';
import CustomError from '../../helpers/Error';

const { Op } = models.Sequelize;

export default class TravelChecklistController {
  static async createChecklistItem(req, res) {
    try {
      const { resources, ...rest } = req.body;
      const { location } = req.user;
      const andelaCenters = TravelChecklistHelper.getAndelaCenters();

      await models.sequelize.transaction(async () => {
        const createdChecklistItem = await models.ChecklistItem.create({
          ...rest,
          id: Utils.generateUniqueId(),
          destinationName: andelaCenters[`${location}`]
        });
        let createdResources = [];
        if (resources.length) {
          const modifiedResources = TravelChecklistController
            .addChecklistItemId(createdChecklistItem.id, resources);

          createdResources = await models.ChecklistItemResource.bulkCreate(
            modifiedResources
          );
        }
        createdChecklistItem.dataValues.resources = createdResources;
        res.status(201).json({
          success: true,
          message: 'Check list item created successfully',
          checklistItem: createdChecklistItem
        });
      });
    } catch (error) { /* istanbul ignore next */
      CustomError.handleError(error.message, 500, res);
    }
  }

  static addChecklistItemId(checklistItemId, resources) {
    return resources.map(resource => ({
      ...resource,
      checklistItemId,
      id: Utils.generateUniqueId()
    }));
  }

  static async getChecklistsResponse(req, res) {
    try {
      const response = await TravelChecklistHelper.getChecklists(req, res);
      if (response.checklists.length) {
        return res.status(200).json({
          success: true,
          message: 'travel checklist retrieved successfully',
          travelChecklists: response.checklists
        });
      }
      const errorMsg = 'There are no checklist items for your selected destination(s). Please contact your Travel Department.'; // eslint-disable-line
      CustomError.handleError(errorMsg, 404, res);
    } catch (error) { /* istanbul ignore next */
      CustomError.handleError(error, 500, res);
    }
  }

  static async getDeletedChecklistItems(req, res) {
    try {
      const { destinationName } = req.query;
      const andelaCenters = TravelChecklistHelper.getAndelaCenters();
      const ChecklistItems = await models.ChecklistItem
        .findAll({
          paranoid: false,
          where: {
            deletedAt: {
              [Op.ne]: null
            },
            destinationName: andelaCenters[`${destinationName}`]
          },
          include: {
            model: models.ChecklistItemResource,
            as: 'resources',
            paranoid: false,
            attributes: ['id', 'label', 'link', 'checklistItemId']
          }
        });
      if (ChecklistItems.length) {
        return res.status(200).json({
          success: true,
          message: 'deleted travel checklist items retrieved successfully',
          deletedTravelChecklists: ChecklistItems
        });
      }
      const errorMsg = 'There are currently no deleted travel checklist items for your location'; // eslint-disable-line
      CustomError.handleError(errorMsg, 404, res);
    } catch (error) {
      CustomError.handleError(error, 500, res);
    }
  }

  static async getApprovedRequest(type, requestId, res) {
    try {
      const requestType = await models.Request.findOne({
        where: {
          status: type,
          id: requestId,
        }
      });
      return requestType;
    } catch (error) { /* istanbul ignore next */
      CustomError.handleError(error, 500, res);
    }
  }

  static async getSubmissions(requestId, res) {
    try {
      const request = await TravelChecklistController
        .getApprovedRequest('Approved', requestId, res);
      let where = {};
      let submissions = [];
      const trips = await TripsController.getTripsByRequestId(requestId, res);
      const tripsId = trips.map(trip => trip.id);
      where = { tripId: { [Op.in]: tripsId } };

      if (request) {
        submissions = await models.ChecklistSubmission.findAll({ where });
      }
      return submissions;
    } catch (error) { /* istanbul ignore next */
      CustomError.handleError(error, 500, res);
    }
  }

  static async checkListPercentageNumber(req, res, requestId) {
    const getChecklists = await TravelChecklistHelper.getChecklists(req, res);
    const checklistLength = getChecklists.checklists.length;
    const getSubmissions = await TravelChecklistController
      .getSubmissions(requestId, res);
    const percentage = Math
      .floor((getSubmissions.length / checklistLength) * 100);
    return percentage;
  }

  static async checkListPercentage(req, res, requestId) {
    const percentage = await TravelChecklistController
      .checkListPercentageNumber(req, res, requestId);
    const completedPercentage = `${isNaN(percentage) ? 0 : percentage}% complete`; // eslint-disable-line
    return completedPercentage;
  }

  static async updateResources(checklistItemId, resources) {
    await models.ChecklistItemResource.destroy({ where: { checklistItemId }, force: true });
    const newResources = TravelChecklistController
      .addChecklistItemId(checklistItemId, resources);
    await models.ChecklistItemResource.bulkCreate(newResources);
    const updatedResources = await models.ChecklistItemResource
      .findAll({ where: { checklistItemId } });
    return updatedResources;
  }

  static async updateChecklistItem(req, res) {
    try {
      const { location } = req.user;
      const andelaCenters = TravelChecklistHelper.getAndelaCenters();
      const checklistItemId = req.params.checklistId;
      const { name, requiresFiles, resources } = req.body;
      const checklistItem = await models.ChecklistItem.findOne({
        paranoid: false, where: { id: checklistItemId, destinationName: andelaCenters[`${location}`] }
      });
      if (checklistItem) {
        const responseMessage = checklistItem.dataValues.deletedAt === null
          ? 'Checklist item sucessfully updated' : 'Checklist item sucessfully restored';
        const updatedChecklistItem = await checklistItem
          .update({
            name, requiresFiles, deletedAt: null, deleteReason: null
          });
        checklistItem.setDataValue('deletedAt', null);
        checklistItem.save();

        const updatedResources = await TravelChecklistController
          .updateResources(checklistItemId, resources);

        return res.status(200).json({
          success: true,
          message: responseMessage,
          updatedChecklistItem: {
            name: updatedChecklistItem.name,
            destinationName: updatedChecklistItem.destinationName,
            deletedAt: updatedChecklistItem.deletedAt,
            requiresFiles: updatedChecklistItem.requiresFiles,
            resources: updatedResources
          }
        });
      }
      return CustomError
        .handleError('Checklist item cannot be found', 404, res);
    } catch (error) { /* istanbul ignore next */
      return CustomError.handleError('Server Error', 500, res);
    }
  }

  static async fetchChecklistItemAndResources(req, checklistId) {
    const andelaCenters = TravelChecklistHelper.getAndelaCenters();
    const { location } = req.user;
    const checklistItem = await models.ChecklistItem.findOne({
      where: { id: checklistId, destinationName: andelaCenters[`${location}`] }
    });
    const checklistItemResources = await models.ChecklistItemResource
      .find({ where: { checklistItemId: checklistId } });
    const checklistSubmissions = await models.ChecklistSubmission
      .find({ where: { checklistItemId: checklistId } });
    return { checklistItem, checklistItemResources, checklistSubmissions };
  }

  static async deleteChecklistItem(req, res) {
    try {
      const { deleteReason } = req.body;
      const { checklistId } = req.params;
      const resources = await TravelChecklistController
        .fetchChecklistItemAndResources(req, checklistId);

      const {
        checklistItem, checklistItemResources, checklistSubmissions
      } = resources;

      if (!checklistItem) {
        return res.status(404).json({
          success: false, message: 'Checklist item not found'
        });
      }
      await checklistItem.update({ deleteReason });
      await checklistItem.destroy(); /* istanbul ignore next */
      if (checklistItemResources) checklistItemResources.destroy(); /* istanbul ignore next */
      if (checklistSubmissions) checklistSubmissions.destroy(); /* istanbul ignore next */
      return res.status(200).json({
        success: true, message: 'Checklist item deleted successfully', checklistItem
      });
    } catch (error) { /* istanbul ignore next */
      CustomError.handleError(error.stack, 500, res);
    }
  }

  static async handleCloudinaryUpload(file, tags, props, fileName) {
    const { tripId, checklistItemId } = props;
    let cloudinaryResponse;
    await cloudinary.v2.uploader.upload(`${file}`,
      { resource_type: 'raw', tags },
      (error, result) => {
        cloudinaryResponse = result;
      });
    return {
      value: {
        url: cloudinaryResponse.url,
        secureUrl: cloudinaryResponse.secure_url,
        publicId: cloudinaryResponse.public_id,
        fileName,
      },
      tripId,
      checklistItemId,
    };
  }

  static async handleUpdateSubmission(submissionId, checklistSubmission, res) {
    let submission;
    try {
      if (submissionId) {
        const checkSubmission = await
        models.ChecklistSubmission.findById(submissionId);
        submission = await checkSubmission.update(checklistSubmission);
      } else {
        const existingSubmission = await
        models.ChecklistSubmission.find({
          where: {
            tripId: checklistSubmission.tripId,
            checklistItemId: checklistSubmission.checklistItemId
          }
        });
        if (existingSubmission) {
          await existingSubmission.destroy();
        }
        submission = await
        models.ChecklistSubmission.create({
          ...checklistSubmission,
          id: Utils.generateUniqueId()
        });
      }
    } catch (error) { /* istanbul ignore next */
      return CustomError.handleError(error, 500, res);
    }
    return submission;
  }

  static async postTripChecklistItemSubmission(req, res) {
    const { checklistItemId } = req.params;
    const {
      file, tripId, isUpload, data, label, submissionId, fileName
    } = req.body;
    let checklistSubmission;
    let submission;
    const extension = file ? file.split('.')[1] : null;
    const body = { tripId, checklistItemId };
    if (isUpload) {
      try {
        checklistSubmission = await TravelChecklistController
          .handleCloudinaryUpload(file, [extension, label], body, fileName);
      } catch (error) { /* istanbul ignore next */
        if (error.error) {
          const isError = error.error.errno === -2 ? error : '';
          return CustomError.handleError(isError, 404, res);
        }
        return CustomError.handleError(error, 500, res);
      }
    } else {
      checklistSubmission = {
        value: data,
        tripId,
        checklistItemId,
      };
    }
    await models.sequelize.transaction(async () => {
      submission = await TravelChecklistController
        .handleUpdateSubmission(submissionId, checklistSubmission, res);
    });
    return res.status(201).json({
      success: true,
      submission,
      message: 'Uploaded Successfully'
    });
  }

  static async getCheckListItemSubmission(req, res) {
    const { requestId } = req.params;
    let submissions;
    try {
      submissions = await TravelChecklistController.getSubmissions(requestId, res);
    } catch (error) { /* istanbul ignore next */
      return CustomError.handleError(error, 500, res);
    }
    let message;
    if (submissions.length > 0) {
      submissions = submissions.map((submission) => {
        let { value } = submission;
        const newValue = JSON.parse(value);
        value = newValue;
        return submission;
      });
      message = 'Successfully retrieved';
    } else {
      message = 'Submission does not exist';
    }
    return res.status(200).json({
      success: true,
      submissions,
      message
    });
  }
}
