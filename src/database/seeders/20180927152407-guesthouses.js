module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert(
      /* eslint-disable-line */
    'GuestHouses',
    [
      {
        id: '10948',
        houseName: 'Guest House B',
        location: 'Nairobi',
        bathRooms: 3,
        imageUrl: 'guest.com',
        userId: '-LMgZQKq6MXAj_41iRWi',
        createdAt: '2018-08-16 012:11:52.181+01',
        updatedAt: '2018-08-16 012:11:52.181+01',
      }
    ],
    {},
  ),

  down: (
    queryInterface,
    Sequelize, //eslint-disable-line
  ) => queryInterface.bulkDelete('GuestHouses', null, {}),
};
