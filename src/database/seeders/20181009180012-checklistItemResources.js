module.exports = {
  up: queryInterface => queryInterface.bulkInsert('ChecklistItemResources',
    [
      {
        id: '1',
        link: 'http://kigali.visa.com',
        label: 'Application Guide',
        checklistItemId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        link: 'http://newyork.visa.com',
        label: 'Application Guide',
        checklistItemId: '4',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '3',
        link: 'http://lagos.visa.com',
        label: 'Application Guide',
        checklistItemId: '8',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '4',
        link: 'http://nairobi.visa.com',
        label: 'Application Guide',
        checklistItemId: '6',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {}),
  down: queryInterface => queryInterface
    .bulkDelete('ChecklistItemResources', new Date('2023-10-12'), {})
};
