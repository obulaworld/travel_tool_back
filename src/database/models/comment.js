module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    comment: {
      type: DataTypes.TEXT,
    },
    isEdited: {
      type: DataTypes.BOOLEAN,
    },
  }, { paranoid: true });

  Comment.associate = (models) => {
    Comment.belongsTo(models.Request, {
      foreignKey: 'requestId',
      as: 'comments',
    });
    Comment.belongsTo(models.TravelReadinessDocuments, {
      foreignKey: 'documentId',
    });
    Comment.belongsTo(models.User, {
      foreignKey: 'userId',
    });
  };
  return Comment;
};
