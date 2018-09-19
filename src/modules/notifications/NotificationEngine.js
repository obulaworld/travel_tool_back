import models from '../../database/models';

export default class NotificationEngine {
  static async notify(data) {
    const notification = {
      ...data,
      notificationStatus: 'unread',
    };
    // TODO: validate the data
    await models.Notification.create(notification);
    /* istanbul ignore next */
    global.io.sockets.emit('notification', notification);
  }
}
