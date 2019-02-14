import models from '../../database/models';
import CustomError from '../../helpers/Error';

export default class TravelStipendController {
  static async createTravelStipend(req, res) {
    try {
      const { stipend, center } = req.body;
      const { UserInfo: { id: createdBy } } = req.user;
      const { id: centerId, dataValues: { location } } = await models.Center.find({
        where: {
          location: center
        }
      });
      const newStipend = await models.TravelStipends.create(
        {
          amount: stipend,
          centerId,
          createdBy
        }
      );
      return res.status(201).json({
        success: true,
        message: `Successfully created a new travel stipend for ${location}`,
        stipend: newStipend
      });
    } catch (error) { /* istanbul ignore next */
      CustomError.handleError(error.message, 500, res);
    }
  }
}
