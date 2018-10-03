import models from '../../database/models';
import NotificationEngine from '../notifications/NotificationEngine';
import Error from '../../helpers/Error';

let checkTypeErrorMessage = '';
class TripsController {
  static createWhereClause(tripId) {
    const where = {
      id: tripId,
      checkInDate: null,
    };
    checkTypeErrorMessage = 'User has already checked in';
    return where;
  }

  static async updateTrip(trip) {
    const tripModel = trip;
    tripModel.checkInDate = new Date();
    tripModel.checkStatus = 'Checked In';
    await tripModel.save();
    return tripModel;
  }

  static async sendNotification(req, request) {
    const message = 'You just checked in to your guest house';
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

  static async updateCheckStatus(req, res) {
    const { tripId } = req.params;
    const userId = req.user.UserInfo.id;
    const where = TripsController.createWhereClause(tripId);
    try {
      const returnedTrip = await models.Trip.findOne({
        where,
        include: [{
          required: true,
          model: models.Request,
          as: 'request',
          where: {
            status: 'Approved',
            userId,
          },
        }]
      });
      if (!returnedTrip) {
        return res.status(400).json({
          success: false,
          message: checkTypeErrorMessage
        });
      }
      const updatedTrip = await TripsController
        .updateTrip(returnedTrip);
      TripsController.sendNotification(req, updatedTrip.request);
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
          status: 'Approved',
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
}

export default TripsController;
