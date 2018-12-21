module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'Trips', 'accommodationType',
    {
      type: Sequelize.ENUM('Residence', 'Hotel Booking', 'Not Required'),
      allowNull: true,
      defaultValue: 'Residence'
    }
  ),

  down: queryInterface => queryInterface.removeColumn('Trips', 'accommodationType')
};
