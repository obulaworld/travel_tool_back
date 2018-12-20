import moment from 'moment';
import models from '../../database/models';
import UserRoleController from '../userRole/UserRoleController';


export default class TripUtils {
  static async fetchTripsOriginAndDestination(tripId) {
    const tripsOriginAndDestination = await models.Trip.findOne({
      where: {
        id: tripId,
      },
      attributes: ['origin', 'destination', 'returnDate', 'checkInDate'],
      include: [{
        as: 'beds',
        model: models.Bed,
        include: [{
          as: 'rooms',
          model: models.Room,
          include: [{
            as: 'guestHouses',
            model: models.GuestHouse,
            attributes: ['id', 'houseName'],
          }]
        }]
      }],
    });
    return tripsOriginAndDestination;
  }

  static async getRecipients(req) {
    const { tripId } = req.params;
    const roleId = 29187;
    const tripDetails = await TripUtils.fetchTripsOriginAndDestination(tripId);
    const admins = await UserRoleController.calculateUserRole(roleId);
    const centers = admins.users.map(user => ({
      email: user.email,
      fullName: user.fullName,
      center: user.centers[0]
    }));
    const recipients = centers.filter(list => list.center.location === tripDetails.origin
       || list.center.location === tripDetails.destination);
    return recipients;
  }

  static async getCheckInMailData(
    tripId, recipient, sender, topic, type, recipientVars
  ) {
    const redirect = '/redirect/residence/manage/guest-houses/';
    const checkInDetails = await TripUtils.fetchTripsOriginAndDestination(tripId);

    // Calculate duration of stay
    const checkIn = moment(checkInDetails.checkInDate);
    const checkOut = moment(checkInDetails.returnDate);
    const days = checkOut.diff(checkIn, 'days') + 1;

    const mailContent = {
      recipient,
      sender,
      topic,
      type,
      redirectLink: `${process.env.REDIRECT_URL}${redirect}${checkInDetails.beds.rooms.guestHouses.id}`,
      guesthouseName: checkInDetails.beds.rooms.guestHouses.houseName,
      checkInTime: moment(checkInDetails.checkInDate).format('hh:mm:ss a'),
      durationOfStay: days,
      recipientVars
    };
    return mailContent;
  }

  static getMailData(request, user, topic, type, travelAdmin) {
    const mailBody = {
      recipient: { name: user.fullName, email: user.email },
      sender: travelAdmin.name,
      topic,
      type,
      requestId: request.id,
      redirectLink:
        `${process.env.REDIRECT_URL}/requests/${request.id}`
    };
    return mailBody;
  }
}
