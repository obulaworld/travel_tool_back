import models from '../../database/models';
import CustomError from '../../helpers/Error';

class NotificationController {
  static async retrieveNotifications(req, res) {
    try {
      const { id } = req.user.UserInfo;
      const notifications = await models.Notification.findAll({
        where: {
          recipientId: id
        }
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

  /**
   * Updates notification statuses
   *
   * @param {object} req - Request object
   * @param  {object} res - Response object
   * @return {json} res.send
   * @memberof NotificationController
   */
  static async updateNotificationStatus(req, res) {
    const { id } = req.user.UserInfo;
    const { currentStatus, newStatus, notificationType } = req.body;
    try {
      const notificationIsUpdated = await models.Notification
        .update({ notificationStatus: newStatus },
          { where: { notificationStatus: currentStatus, recipientId: id, notificationType } }); // eslint-disable-line
      if (notificationIsUpdated[0]) {
        return res.status(200).json({
          success: true,
          message:
            `All ${notificationType} notifications have been marked as read`
        });
      } if (!notificationIsUpdated[0]) {
        throw new Error(`You have no ${notificationType} notifications at the moment`); // eslint-disable-line
      }
    } catch (error) {
      if (error.message === `You have no ${notificationType} notifications at the moment`) { // eslint-disable-line
        return CustomError.handleError(error.message, 404, res);
      }
      return CustomError.handleError('Server Error', 505, res);
    }
  }
}

export default NotificationController;
