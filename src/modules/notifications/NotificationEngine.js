import models from '../../database/models';

export default class NotificationEngine {
  static async notify(data) {
    const dataKeys = Object.keys(data);
    if (dataKeys.length < 1) {
      return;
    }
    const validKeys = ['senderId', 'recipientId', 'notificationType',
      'requestId', 'message', 'notificationLink',
      'notificationStatus', 'senderName', 'senderImage'];
    const validateData = validKeys.map((value) => {
      if (dataKeys.includes(value) === false) {
        return false;
      }
      return true;
    });
    /* istanbul ignore next */
    if (validateData === false) {
      return false;
    }
    const notification = {
      ...data,
      notificationStatus: 'unread',
    };
    await models.Notification.create(notification);
    global.io.sockets.emit('notification', notification);
  }
}
