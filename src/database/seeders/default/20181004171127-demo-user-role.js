module.exports = {
  up: queryInterface => queryInterface.bulkInsert('UserRoles',
    [
      {
        createdAt: '2018-08-16 012:11:52.181+01',
        updatedAt: '2018-08-16 012:11:52.181+01',
        userId: 1000,
        roleId: '10948',
      }
    ], {}),

  down: queryInterface => queryInterface.bulkDelete('UserRoles', null, {})
};
