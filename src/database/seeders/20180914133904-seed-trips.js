module.exports = {
  up: (queryInterface, Sequelize) => { // eslint-disable-line
    return queryInterface.bulkInsert('Trips', [
      {
        requestId: 'xDh20cuGz',
        origin: 'Nairobi',
        destination: 'Lagos',
        departureDate: '2018-08-16 012:11:52.181+01',
        returnDate: '2018-08-16 012:11:52.181+01',
        createdAt: '2018-08-16 012:11:52.181+01',
        updatedAt: '2018-08-16 012:11:52.181+01',
      },
      {
        requestId: 'xDh20cuGy',
        origin: 'Nairobi',
        destination: 'Lagos',
        departureDate: '2018-08-16 012:11:52.181+01',
        returnDate: '2018-08-16 012:11:52.181+01',
        createdAt: '2018-08-16 012:11:52.181+01',
        updatedAt: '2018-08-16 012:11:52.181+01',
      },
      {
        requestId: 'xDh20cuGx',
        origin: 'Nairobi',
        destination: 'Lagos',
        departureDate: '2018-08-16 012:11:52.181+01',
        returnDate: '2018-08-16 012:11:52.181+01',
        createdAt: '2018-08-16 012:11:52.181+01',
        updatedAt: '2018-08-16 012:11:52.181+01',
      },
      {
        requestId: 'xDh20btGz',
        origin: 'Nairobi',
        destination: 'Lagos',
        departureDate: '2018-08-16 012:11:52.181+01',
        returnDate: '2018-08-16 012:11:52.181+01',
        createdAt: '2018-08-16 012:11:52.181+01',
        updatedAt: '2018-08-16 012:11:52.181+01',
      },
      {
        requestId: 'xDh20irtGy',
        origin: 'Nairobi',
        destination: 'Lagos',
        departureDate: '2018-08-16 012:11:52.181+01',
        returnDate: '2018-08-16 012:11:52.181+01',
        createdAt: '2018-08-16 012:11:52.181+01',
        updatedAt: '2018-08-16 012:11:52.181+01',
      },
      {
        requestId: 'xDh20mytx',
        origin: 'Nairobi',
        destination: 'Lagos',
        departureDate: '2018-08-16 012:11:52.181+01',
        returnDate: '2018-08-16 012:11:52.181+01',
        createdAt: '2018-08-16 012:11:52.181+01',
        updatedAt: '2018-08-16 012:11:52.181+01',
      },
      {
        requestId: 'xDh26btGz',
        origin: 'Nairobi',
        destination: 'Lagos',
        departureDate: '2018-08-16 012:11:52.181+01',
        returnDate: '2018-08-16 012:11:52.181+01',
        createdAt: '2018-08-16 012:11:52.181+01',
        updatedAt: '2018-08-16 012:11:52.181+01',
      },
      {
        requestId: 'xDh27irtGy',
        origin: 'Nairobi',
        destination: 'Lagos',
        departureDate: '2018-08-16 012:11:52.181+01',
        returnDate: '2018-08-16 012:11:52.181+01',
        createdAt: '2018-08-16 012:11:52.181+01',
        updatedAt: '2018-08-16 012:11:52.181+01',
      },
      {
        requestId: 'xDh43mytx',
        origin: 'Nairobi',
        destination: 'Lagos',
        departureDate: '2018-08-16 012:11:52.181+01',
        returnDate: '2018-08-16 012:11:52.181+01',
        createdAt: '2018-08-16 012:11:52.181+01',
        updatedAt: '2018-08-16 012:11:52.181+01',
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => { // eslint-disable-line
    return queryInterface.bulkDelete('Person', null, {});
  }
};
