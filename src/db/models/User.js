// the user model

const createUserModel = (dbConnection, Sequelize) => {
  const User = dbConnection.define('users', {
    firstName: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
      validate: {
        is: {
          args: /^[\w.]+@andela.com$/i,
          msg: 'The email provided should be an Andela email',
        },
      },
    },
  });

  return User;
};

export default createUserModel;
