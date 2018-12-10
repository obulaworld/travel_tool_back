module.exports = {
  up: queryInterface => queryInterface.bulkInsert('ChecklistItemResources',
    [
      {
        id: '1',
        link: 'http://andela.com',
        label: 'Flight Application Guide',
        checklistItemId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {}),

  down: queryInterface => queryInterface.bulkDelete('ChecklistItemResources', null, {})
};
