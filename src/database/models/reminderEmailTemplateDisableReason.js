module.exports = (sequelize, DataTypes) => {
  const ReminderEmailTemplateDisableReason = sequelize.define('ReminderEmailTemplateDisableReason',
    {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
      },
      reason: {
        allowNull: false,
        type: DataTypes.STRING
      },
    }, { paranoid: true });
  ReminderEmailTemplateDisableReason.associate = (models) => {
    ReminderEmailTemplateDisableReason.belongsTo(models.ReminderEmailTemplate, {
      foreignKey: 'reminderEmailTemplateId',
      as: 'reminderEmailTemplate'
    });
  };
  return ReminderEmailTemplateDisableReason;
};
