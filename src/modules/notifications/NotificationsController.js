import models from '../../database/models';
import handleServerError from '../../helpers/serverError';
import notFoundError from '../../helpers/notFoundError';

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
      return notFoundError('You have no notifications at the moment', res);
    } catch (error) {
      return handleServerError('Server Error', res);
    }
  }
}

export default NotificationController;
