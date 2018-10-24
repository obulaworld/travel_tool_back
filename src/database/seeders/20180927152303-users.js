module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert(
      /* eslint-disable-line */
    'Users',
    [
      {
        id: 1099,
        fullName: 'Loice Meyo',
        email: 'loice.meyo@andela.com',
        userId: '-LMgZQKq6MXAj_41iRWi',
        passportName: 'Loice Meyo',
        department: 'Success',
        occupation: 'software developer',
        manager: 'Samuel Kubai',
        gender: 'female',
        location: 'Lagos',
        createdAt: '2018-08-16 012:11:52.181+01',
        updatedAt: '2018-08-16 012:11:52.181+01',
      }
    ],
    {},
  ),

  down: (
    queryInterface,
    Sequelize, //eslint-disable-line
  ) => queryInterface.bulkDelete('Users', null, {}),
};
