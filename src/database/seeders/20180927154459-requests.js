module.exports = {
  // eslint-disable-next-line
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert(
      /* eslint-disable-line */
    'Requests',
    [
      {
        id: '3456',
        name: 'Return Trip',
        tripType: 'return',
        manager: 'Samuel Kubai',
        gender: 'female',
        department: 'guest01',
        role: 'Software Developer',
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
  ) => queryInterface.bulkDelete('Requests', null, {}),
};
