import models from '../database/models';
import CustomError from '../helpers/Error';

class ChecklistValidator {
  static validateSubmission(req, res, next) {
    const { tripId, file } = req.body;
    let error;
    error = !tripId ? 'tripId is required' : error;
    error = !file ? 'file is required' : error;
    error = (!tripId && !file) ? 'tripId and file are required' : error;
  
    if (error) return CustomError.handleError(error, 400, res);
    next();
  }

  static async validateTrip(req, res, next) {
    try {
      const { requestId, checklistItemId } = req.params;
      const { tripId } = req.body;
      const userId = req.user.UserInfo.id;
      const trip = await models.Trip.findOne({
        where: { id: tripId },
        include: [{
          required: true,
          model: models.Request,
          as: 'request',
          where: { userId, id: requestId },
        }]
      });

      if (!trip) {
        const msg = 'The trip does not exist for this request or user';
        return CustomError.handleError(msg, 404, res);
      }
      const { request: { status }, destination } = trip;
      if (!status.match('Approved')) {
        const msg = 'The request for this trip have not been approved';
        return CustomError.handleError(msg, 400, res);
      }

      const checklistItem = await ChecklistValidator
        .getChecklistItem(checklistItemId, destination, res);

      if (!checklistItem) {
        const msg = 'This checklist Item does not exist for this destination';
        return CustomError.handleError(msg, 404, res);
      }
      next();
    } catch (error) { /* istanbul ignore next */
      return CustomError.handleError('Server Error', 500, res);
    }
  }

  static async getChecklistItem(checklistItemId, tripDestination, res) {
    try {
      const checklistItem = await models.ChecklistItem.findOne({
        where: {
          id: checklistItemId, destinationName: [tripDestination, 'Default']
        }
      });
      return checklistItem;
    } catch (error) { /* istanbul ignore next */
      return CustomError.handleError('Server Error', 500, res);
    }
  }
}

export default ChecklistValidator;
