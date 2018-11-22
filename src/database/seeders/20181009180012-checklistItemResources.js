module.exports = {
  up: queryInterface => queryInterface.bulkInsert('ChecklistItemResources',
    [
      {
        id: '2',
        link: 'http://kigali.visa.com',
        label: 'Application Guide',
        checklistItemId: '2',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '3',
        link: 'http://newyork.visa.com',
        label: 'Application Guide',
        checklistItemId: '5',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '4',
        link: 'http://lagos.visa.com',
        label: 'Application Guide',
        checklistItemId: '9',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '5',
        link: 'http://nairobi.visa.com',
        label: 'Application Guide',
        checklistItemId: '7',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {}),
  down: queryInterface => queryInterface
    .bulkDelete('ChecklistItemResources', new Date('2023-10-12'), {})
};
