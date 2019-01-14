module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'Comments', 'userId',
    {
      type: Sequelize.STRING,
      onDelete: 'set null',
      allowNull: false,
      references: {
        model: 'Users',
        key: 'userId',
        as: 'users',
      },
    }
  ),
  down: queryInterface => queryInterface.removeColumn('Comments', 'userId')
};
