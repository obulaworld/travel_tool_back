import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import models from '../../database/models';
import mailTemplate from '../../helpers/email/mailTemplate';

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
export default class NotificationEngine {
  static async notify(data) {
    const dataKeys = Object.keys(data);
    if (dataKeys.length < 1) {
      /* istanbul ignore next */
      return false;
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
    const newNotification = await models.Notification.create(notification);
    global.io.sockets.emit('notification', newNotification);
  }

  static async sendMail({
    recipient, sender, topic, type, redirectLink, requestId
  }) {
    const mail = {
      to: recipient.email,
      from: process.env.APP_EMAIL,
      subject: topic,
      html: mailTemplate(
        recipient.name,
        sender,
        type,
        redirectLink,
        requestId
      )
    };
    await sgMail.send(mail);
  }
}
