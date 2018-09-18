import models from '../../database/models';
import handleServerError from '../../helpers/serverError';

class NotificationController {
  static async RetrieveNotifications(req, res) {
    try {
      const { id } = req.user.UserInfo;
      const notifications = await models.Notification.findAll({
        where: {
          recipientId: id
        }
      });
      return res.status(200).json({
        success: true,
        message: 'Notification retrieved successfully',
        notifications,
      });
    } catch (error) {
      handleServerError(error, res);
    }
  }
}

export default NotificationController;
