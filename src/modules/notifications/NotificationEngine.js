import mail from 'mailgun-js';
import dotenv from 'dotenv';
import models from '../../database/models';
import mailTemplate from '../../helpers/email/mailTemplate';

dotenv.config();

export default class NotificationEngine {
  static async notify(data) {
    const dataKeys = Object.keys(data);
    /* istanbul ignore next */

    if (dataKeys.length < 1) {
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

  static sendMail({
    recipient, sender, topic, type, redirectLink, requestId, comment
  }) {
    const mailgun = mail({
      apiKey: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN_NAME
    });

    const data = {
      from: `Travela <${process.env.MAIL_SENDER}>`,
      to: `${recipient.email}`,
      subject: topic,
      html: mailTemplate(
        recipient.name,
        sender,
        type,
        redirectLink,
        requestId,
        comment
      )
    };
    /* istanbul ignore next */
    if (process.env.NODE_ENV !== 'test') {
      mailgun.messages().send(data);
    }
  }

  static getReciepientVariables(records) {
    const recipientVars = {};
    records.forEach((recipient) => {
      recipientVars[recipient.email] = {
        name: recipient.name,
      };
    });
    return { recipientVars };
  }

  static sendMailToMany({
    recipient, sender, topic, type, redirectLink, requestId, comment, guesthouseName, checkInTime, durationOfStay, recipientVars
  }) {
    const mailgun = mail({
      apiKey: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN_NAME
    });
    const emails = recipient.map(value => value.email);
    const data = {
      from: `Travela <${process.env.MAIL_SENDER}>`,
      to: emails.join(','),
      subject: topic,
      html: mailTemplate(
        recipient.name,
        sender,
        type,
        redirectLink,
        requestId,
        comment,
        guesthouseName,
        checkInTime,
        durationOfStay
      ),
      'recipient-variables': JSON.stringify(recipientVars),
    };
    /* istanbul ignore next */
    if (process.env.NODE_ENV !== 'test') {
      mailgun.messages().send(data);
    }
  }
}
