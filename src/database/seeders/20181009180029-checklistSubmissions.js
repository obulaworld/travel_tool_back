module.exports = {
  up: queryInterface => queryInterface.bulkInsert('ChecklistSubmissions',
    [
      {
        id: '1',
        value: 'submitted',
        tripId: 'trip-10',
        checklistItemId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        value: 'submitted',
        tripId: 'trip-11',
        checklistItemId: '4',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '3',
        value: 'submitted',
        tripId: 'trip-12',
        checklistItemId: '8',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {}),
  down: queryInterface => queryInterface
    .bulkDelete('ChecklistSubmissions', new Date('2023-10-12'), {})
};
