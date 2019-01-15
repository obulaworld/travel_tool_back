export default (sequelize, DataTypes) => {
  const TravelReadinessDocuments = sequelize.define(
    'TravelReadinessDocuments', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING,
      },
      type: {
        allowNull: false,
        type: DataTypes.STRING
      },
      data: {
        type: DataTypes.JSONB
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    }, {}
  );
  TravelReadinessDocuments.associate = (models) => {
    // associations can be defined here
    TravelReadinessDocuments.belongsTo(models.User, {
      foreignKey: 'userId'
    });
    TravelReadinessDocuments.hasMany(models.Comment, {
      foreignKey: 'documentId',
      as: 'comments',
    });
  };
  return TravelReadinessDocuments;
};
