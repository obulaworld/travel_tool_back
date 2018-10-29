import models from '../../database/models';
import Error from '../../helpers/Error';
import responses from '../userRole/UserRoleController';

class CentersController {
  static async createCenter(req, res) {
    try {
      const { newLocation } = req.body;
      const newCentre = await models.Center.create({ location: newLocation });
      return res.status(201).json({
        success: true,
        message: 'Successfully created a new centre',
        center: newCentre
      });
    } catch (error) {
      /* istanbul ignore next */
      Error.handleError('Server error', 500, res);
    }
  }

  static async getCenters(req, res) {
    try {
      const centers = await models.Center.findAll({});
      return res.status(200).json({
        success: true,
        message: 'Centres retrieved successfully',
        centers
      });
    } catch (error) {
      /* istanbul ignore next */
      Error.handleError(error, 500, res);
    }
  }

  static async changeCenter(req, res) {
    try {
      const updateRole = await models.UserRole.update(
        { centerId: req.centerId },
        {
          returning: true,
          where: {
            userId: req.params.id,
            roleId: 339458
          }
        }
      );
      const message = [200, 'Center updated successfully', true];
      const message2 = [
        404,
        `The user with the id ${
          req.params.id
        } does not have a travel team member role`,
        false
      ];
      return updateRole[0] === 1
        ? responses.response(res, message, updateRole)
        : responses.response(res, message2);
    } catch (error) {
      /* istanbul ignore next */
      return Error.handleError(error, 500, res);
    }
  }
}

export default CentersController;
