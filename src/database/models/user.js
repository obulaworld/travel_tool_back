export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      fullName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      userId: {
        allowNull: false,
        type: DataTypes.STRING
      },
      passportName: {
        allowNull: true,
        type: DataTypes.STRING
      },
      department: {
        allowNull: true,
        type: DataTypes.STRING
      },
      occupation: {
        allowNull: true,
        type: DataTypes.STRING
      },
      manager: {
        allowNull: true,
        type: DataTypes.STRING
      },
      gender: {
        allowNull: true,
        type: DataTypes.STRING
      }
    },
    {}
  );
  User.associate = (models) => {
    User.belongsTo(models.Role, {
      foreignKey: 'roleId',
      as: 'roles'
    });
  };
  return User;
};
