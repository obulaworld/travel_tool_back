import models from '../../database/models';
import CustomError from '../../helpers/Error';

export default class TravelReasonsController {
  static async createTravelReason(req, res) {
    try {
      const { id, title, description } = req.body;

      const lowerCaseTitle = title.toLowerCase();
      const newReason = await models.TravelReason.create({
        title: lowerCaseTitle,
        description,
        createdBy: id
      });

      if (newReason) {
        return res.status(201).json({
          success: true,
          message: 'Successfully created a travel reason',
          travelReason: newReason
        });
      }
    } catch (error) {
    /* istanbul ignore next */
      CustomError.handleError(error.message, 500, res);
    }
  }
}
