export default (sequelize, DataTypes) => {
  const Condition = sequelize.define(
    'Condition', {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      conditionName: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            args: true,
            msg: 'Condition name cannot be empty'
          }
        }
      },
      documentType: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            args: true,
            msg: 'Document type cannot be empty'
          }
        }
      }
    }, {}
  );

  Condition.associate = (models) => {
    Condition.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });

    Condition.hasMany(models.Reminder, {
      foreignKey: 'conditionId',
      as: 'reminders',
    });
  };

  return Condition;
};
