export default (sequelize, DataTypes) => {
  const Request = sequelize.define('Request', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Name cannot be empty',
        },
      },
    },
    origin: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Origin cannot be empty',
        },
      },
    },
    destination: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Destination cannot be empty',
        },
      },
    },
    manager: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        is: ['^[a-zA-Z0-9_ ]*$'],
      },
    },
    gender: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Gender cannot be empty',
        },
      },
    },
    department: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Department cannot be empty',
        },
      },
    },
    role: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Role cannot be empty',
        },
      },
    },
    status: {
      allowNull: false,
      type: DataTypes.STRING,
      defaultValue: 'Open',
      validate: {
        notEmpty: {
          args: true,
          msg: 'Status cannot be empty',
        },
      },
    },
    userId: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'User ID cannot be empty',
        },
      },
    },
    departureDate: {
      allowNull: false,
      type: DataTypes.DATEONLY,
    },
    arrivalDate: {
      allowNull: false,
      type: DataTypes.DATEONLY,
    },
    tripType: {
      allowNull: false,
      type: DataTypes.ENUM,
      values: ['return', 'oneWay', 'multi']
    },
  });

  Request.associate = (models) => {
    Request.hasMany(models.Comment, {
      foreignKey: 'requestId',
      as: 'comments',
    });

    Request.hasMany(models.Trip, {
      foreignKey: 'requestId',
      as: 'trips'
    });
  };
  return Request;
};
