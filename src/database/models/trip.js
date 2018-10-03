export default (sequelize, DataTypes) => {
  const Trip = sequelize.define('Trip', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING,
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
    departureDate: {
      allowNull: false,
      type: DataTypes.DATEONLY,
    },
    returnDate: {
      allowNull: true,
      type: DataTypes.DATEONLY,
    },
  });
  Trip.associate = (models) => {
    Trip.belongsTo(models.Bed, {
      foreignKey: 'bedId',
      as: 'beds'
    });
    Trip.belongsTo(models.Request, {
      foreignKey: 'requestId',
      as: 'request',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };
  return Trip;
};
