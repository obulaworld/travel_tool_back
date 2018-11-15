import dotenv from 'dotenv';
import getRequests from './getRequests.data';
import models from '../../database/models';
import Pagination from '../../helpers/Pagination';
import Utils from '../../helpers/Utils';
import {
  createSubquery,
  countByStatus,
  includeStatusSubquery,
  getTotalCount,
  asyncWrapper,
  retrieveParams,
} from '../../helpers/requests';
import ApprovalsController from '../approvals/ApprovalsController';
import RoomsManager from '../guestHouse/RoomsManager';
import UserRoleController from '../userRole/UserRoleController';
import NotificationEngine from '../notifications/NotificationEngine';
import Error from '../../helpers/Error';
import TravelChecklistController from '../travelChecklist/TravelChecklistController';

dotenv.config();

const { Op } = models.Sequelize;
const noResult = 'No records found';
let params = {};
class RequestsController {
  static setRequestParameters(req) {
    params = retrieveParams(req);
    params.userId = req.user.UserInfo.id;
    params.parameters = {
      req,
      limit: params.limit,
      offset: params.offset,
      modelName: 'Request',
      search: params.search,
    };
  }

  static async createRequest(req, res) {
    // eslint-disable-next-line
    let { trips, ...requestDetails } = req.body;
    let request;
    delete requestDetails.status; // requester cannot post status
    try {
      const requestData = {
        ...requestDetails,
        id: Utils.generateUniqueId(),
        userId: req.user.UserInfo.id,
        picture: req.user.UserInfo.picture,
      };
      const fetchRoomData = {
        arrivalDate: trips[0].returnDate,
        departureDate: trips[0].departureDate,
        location: trips[0].destination,
        gender: requestDetails.gender,
      };

      const allAvailableRooms = await RoomsManager.fetchAvailableRooms(
        fetchRoomData,
      );
      const availableBedSpaces = allAvailableRooms.map(bedId => bedId.id);

      trips = trips.map((trip) => {
        if (
          availableBedSpaces.length < 1
          || !availableBedSpaces.includes(trip.bedId)
          || !trip.bedId
        ) {
          // eslint-disable-next-line
          trip.bedId = null;
        }

        return trip;
      });

      await models.sequelize.transaction(async () => {
        request = await models.Request.create(requestData);
        const requestTrips = await models.Trip.bulkCreate(
          trips.map(trip => ({
            ...trip,
            requestId: request.id,
            id: Utils.generateUniqueId(),
          })),
        );

        const approval = await ApprovalsController.createApproval(request);
        request.dataValues.trips = requestTrips;

        const message = 'created a new travel request';
        RequestsController.sendNotificationToManager(
          req,
          res,
          request,
          message,
          'New Travel Request',
          'New Request',
        );

        return res.status(201).json({
          success: true,
          message: 'Request created successfully',
          request,
          approval,
        });
      });
    } catch (error) {
      /* istanbul ignore next */
      return Error.handleError(error.toString(), 500, res);
    }
  }

  static async sendNotificationToManager(
    req,
    res,
    request,
    message,
    mailTopic,
    mailType,
  ) {
    const { userId, id, manager } = request;
    const recipient = await UserRoleController.getRecipient(manager);
    // map the mailType to a notificationType.
    const notificationTypeMap = {
      'New Request': 'pending',
      'Updated Request': 'general'
    };
    const notificationData = {
      senderId: userId,
      recipientId: recipient.userId,
      // if notificationType at this point is undefined then default to
      // general
      notificationType: notificationTypeMap[mailType] || 'general',
      message,
      notificationLink: `/requests/my-approvals/${id}`,
      senderName: req.user.UserInfo.name,
      senderImage: req.user.UserInfo.picture,
    };
    NotificationEngine.notify(notificationData);
    return NotificationEngine.sendMail(RequestsController
      .getMailData(request, recipient, mailTopic, mailType));
  }

  static getMailData(request, recipient, topic, type) {
    return {
      recipient: { name: request.manager, email: recipient.email },
      sender: request.name,
      topic,
      type,
      redirectLink: `${
        process.env.REDIRECT_URL
      }/redirect/requests/my-approvals/${request.id}`,
    };
  }

  static removeTripWhere(subquery) {
    const newSubquery = subquery;
    newSubquery.include.map((includeModel) => {
      const newIncludeModel = includeModel;
      if (newIncludeModel.where) {
        newIncludeModel.where = undefined;
      }
      return newIncludeModel;
    });
    return newSubquery;
  }

  static removeRequestWhere(subquery) {
    let newSubQuery = subquery;
    newSubQuery.where = { userId: params.userId };
    if (params.status) {
      newSubQuery = includeStatusSubquery(
        newSubQuery,
        params.status,
        'Request',
      );
    }
    return newSubQuery;
  }

