export default (sequelize, DataTypes) => {
  const ReminderEmailTemplate = sequelize.define('ReminderEmailTemplate', {
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

  ReminderEmailTemplate.associate = (models) => {
    ReminderEmailTemplate.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'reminderEmailTemplate'
    });
    ReminderEmailTemplate.hasMany(models.Reminder, {
      foreignKey: 'reminderEmailTemplateId',
    });
  };
  return ReminderEmailTemplate;
};
