import dotenv from 'dotenv';
import models from '../../database/models';
import Pagination from '../../helpers/Pagination';
import Utils from '../../helpers/Utils';
import {
  createSubquery,
  countByStatus,
  includeStatusSubquery,
  getTotalCount,
  asyncWrapper,
  retrieveParams
}
  from '../../helpers/requests';
import ApprovalsController from '../approvals/ApprovalsController';
import UserRoleController from '../userRole/UserRoleController';
import NotificationEngine from '../notifications/NotificationEngine';
import Error from '../../helpers/Error';

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
      search: params.search
    };
  }

  static async createRequest(req, res) {
    const { trips, ...requestDetails } = req.body;
    let request;
    delete requestDetails.status; // requester cannot post status
    try {
      const requestData = {
        ...requestDetails,
        id: Utils.generateUniqueId(),
        userId: req.user.UserInfo.id,
        picture: req.user.UserInfo.picture
      };
      await models.sequelize.transaction(async () => {
        request = await models.Request.create(requestData);
        const requestTrips = await models.Trip.bulkCreate(trips.map(trip => (
          { ...trip, requestId: request.id, id: Utils.generateUniqueId() }
        )));
        const approval = await ApprovalsController.createApproval(request);
        request.dataValues.trips = requestTrips;
        return res.status(201).json({
          success: true,
          message: 'Request created successfully',
          request,
          approval
        });
      });
      const message = 'created a new travel request';
      RequestsController.sendNotificationToManager(
        req, res, request, message, 'New Travel Request', 'New Request'
      );
    } catch (error) { /* istanbul ignore next */
      return Error.handleError(error.toString(), 500, res);
    }
  }

  static async sendNotificationToManager(
    req, res, request, message, mailTopic, mailType
  ) {
    try {
      const { userId, id, manager } = request;
      const recipient = await UserRoleController.getRecipient(manager);
      const notificationData = {
        senderId: userId,
        recipientId: recipient.userId,
        notificationType: 'pending',
        message,
        notificationLink: `/requests/my-approvals/${id}`,
        senderName: req.user.UserInfo.name,
        senderImage: req.user.UserInfo.picture,
      };
      NotificationEngine.notify(notificationData);
      const mailData = RequestsController
        .getMailData(request, recipient, mailTopic, mailType);
      return NotificationEngine.sendMail(mailData);
    } catch (error) { /* istanbul ignore next */
      Error.handleError(error, 500, res);
    }
  }

  static getMailData(request, recipient, topic, type) {
    const mailBody = {
      recipient: { name: request.manager, email: recipient.email },
      sender: request.name,
      topic,
      type,
      redirectLink:
        `${process.env.REDIRECT_URL}/requests/my-approvals/${request.id}`
    };
    return mailBody;
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
        newSubQuery, params.status, 'Request'
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
      params.search
    );
    const pagination = Pagination
      .getPaginationData(
        params.page,
        params.limit,
        getTotalCount(params.status, count)
      );
    const message = (params.search && !requests.count)
      ? noResult
      : Utils.getResponseMessage(pagination, params.status, 'Request');
    return res.status(200).json({
      success: true,
      message,
      requests: requests.rows,
      meta: { count, pagination }
    });
  }

  static async processResult(req, res, searchTrips = false) {
    const subquery = RequestsController.generateSubquery(searchTrips);
    let requests = { count: 0 };
    requests = await
    asyncWrapper(res, RequestsController.getRequestsFromDb, subquery);
    if (!requests.count && !searchTrips) {
      return RequestsController.processResult(req, res, !searchTrips);
    }
    return RequestsController.returnRequests(req, res, requests);
  }

  static async getUserRequests(req, res) {
    RequestsController.setRequestParameters(req);
    try {
      await RequestsController.processResult(req, res);
    } catch (error) { /* istanbul ignore next */
      return Error.handleError('Server Error', 500, res);
    }
  }

  static async getUserRequestDetails(req, res) {
    const { requestId } = req.params;
    try {
      const requestData = await models.Request.find({
        where: { id: requestId },
        include: ['comments', 'trips'],
      });
      if (!requestData) {
        const error = `Request with id ${requestId} does not exist`;
        return Error.handleError(error, 404, res);
      }
      return res.status(200).json({
        success: true,
        requestData
      });
    } catch (error) { /* istanbul ignore next */
      return Error.handleError('Server Error', 500, res);
    }
  }

  static async updateRequestTrips(trips, tripData, requestId) {
    // Delete trips with ids not included in the update field
    const tripIds = trips.filter(trip => trip.id !== undefined)
      .map(trip => trip.id);
    await models.Trip.destroy({
      where: {
        requestId,
        id: { [Op.notIn]: tripIds }
      },
    });
    const trip = await models.Trip.findById(tripData.id);
    let requestTrip;
    if (trip) {
      requestTrip = await trip.updateAttributes(tripData);
    } else {
      requestTrip = await models.Trip.create({
        requestId,
        ...tripData,
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
          where: { userId: req.user.UserInfo.id, id: requestId }
        });
        if (!request) {
          return Error.handleError('Request was not found', 404, res);
        }
        if (request.status !== 'Open') {
          const error = `Request could not be updated because it has been ${
            request.status.toLowerCase()}`;
          return Error.handleError(error, 409, res);
        }
        const requestTrips = await Promise.all(trips.map(trip => (
          RequestsController.updateRequestTrips(trips, trip, request.id)
        )));
        delete requestDetails.status; // status cannot be updated by requester
        const updatedRequest = await request.updateAttributes(requestDetails);
        const message = 'edited a travel request';
        RequestsController.sendNotificationToManager(req, res, request, message,
          'Updated Travel Request', 'Updated Request');
        return res.status(200).json({
          success: true,
          request: updatedRequest,
          trips: requestTrips
        });
      });
    } catch (error) { /* istanbul ignore next */
      return Error.handleError(error, 500, res);
    }
  }
}

export default RequestsController;
