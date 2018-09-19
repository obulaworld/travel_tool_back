import models from '../../database/models';
import Pagination from '../../helpers/Pagination';
import Utils from '../../helpers/Utils';
import { createSubquery, countByStatus } from '../../helpers/requests';
import handleServerError from '../../helpers/serverError';
import ApprovalsController from '../approvals/ApprovalsController';
import UserRoleController from '../userRole/UserRoleController';
import NotificationEngine from '../notifications/NotificationEngine';

class RequestsController {
  static async createRequest(req, res) {
    try {
      const { trips } = req.body;
      const requestData = {
        ...req.body,
        id: Utils.generateUniqueId(),
        userId: req.user.UserInfo.id
      };
      const newRequest = await models.Request.create(requestData);
      await Promise.all(trips.map(trip => newRequest.createTrip(trip)));
      const newApproval = await ApprovalsController.createApproval(newRequest);
      RequestsController.sendNotificationToManager(req, res, newRequest);

      return res.status(201).json({
        success: true,
        message: 'Request created successfully',
        request: newRequest,
        Approval: newApproval,
      });
    } catch (error) { /* istanbul ignore next */
      handleServerError(error, res);
    }
  }

  static async sendNotificationToManager(req, res, request) {
    try {
      const { userId, id, manager } = request;
      const recipientId = await UserRoleController.getRecipientId(manager);

      const notificationData = {
        senderId: userId,
        recipientId: recipientId.userId,
        notificationType: 'pending',
        requestId: id,
        message: 'created a new travel request',
        notificationLink: `/request/${id}`,
        senderName: req.user.UserInfo.name,
        senderImage: req.user.UserInfo.picture,
      };
      NotificationEngine.notify(notificationData);
    } catch (error) { /* istanbul ignore next */
      handleServerError(error, res);
    }
  }

  static async getUserRequests(req, res) {
    const userId = req.user.UserInfo.id;
    const { status } = req.query.status || '';
    const { page, limit, offset } = Pagination.initializePagination(req);
    const subquery = createSubquery(req, limit, offset, 'Request');
    try {
      const requests = await models.Request.findAndCountAll(subquery);
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
      return handleServerError('Server Error', res);
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
        return res.status(404).json({
          message: `Request with id ${requestId} does not exist`,
        });
      }
      return res.status(200).json({
        success: true,
        requestData
      });
    } catch (error) { /* istanbul ignore next */
      return handleServerError('Server Error', res);
    }
  }
}

export default RequestsController;
