import models from '../../database/models';
import NotificationEngine from '../notifications/NotificationEngine';
import Error from '../../helpers/Error';

const { Op } = models.Sequelize;
let checkTypeErrorMessage = '';
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

  static async updateCheckStatus(req, res) {
    const { tripId } = req.params;
    const { checkType } = req.body;
    const userId = req.user.UserInfo.id;
    const where = TripsController.createWhereClause(tripId, checkType);
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
        .updateTrip(returnedTrip, checkType);
      TripsController.sendNotification(req, updatedTrip.request, checkType);
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
