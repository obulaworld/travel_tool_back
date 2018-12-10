module.exports = {
  // eslint-disable-next-line
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert(
      /* eslint-disable-line */
    'Users',
    [
      {
        id: 1098,
        fullName: 'Mr White',
        email: 'mr.white@andela.com',
        userId: '-LMgZQKloMXAj_41iRWi',
        passportName: 'Mr White',
        department: 'Success',
        occupation: 'software developer',
        manager: 'Samuel Kubai',
        gender: 'male',
        location: 'Lagos',
        createdAt: '2018-08-15 012:11:53.181+01',
        updatedAt: '2018-08-15 012:11:53.181+01',
      }
    ],
    {},
  ),

  down: (
    queryInterface,
    Sequelize, //eslint-disable-line
  ) => queryInterface.bulkDelete('Users', null, {}),
};
