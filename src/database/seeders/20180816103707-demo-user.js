module.exports = {
  up: queryInterface => queryInterface.bulkInsert('Users',
    [
      {
        id: 1000,
        fullName: 'John Mutuma',
        email: 'john.mutuma@andela.com',
        createdAt: '2018-08-16 012:11:52.181+01',
        updatedAt: '2018-08-16 012:11:52.181+01',
        userId: '-LJV4b1QTCYewOtk5F63',
        gender: 'male',
        location: 'Nairobi'
      }
    ], {}),

  down: queryInterface => queryInterface.bulkDelete('Users', null, {})
};