  static generateSubquery(searchTrips) {
    let subquery = createSubquery(params.parameters);
    if (!searchTrips) {
      subquery = RequestsController.removeTripWhere(subquery);
    } else {
      subquery = RequestsController.removeRequestWhere(subquery);
    }
    return subquery;
  }

  static async getRequestsFromDb(subquery) {
    const requests = await models.Request.findAndCountAll(subquery);
    return requests;
  }

  static async returnRequests(req, res, requests) {
    const count = await asyncWrapper(
      req,
      countByStatus,
      models.Request,
      params.userId,
      params.search,
    );
    const pagination = Pagination.getPaginationData(
      params.page,
      params.limit,
      getTotalCount(params.status, count),
    );
    const message = params.search && !requests.count
      ? noResult
      : Utils.getResponseMessage(pagination, params.status, 'Request');
    const newRequest = Promise.all(requests.rows.map(async (request) => {
      const travelCompletion = await TravelChecklistController
        .checkListPercentage(req, res, request.id);
      request.dataValues.travelCompletion = travelCompletion;
      return request;
    }));

    const allRequests = await newRequest;
    return res.status(200).json({
      success: true, message, requests: allRequests, meta: { count, pagination }
    });
  }

  static async processResult(req, res, searchTrips = false) {
    const subquery = RequestsController.generateSubquery(searchTrips);
    let requests = { count: 0 };
    requests = await asyncWrapper(
      res,
      RequestsController.getRequestsFromDb,
      subquery,
    );
    if (!requests.count && !searchTrips) {
      return RequestsController.processResult(req, res, !searchTrips);
    }
    return RequestsController.returnRequests(req, res, requests);
  }

  static async getUserRequests(req, res) {
    RequestsController.setRequestParameters(req);
    try {
      await RequestsController.processResult(req, res);
    } catch (error) {
      /* istanbul ignore next */
      console.log('error', error);
      return Error.handleError('Server Error', 500, res);
    }
  }

  static async getUserRequestDetails(req, res) {
    const { requestId } = req.params;
    try {
      const requestData = await getRequests(requestId, models);
      if (!requestData) {
        const error = `Request with id ${requestId} does not exist`;
        return Error.handleError(error, 404, res);
      }
      if (requestData.status !== 'Open') {
        const approver = await models.Approval.findOne({
          where: {
            requestId
          }
        });
        const approverImage = await UserRoleController.getRecipient(approver.approverId, null);
        requestData.dataValues.approver = approver.approverId;
        requestData.dataValues.timeApproved = approver.updatedAt;
        requestData.dataValues.approverImage = approverImage.picture;
      }
      return res.status(200).json({
        success: true,
        requestData,
      });
    } catch (error) {
      /* istanbul ignore next */
      return Error.handleError('Server Error', 500, res);
    }
  }

  static async updateRequestTrips(trips, tripData, requestId) {
    const alteredTripData = { ...tripData };
    // Delete trips with ids not included in the update field
    const tripIds = trips
      .filter(trip => trip.id !== undefined)
      .map(trip => trip.id);
    await models.Trip.destroy({
      where: {
        requestId,
        id: { [Op.notIn]: tripIds },
      },
    });
    alteredTripData.bedId = (tripData.bedId < 1) ? null : tripData.bedId;
    const trip = await models.Trip.findById(alteredTripData.id);
    let requestTrip;
    if (trip) {
      requestTrip = await trip.updateAttributes(alteredTripData);
    } else {
      requestTrip = await models.Trip.create({
        requestId,
        ...alteredTripData,
        id: Utils.generateUniqueId(),
      });
    }
    return requestTrip;
  }

  static async updateRequest(req, res) {
    const { requestId } = req.params;
    const { trips, ...requestDetails } = req.body;
    try {
      await models.sequelize.transaction(async () => {
        const request = await models.Request.find({
          where: { userId: req.user.UserInfo.id, id: requestId },
        });
        if (!request) {
          return Error.handleError('Request was not found', 404, res);
        }
        if (request.status !== 'Open') {
          const error = `Request could not be updated because it has been ${request.status.toLowerCase()}`;
          return Error.handleError(error, 409, res);
        }
        const requestTrips = await Promise.all(
          trips.map(trip => RequestsController.updateRequestTrips(trips, trip, request.id)),
        );
        delete requestDetails.status; // status cannot be updated by requester
        const updatedRequest = await request.updateAttributes(requestDetails);
        const message = 'edited a travel request';
        RequestsController.sendNotificationToManager(
          req,
          res,
          request,
          message,
          'Updated Travel Request',
          'Updated Request',
        );
        return res.status(200).json({
          success: true,
          request: updatedRequest,
          trips: requestTrips,
        });
      });
    } catch (error) {
      /* istanbul ignore next */
      return Error.handleError(error, 500, res);
    }
  }
}

export default RequestsController;
