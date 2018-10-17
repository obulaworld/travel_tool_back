import models from '../../database/models';
import Error from '../../helpers/Error';

class CentersController {
  static async getCenters(req, res) {
    try {
      const centers = await models.Center.findAll({});
      return res.status(200).json({
        success: true,
        message: 'Centres retrieved successfully',
        centers
      });
    } catch (error) { /* istanbul ignore next */
      Error.handleError(error, 500, res);
    }
  }
}

export default CentersController;
