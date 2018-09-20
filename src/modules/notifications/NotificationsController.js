import models from '../../database/models';
import Error from '../../helpers/Error';

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
      return Error
        .handleError('You have no notifications at the moment', 404, res);
    } catch (error) { /* istanbul ignore next */
      Error.handleError(error, 500, res);
    }
  }
}

export default NotificationController;
