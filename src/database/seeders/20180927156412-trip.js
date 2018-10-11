module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert(
      /* eslint-disable-line */
    'Trips',
    [
      {
        id: '10948',
        origin: 'Kampala',
        destination: 'Nairobi',
        bedId: 10945,
        returnDate: '2018-10-16',
        departureDate: '2018-09-16',
        requestId: '3456',
        createdAt: '2018-08-16 012:11:52.181+01',
        updatedAt: '2018-08-16 012:11:52.181+01',
      }
    ],
    {},
  ),

  down: (
    queryInterface,
    Sequelize, //eslint-disable-line
  ) => queryInterface.bulkDelete('Trips', null, {}),
};
