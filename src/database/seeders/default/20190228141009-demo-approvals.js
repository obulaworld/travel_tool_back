module.exports = {
  up: queryInterface => queryInterface.bulkInsert(
    'Approvals',
    [
      {
        id: '3982',
        requestId: '3456',
        status: 'Approved',
        approverId: 'Samuel Kubai',
        createdAt: '2018-08-16 012:11:52.181+01',
        updatedAt: '2018-08-16 012:11:52.181+01',
        deletedAt: null,
        budgetStatus: 'Approved'
      },
    ],
    {},
  ),

  down: queryInterface => queryInterface.bulkDelete('Approvals', null, {}),
};
