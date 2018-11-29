import models from '../database/models';

class GuestHouseValidator {
  static async checkRoom(req, res, next) {
    const room = await models.Room.findOne({
      where: {
        id: req.params.id
      }
    });
    if (!room) {
      return res.status(404).send({
        success: false,
        message: 'The room does not exist'
      });
    }
    next();
  }

  static async checkMaintenanceRecord(req, res, next) {
    const maintenanceRecord = await models.Maintainance.findOne({
      where: {
        roomId: req.params.id
      }
    });
    if (!maintenanceRecord) {
      return res.status(404).json({
        success: false,
        message: 'The maintenance record does not exist'
      });
    }
    next();
  }
}

export default GuestHouseValidator;
