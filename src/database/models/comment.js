module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    comment: {
      type: DataTypes.TEXT,
    },
    userName: {
      type: DataTypes.STRING,
    },
    userEmail: {
      type: DataTypes.STRING,
    },
    picture: {
      type: DataTypes.STRING,
    },
  });

  Comment.associate = (models) => {
    Comment.belongsTo(models.Request, {
      foreignKey: 'requestId',
      as: 'comments',
    });
  };
  return Comment;
};
