export default (sequelize, DataTypes) => {
  const ReminderEmailTemplates = sequelize.define('ReminderEmailTemplates', {
    id: {
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Name cannot be empty'
        }
      }
    },
    from: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Sender email cannot be empty'
        }
      }
    },
    cc: {
      allowNull: true,
      type: DataTypes.STRING
    },
    subject: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Email subject cannot be empty'
        }
      }
    },
    message: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Email message cannot be empty'
        }
      }
    },
  }, { paranoid: true });

  ReminderEmailTemplates.associate = (models) => {
    ReminderEmailTemplates.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'reminderEmailTemplates'
    });
  };
  return ReminderEmailTemplates;
};
