import models from '../../database/models';
import NotificationEngine from '../notifications/NotificationEngine';
import Error from '../../helpers/Error';
import TripUtils from './TripUtils';

const { Op } = models.Sequelize;
let checkTypeErrorMessage = '';
const getReturnedTrip = (where, userId) => models.Trip.findOne({
  where,
  include: [{
    required: true,
    model: models.Request,
    as: 'request',
    where: {
      status: 'Verified',
      userId,
    },
  }]
});
class TripsController {
  static createWhereClause(tripId, checkType) {
    let where = {};
    if (checkType === 'checkIn') {
      where = {
        id: tripId,
        checkInDate: null,
      };
      checkTypeErrorMessage = 'User has already checked in';
    } else {
      where = {
        id: tripId,
        checkInDate: { [Op.ne]: null },
        checkOutDate: null,
      };
      checkTypeErrorMessage = 'User has either checked out or not checked in';
    }
    return where;
  }

  static async updateTrip(trip, checkType) {
    const tripModel = trip;
    if (checkType === 'checkIn') {
      tripModel.checkInDate = new Date();
      tripModel.checkStatus = 'Checked In';
      await tripModel.save();
    } else {
      tripModel.checkOutDate = new Date();
      tripModel.checkStatus = 'Checked Out';
      await tripModel.save();
    }
    return tripModel;
  }

  static async sendNotification(req, request, checkType) {
    const message = (checkType === 'checkIn')
      ? 'You have successfully checked-in'
      : 'You have successfully checked-out';
    const { userId } = request;
    const notificationData = {
      senderId: userId,
      recipientId: userId,
      notificationType: 'general',
      message,
      notificationLink: '/accommodation/bookedrooms',
      senderName: req.user.UserInfo.name,
      senderImage: req.user.UserInfo.picture,
    };
    return NotificationEngine.notify(notificationData);
  }

  static async sendSurveyEmail(requestId) {
    try {
      const request = await models.Request.findById(requestId);
      const user = await models.User.findOne({
        where: { userId: request.userId }
      });
      const recipient = { name: user.fullName, email: user.email };
      const sender = 'travelaApp';
      const topic = 'Travel Survey Email';
      const type = 'Trip Survey';
      const mailData = TripsController.getSurveyMailData(
        recipient, sender, topic, type
      );
      NotificationEngine.sendMail(mailData);
    } catch (error) { /* istanbul ignore next */ }
  }

  static async sendMailToTravelAdmin(requestId, req, tripId) {
    try {
      const request = await models.Request.findById(requestId);
      const user = await models.User.findOne({
        where: { userId: request.userId }
      });
      const theRecipients = await TripUtils.getRecipients(req);

      const recipients = theRecipients.map(theRecipient => ({
        email: theRecipient.email,
        name: theRecipient.fullName
      }));
      const { recipientVars } = await NotificationEngine.getReciepientVariables(recipients);

      const sender = user.fullName;
      const topic = 'Guesthouse Check In';
      const type = 'Guesthouse Check-In';
      const mailData = await TripUtils.getCheckInMailData(
        tripId, recipients, sender, topic, type, recipientVars
      );
      NotificationEngine.sendMailToMany(mailData);
    } catch (error) { /* istanbul ignore next */ }
  }

  static getSurveyMailData(recipient, sender, topic, type) {
    const mailBody = {
      recipient,
      sender,
      topic,
      type,
      redirectLink: process.env.SURVEY_URL,
    };
    return mailBody;
  }

  static async updateCheckStatus(req, res) {
    const { tripId } = req.params;
    const { checkType } = req.body;
    const userId = req.user.UserInfo.id;
    const where = TripsController.createWhereClause(tripId, checkType);
    try {
      const returnedTrip = await getReturnedTrip(where, userId);
      if (!returnedTrip) {
        return res.status(400).json({
          success: false,
          message: checkTypeErrorMessage
        });
      }
      const checkInDate = returnedTrip.departureDate;
      const dateToday = (new Date().toISOString()).slice(0, 10);
      if (dateToday < checkInDate) {
        return res.status(400).json({
          success: false,
          message: `Please try checking in on ${new Date(checkInDate).toDateString()}`
        });
      }
      const updatedTrip = await TripsController
        .updateTrip(returnedTrip, checkType);
      TripsController.sendNotification(req, updatedTrip.request, checkType);
      TripsController.sendMailToTravelAdmin(returnedTrip.requestId, req, tripId);
      if (checkType === 'checkOut') {
        TripsController.sendSurveyEmail(returnedTrip.requestId);
      }
      return res.status(200).json({
        success: true,
        trip: updatedTrip,
        message: 'Updated Successfully'
      });
    } catch (error) { /* istanbul ignore next */
      return Error.handleError(error.toString(), 500, res);
    }
  }

  static async getTrips(req, res) {
    const userId = req.user.UserInfo.id;
    const trips = await models.Trip.findAll({
      include: [{
        required: true,
        model: models.Request,
        as: 'request',
        where: {
          status: 'Verified',
          userId
        },
      }, {
        required: true,
        model: models.Bed,
        as: 'beds',
        include: [{
          required: true,
          model: models.Room,
          as: 'rooms',
          include: [{
            required: true,
            model: models.GuestHouse,
            as: 'guestHouses',
          }]
        }]
      }],
      orderBy: ['id', 'ASC']
    });
    const message = (trips.length === 0) ? 'You have no trips at the moment'
      : 'Retrieved Successfully';
    return res.status(200).json({
      success: true,
      trips,
      message,
    });
  }

  static async updateTripRoom(req, res) {
    const { tripId } = req.params;
    const { bedId, reason } = req.body;
    const updatedBedId = bedId > 0 ? bedId : null;
    const userId = req.user.UserInfo.id;
    try {
      const trip = await models.Trip.findById(tripId);
      const request = await models.Request.findById(trip.requestId);
      const user = await models.User.findOne({
        where: { userId: request.userId }
      });
      const changedRoom = {
        requestId: trip.requestId,
        tripId: trip.id,
        bedId: updatedBedId,
        reason,
        userId
      };
      trip.bedId = updatedBedId;
      await trip.save();
      await models.ChangedRoom.create(changedRoom);
      const message = 'updated your travel residence record.';
      TripsController.sendNotificationToRequester(
        user, request, message, req.user.UserInfo
      );
      return res.status(200).json({
        success: true,
        trip,
        message: 'Updated Successfully'
      });
    } catch (error) { /* istanbul ignore next */
      return Error.handleError(error.toString(), 500, res);
    }
  }

  static async sendNotificationToRequester(
    user, request, message, travelAdmin
  ) {
    const notificationData = {
      senderId: travelAdmin.id,
      recipientId: user.userId,
      notificationType: 'general',
      message,
      notificationLink: `/requests/${request.id}`,
      senderName: travelAdmin.name,
      senderImage: travelAdmin.picture,
    };
    NotificationEngine.notify(notificationData);
    const mailData = TripUtils.getMailData(request, user,
      'Travel Request Residence', 'Changed Room', travelAdmin);
    NotificationEngine.sendMail(mailData);
  }

  static async getTripsByRequestId(requestId, res) {
    try {
      const trips = await models.Trip.findAll({ where: { requestId } });
      return trips;
    } catch (error) { /* istanbul ignore next */
      return Error.handleError(error.toString(), 500, res);
    }
  }
}

export default TripsController;
