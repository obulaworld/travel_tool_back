module.exports = (sequelize, DataTypes) => {
  const Maintainance = sequelize.define('Maintainance', {
    reason: {
      type: DataTypes.TEXT,
    },
    start: {
      allowNull: false,
      type: DataTypes.DATEONLY,
    },
    end: {
      allowNull: false,
      type: DataTypes.DATEONLY,
    },
  });
  Maintainance.associate = (models) => {
    Maintainance.belongsTo(models.Room, {
      foreignKey: 'roomId',
      as: 'maintainances',
    });
  };
  return Maintainance;
};