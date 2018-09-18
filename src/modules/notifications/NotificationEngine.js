import models from '../../database/models';
import Utils from '../../helpers/Utils';

export default class NotificationEngine {
  static async notify(data) {
    const notification = {
      ...data,
      id: Utils.generateUniqueId(),
      notificationStatus: 'unread',
    };
    // TODO: validate the data
    await models.Notification.create(notification);
    global.io.sockets.emit('notification', notification);
  }
}
