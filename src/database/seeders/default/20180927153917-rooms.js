module.exports = {
  // eslint-disable-next-line
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert(
      /* eslint-disable-line */
    'Rooms',
    [
      {
        id: '10946',
        roomName: 'Nyati',
        roomType: 'ensuite',
        bedCount: 2,
        faulty: 'false',
        guestHouseId: '10948',
        createdAt: '2018-08-16 012:11:52.181+01',
        updatedAt: '2018-08-16 012:11:52.181+01',
      }
    ],
    {},
  ),

  down: (
    queryInterface,
    Sequelize, //eslint-disable-line
  ) => queryInterface.bulkDelete('Rooms', null, {}),
};
