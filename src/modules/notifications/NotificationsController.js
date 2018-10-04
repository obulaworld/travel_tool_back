import models from '../../database/models';
import CustomError from '../../helpers/Error';

class NotificationController {
  static async retrieveNotifications(req, res) {
    try {
      const { id } = req.user.UserInfo;
      const notifications = await models.Notification.findAll({
        where: {
          recipientId: id
        },
        order: [
          ['updatedAt', 'DESC']
        ],
      });
      if (notifications.length !== 0) {
        return res.status(200).json({
          success: true,
          message: 'Notification retrieved successfully',
          notifications,
        });
      }
      return CustomError
        .handleError('You have no notifications at the moment', 404, res);
    } catch (error) { /* istanbul ignore next */
      CustomError.handleError('Server Error', 500, res);
    }
  }

  static async updateNotificationStatus(req, res) {
    const { id } = req.user.UserInfo;
    const { currentStatus, newStatus, notificationType } = req.body;
    const msg = `You have no ${notificationType} notifications at the moment`;
    try {
      const notificationIsUpdated = await models.Notification
        .update({ notificationStatus: newStatus },
          {
            where: {
              notificationStatus: currentStatus,
              recipientId: id,
              notificationType
            }
          });
      if (notificationIsUpdated[0]) {
        return res.status(200).json({
          success: true,
          message:
            `All ${notificationType} notifications have been marked as read`
        });
      } if (!notificationIsUpdated[0]) {
        throw new Error(msg);
      }
    } catch (error) {
      if (error.message === msg) {
        return CustomError.handleError(error.message, 404, res);
      }
      return CustomError.handleError('Server Error', 505, res);
    }
  }

  static async markNotificationAsRead(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      if (Number.isNaN(id)) {
        return CustomError
          .handleError('Notification id must be an integer', 422, res);
      }
      const notification = await models.Notification.find({
        where: { recipientId: req.user.UserInfo.id, id }
      });
      if (!notification) {
        return CustomError
          .handleError('This notification does not exist', 404, res);
      }
      if (notification.notificationStatus !== 'unread') {
        const error = 'You\'ve already read this notification';
        return CustomError.handleError(error, 409, res);
      }
      const updatedNotification = await notification.updateAttributes({
        notificationStatus: 'read'
      });
      return res.status(200).json({
        success: true,
        message: 'Notification updated successfully',
        notification: updatedNotification,
      });
    } catch (error) { /* istanbul ignore next */
      CustomError.handleError(error.message, 500, res);
    }
  }
}

export default NotificationController;
