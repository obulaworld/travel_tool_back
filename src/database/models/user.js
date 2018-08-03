'use strict';
export default (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        is: {
          args: /^[\w.]+@andela.com$/i,
          msg: 'The email provided should be an Andela email',
        },
      },
    },
  }, {
    tableName:'users'
  });
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};