import dotenv from 'dotenv';
import { Op } from 'sequelize';
import models from '../../database/models';

dotenv.config();

class UserRoleController {
  static response(res, message, result) {
    return res.status(message[0]).json({
      success: message[2],
      message: message[1],
      result,
    });
  }

  static async getAllUser(req, res) {
    const result = await models.User.all();
    const message = [200, 'data', true];
    UserRoleController.response(res, message, result);
  }

  static async getOneUser(req, res) {
    const result = await models.User.findOne({
      where: {
        userId: req.params.id,
      },
      include: [
        {
          model: models.Role,
          as: 'roles',
          attributes: ['roleName', 'description'],
        },
      ],
    });
    const message = [200, 'data', true];
    UserRoleController.response(res, message, result);
  }

  static async updateUserProfile(req, res) {
    const user = await models.User.findOne({
      where: {
        userId: req.params.id,
      }
    });
    if (!user) {
      const message = [400, 'User does not exist', false];
      return UserRoleController.response(res, message);
    }
    const result = await user.update({
      passportName: req.body.passportName || user.passportName,
      department: req.body.department || user.department,
      occupation: req.body.occupation || user.occupation,
      manager: req.body.manager || user.manager,
      gender: req.body.gender || user.gender,
    });
    const message = [201, 'Profile updated successfully', true];
    UserRoleController.response(res, message, result);
  }

  static async addUser(req, res) {
    const { fullName, email, userId } = req.body;
    if (!userId) {
      const message = [400, 'User Id required', false];
      return UserRoleController.response(res, message);
    }
    const result = await models.User.findOrCreate({
      where: {
        fullName,
        email,
        userId,
      },
    });
    const message = [201, 'User created successfully', true];
    UserRoleController.response(res, message, result);
  }

  static async updateUserRole(req, res) {
    try {
      const { roleName, email } = req.body;
      const findRole = await models.Role.findOne({
        where: {
          roleName: { [Op.iLike]: roleName },
        },
      });
      if (!findRole) {
        const message = [400, 'Role does not exist', false];
        UserRoleController.response(res, message);
      } else {
        const findUser = await models.User.findOne({
          where: { email },
        });
        const result = await findUser.update({
          roleId: findRole.id,
        });
        const message = [200, 'Role updated successfully', true];
        UserRoleController.response(res, message, result);
      }
    } catch (error) {
      const message = [400, 'Email does not exist', false];
      UserRoleController.response(res, message);
    }
  }

  static async addRole(req, res) {
    try {
      const result = await models.Role.create(req.body);
      const message = [201, 'Role created successfully', true];
      UserRoleController.response(res, message, result);
    } catch (error) {
      const message = [409, 'Role already exist', false];
      UserRoleController.response(res, message, error);
    }
  }

  static async getRoles(req, res) {
    const result = await models.Role.findAll({
      include: [
        {
          model: models.User,
          as: 'users',
          attributes: ['email'],
        },
      ],
    });
    const message = [200, 'data', true];
    UserRoleController.response(res, message, result);
  }

  static async getOneRole(req, res) {
    try {
      const result = await models.Role.findById(req.params.id, {
        include: [
          {
            model: models.User,
            as: 'users',
            attributes: ['email', 'fullName', 'userId'],
          },
        ],
      });
      const message = [200, 'data', true];
      UserRoleController.response(res, message, result);
    } catch (error) {
      const message = [400, 'Params must be an integer', false];
      UserRoleController.response(res, message);
    }
  }

  static async autoAdmin(req, res) {
    try {
      const findUser = await models.User.findOne({
        where: {
          email: req.user.UserInfo.email,
        },
      });
      if (findUser.email !== process.env.DEFAULT_ADMIN) {
        const message = [409, 'Email does not match', false];
        UserRoleController.response(res, message);
      } else {
        await findUser.update({ roleId: 10948 });
        const message = [
          200,
          'Your role has been Updated to a Super Admin',
          true,
        ];
        UserRoleController.response(res, message);
      }
    } catch (error) {
      const message = [400, 'Email does not exist in Database', false];
      UserRoleController.response(res, message);
    }
  }

  static async isAdmin(req, res, next) {
    try {
      const findAdmin = await models.User.findOne({
        where: { email: req.user.UserInfo.email },
        include: [
          {
            model: models.Role,
            as: 'roles',
            attributes: ['roleName'],
          },
        ],
      });
      if (findAdmin.roles.roleName === 'Super Administrator') {
        next();
      } else {
        const message = [400, 'Only a Super admin can do that', false];
        UserRoleController.response(res, message, findAdmin.roles.roleName);
      }
    } catch (error) {
      const message = [
        400,
        'Logged in user Email does not exist in Database',
        false,
      ];
      UserRoleController.response(res, message);
    }
  }

  static async getRecipient(recipientName, recipientId) {
    const recipient = await models.User.findOne({
      where: {
        $or: [
          {
            fullName: recipientName
          },
          {
            userId: recipientId
          },
        ]
      }
    });
    return recipient;
  }
}

export default UserRoleController;
