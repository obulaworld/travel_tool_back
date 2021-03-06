module.exports = (sequelize, DataTypes) => {
  const TravelStipends = sequelize.define('TravelStipends',
    {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
      },
      amount: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      createdBy: {
        type: DataTypes.STRING
      },
      deletedAt: {
        type: DataTypes.DATE
      }
    }, { paranoid: true });
  TravelStipends.associate = (models) => {
    TravelStipends.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'creator',
      targetKey: 'userId'
    });
    TravelStipends.belongsTo(models.Center, {
      foreignKey: 'centerId',
      as: 'center',
      targetKey: 'id'
    });
  };
  return TravelStipends;
};
