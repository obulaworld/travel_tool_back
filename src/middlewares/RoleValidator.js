import { Op } from 'sequelize';
import models from '../database/models';
import Error from '../helpers/Error';
import Validator from './Validator';

export default class RoleValidator {
  static validateUpdateRole(req, res, next) {
    req.checkBody('email').isEmail()
      .withMessage('Please provide a valid email');
    req.checkBody('roleName', 'roleName is required').notEmpty();
    req.checkBody('center', 'center cannot be empty').optional().notEmpty();
    const errors = req.validationErrors();
    Validator.errorHandler(res, errors, next);
  }

  static validateAddRole(req, res, next) {
    Validator.validateUserRoleCheck(req, res, next, 'roleName', 'description');
  }

  static checkUserRole(allowedRoles) {
    return async (req, res, next) => {
      const emailAddress = req.user.UserInfo.email;
      try {
        const userRole = await models.User.findOne({
          where: {
            email: emailAddress
          },
          include: [
            {
              model: models.Role,
              as: 'roles',
              attributes: ['roleName'],
              through: { attributes: [] }
            },
          ],
        });
        // Check whether user has any of the allowedRoles
        const hasPermission = userRole.roles.some(role => allowedRoles
          .includes(role.roleName));
        if (!hasPermission) {
          const error = 'You don\'t have access to perform this action';
          return Error.handleError(error, 403, res);
        }
        req.user.roles = userRole.dataValues.roles;
        next();
      } catch (error) {
        res.status(400).json({
          success: false,
          message: 'You are not signed in to the application'
        });
      }
    };
  }

  static async roleExists(req, res, next) {
    const { roleName } = req.body;
    const findRole = await models.Role.findOne({
      where: {
        roleName: { [Op.iLike]: roleName },
      },
    });
    if (!findRole) {
      const error = 'Role does not exist';
      return Error.handleError(error, 404, res);
    }
    req.roleId = findRole.id;
    next();
  }


  static validateRoleAssignment(req, res, next) {
    const isSuperAdmin = req.user.roles
      .some(role => role.roleName === 'Super Administrator');
    if (!isSuperAdmin && req.body.roleName.toLowerCase()
      !== 'travel team member') {
      const error = 'Only a Super Admin can assign that role';
      return Error.handleError(error, 403, res);
    }
    next();
  }

  static validateUpdateCenterBody(req, res, next) {
    req.checkBody('center', 'Center name is required').notEmpty();
    const errors = req.validationErrors();
    Validator.errorHandler(res, errors, next);
  }

  static validateUpdateCenter(req, res, next) {
    if (Number.isNaN(parseInt(req.params.id, 10))) {
      return res.status(400).json({
        message: 'Only Number allowed for id'
      });
    }
    next();
  }
}
