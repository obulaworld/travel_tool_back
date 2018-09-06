module.exports = {
  up: (queryInterface, Sequelize) => { // eslint-disable-line
    return queryInterface.bulkInsert('Approvals', [
      {
        requestId: 'xDh20cuGz',
        status: 'Open',
        approverId: '-LJV4b1QTCYewOtk5F63',
        createdAt: '2018-08-16 012:11:52.181+01',
        updatedAt: '2018-08-16 012:11:52.181+01',
      },
      {
        requestId: 'xDh20cuGy',
        status: 'Approved',
        approverId: '-LJV4b1QTCYewOtk5F63',
        createdAt: '2018-08-16 012:11:52.181+01',
        updatedAt: '2018-08-16 012:11:52.181+01',
      },
      {
        requestId: 'xDh20cuGx',
        status: 'Approved',
        approverId: '-LJV4b1QTCYewOtk5F63',
        createdAt: '2018-08-16 012:11:52.181+01',
        updatedAt: '2018-08-16 012:11:52.181+01',
      },
      {
        requestId: 'xDh20btGz',
        status: 'Rejected',
        approverId: '-LJV4b1QTCYewOtk5F63',
        createdAt: '2018-08-16 012:11:52.181+01',
        updatedAt: '2018-08-16 012:11:52.181+01',
      },
      {
        requestId: 'xDh20irtGy',
        status: 'Approved',
        approverId: '-LJV4b1QTCYewOtk5F63',
        createdAt: '2018-08-16 012:11:52.181+01',
        updatedAt: '2018-08-16 012:11:52.181+01',
      },
      {
        requestId: 'xDh20mytx',
        status: 'Rejected',
        approverId: '-LJV4b1QTCYewOtk5F63',
        createdAt: '2018-08-16 012:11:52.181+01',
        updatedAt: '2018-08-16 012:11:52.181+01',
      },
      {
        requestId: 'xDh26btGz',
        status: 'Open',
        approverId: '-LJV4b1QTCYewOtk5F63',
        createdAt: '2018-08-16 012:11:52.181+01',
        updatedAt: '2018-08-16 012:11:52.181+01',
      },
      {
        requestId: 'xDh27irtGy',
        status: 'Approved',
        approverId: '-LJV4b1QTCYewOtk5F63',
        createdAt: '2018-08-16 012:11:52.181+01',
        updatedAt: '2018-08-16 012:11:52.181+01',
      },
      {
        requestId: 'xDh43mytx',
        status: 'Open',
        approverId: '-LJV4b1QTCYewOtk5F63',
        createdAt: '2018-08-16 012:11:52.181+01',
        updatedAt: '2018-08-16 012:11:52.181+01',
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => { // eslint-disable-line
    return queryInterface.bulkDelete('Approvals', null, {});
  }
};
