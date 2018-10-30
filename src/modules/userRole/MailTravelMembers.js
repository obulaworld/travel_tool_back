import dotenv from 'dotenv';
import cron from 'node-cron';
import models from '../../database/models';
import NotificationEngine from '../notifications/NotificationEngine';
import TravelChecklistController from '../travelChecklist/TravelChecklistController';
import UserRoleController from './UserRoleController';

dotenv.config();

class MailTravelMembers {
  /* istanbul ignore next */
  static async sendTravelTeamEmails(requester, trips, travelCompletion) {
    try {
      const travelTeamMembers = await UserRoleController.calculateUserRole('339458');
      const { users } = travelTeamMembers.dataValues;
      trips.filter(async (trip) => {
        const { destination, origin, id } = trip;
        const requestTrip = await models.Trip.findById(id);
        users.filter(async (travelTeamMember) => {
          const { location } = travelTeamMember.centers[0];
          const { fullName, email } = travelTeamMember;
          const recipient = {
            fullName,
            email
          };
          if(requestTrip.travelCompletion !== 'true'
          && travelCompletion === 100){
            if(location === origin){
              await MailTravelMembers.sendMailToOrigin(requester, recipient, destination, requestTrip);
            }
            else if(location === destination){
              await MailTravelMembers.sendMailToDestination(requester, recipient, destination, requestTrip);
            }
          }
          });
          })
        } catch (error) {
              return error;
        }}

        /* istanbul ignore next */
  static async sendMailToOrigin(requester, recipient, destination, requestTrip){
    await MailTravelMembers.sendNotificationToManager(
      recipient, 'Travel readiness completion', 'Travel readiness', requester, destination
    );
    requestTrip.update({
      travelCompletion: 'true'
    });
  }

   /* istanbul ignore next */
   static async sendMailToDestination(requester, recipient, destination, requestTrip){
    await MailTravelMembers.sendNotificationToManager(
      recipient, 'Travel readiness completion', 'Travel readiness', requester, destination
    );
    requestTrip.update({
      travelCompletion: 'true'
    });
  }

  /* istanbul ignore next */
  static async sendNotificationToManager(
    recipient, topic, type, requester, destination
  ) {
    const mailBody = {
      recipient: { name: recipient.fullName, email: recipient.email },
      sender: ['Travela', requester, destination],
      topic,
      type,
    };
    return NotificationEngine.sendMail(mailBody);
  }

  /* istanbul ignore next */
  static async executeMailSend(req, res) {
    const allRequest = await models.Request.findAll({
      include: [{
        model: models.Trip,
        as: `${models.Trip.name.toLowerCase()}s`,
      }]
    });
    Promise.all(allRequest.map(async (request) => {
      const travelCompletion = await TravelChecklistController
        .checkListPercentageNumber(req, res, request.id);
      request.dataValues.travelCompletion = travelCompletion;
      const { trips, name } = request.dataValues;
      if (travelCompletion === 100) {
        MailTravelMembers
          .sendTravelTeamEmails(name, trips, travelCompletion);
      }
      return request;
    }));
  }

  /* istanbul ignore next */
  static async sendMail(req, res) {
    cron.schedule('* * 2 * *', async () => {
      await MailTravelMembers.executeMailSend(req, res);
    });
  }
}

export default MailTravelMembers;