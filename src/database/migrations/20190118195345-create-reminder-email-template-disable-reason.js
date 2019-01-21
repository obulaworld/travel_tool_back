module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('ReminderEmailTemplateDisableReasons', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    reason: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    reminderEmailTemplateId: {
      type: Sequelize.INTEGER,
      onDelete: 'CASCADE',
      allowNull: false,
      references: {
        model: 'ReminderEmailTemplates',
        key: 'id',
        as: 'reminderEmailTemplate',
      },
    },
  }),
  down: queryInterface => queryInterface.dropTable('ReminderEmailTemplateDisableReasons')
};
