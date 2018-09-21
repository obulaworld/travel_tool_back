import models from '../../database/models';
import Pagination from '../../helpers/Pagination';
import Utils from '../../helpers/Utils';
import { createSubquery, countByStatus } from '../../helpers/requests';
import ApprovalsController from '../approvals/ApprovalsController';
import UserRoleController from '../userRole/UserRoleController';
import NotificationEngine from '../notifications/NotificationEngine';
import Error from '../../helpers/Error';

const { Op } = models.Sequelize;

class RequestsController {
  static async createRequest(req, res) {
    const { trips, ...requestDetails } = req.body;
    let request;
    delete requestDetails.status; // requester cannot post status
    try {
      const requestData = {
        ...requestDetails,
        id: Utils.generateUniqueId(),
        userId: req.user.UserInfo.id
      };
      await models.sequelize.transaction(async () => {
        request = await models.Request.create(requestData);
        const requestTrips = await models.Trip.bulkCreate(trips.map(trip => (
          {
            ...trip,
            requestId: request.id,
            id: Utils.generateUniqueId()
          }
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
      RequestsController.sendNotificationToManager(req, res, request, message);
    } catch (error) { /* istanbul ignore next */
      return Error.handleError(error.toString(), 500, res);
    }
  }

  static async sendNotificationToManager(req, res, request, message) {
    try {
      const { userId, id, manager } = request;
      const recipientId = await UserRoleController.getRecipientId(manager);

      const notificationData = {
        senderId: userId,
        recipientId: recipientId.userId,
        notificationType: 'pending',
        message,
        notificationLink: `/requests/my-approvals/${id}`,
        senderName: req.user.UserInfo.name,
        senderImage: req.user.UserInfo.picture,
      };
      return NotificationEngine.notify(notificationData);
    } catch (error) { /* istanbul ignore next */
      Error.handleError(error, 500, res);
    }
  }

  static async getUserRequests(req, res) {
    const userId = req.user.UserInfo.id;
    const { status } = req.query.status || '';
    const { page, limit, offset } = Pagination.initializePagination(req);
    const subquery = createSubquery(req, limit, offset, 'Request');
    const query = {
      ...subquery,
      include: [{
        model: models.Trip,
        as: 'trips',
      }]
    };
    try {
      const requests = await models.Request.findAndCountAll(query);
      const count = await countByStatus(models.Request, userId);
      const pagination = Pagination.getPaginationData(page, limit, requests);
      const message = Utils.getResponseMessage(pagination, status, 'Request');
      return res.status(200).json({
        success: true,
        message,
        requests: requests.rows,
        meta: {
          count,
          pagination
        }
      });
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
          where: {userId: req.user.UserInfo.id, id: requestId }
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
        RequestsController.sendNotificationToManager(req, res, request, message);
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
