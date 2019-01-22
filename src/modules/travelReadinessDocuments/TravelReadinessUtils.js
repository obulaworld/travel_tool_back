import NotificationEngine from '../notifications/NotificationEngine';
import UserRoleController from '../userRole/UserRoleController';
import Validator from '../../middlewares/Validator';

class TravelReadinessUtils {
  static getMailData(details, user, topic, type, travelAdmin) {
    const mailBody = {
      recipient: { name: user.fullName, email: user.email, details },
      sender: travelAdmin.UserInfo.name,
      topic,
      type,
      details,
      requestId: details.id,
      redirectLink: `${process.env.REDIRECT_URL}/travel_readiness?id=${
        details.id
      }&type=${details.type}`
    };
    return mailBody;
  }

  static async sendMailToTravelTeamMembers(documentDeleter, deleterEmail) {
    const query = {
      where: {
        email: deleterEmail
      }
    };
    const { location: userLocation } = await Validator.getUserFromDb(query);
    const { users: travelMembers } = await UserRoleController.calculateUserRole('339458');
    const travelTeamMembers = travelMembers.filter((member) => {
      const { centers } = member;
      const { location } = centers[0];
      return location.includes(userLocation);
    });

    const data = {
      sender: documentDeleter,
      topic: 'Deletion of travel document',
      type: 'Send delete email verification'
    };
    if (travelTeamMembers.length) {
      return NotificationEngine.sendMailToMany(
        travelTeamMembers,
        data
      );
    }
  }
}

export default TravelReadinessUtils;
