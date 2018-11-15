module.exports = {
  up: (queryInterface, Sequelize) => queryInterface
    .createTable('ChecklistSubmissions', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      value: {
        type: Sequelize.TEXT
      },
      tripId: {
        type: Sequelize.STRING
      },
      checklistItemId: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    }),
  down: queryInterface => queryInterface.dropTable('ChecklistSubmissions')
};
