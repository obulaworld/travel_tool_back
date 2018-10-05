module.exports = {
  up: queryInterface => queryInterface.bulkInsert('Beds',
    [
      {
        id: 1,
        bedName: 'bed 1',
        roomId: 'room-id-1',
        booked: false,
        createdAt: '2018-08-16 012:11:52.181+01',
        updatedAt: '2018-08-16 012:11:52.181+01'
      },
      {
        id: 2,
        bedName: 'bed 2',
        roomId: 'room-id-1',
        booked: false,
        createdAt: '2018-08-16 012:11:52.181+01',
        updatedAt: '2018-08-16 012:11:52.181+01'
      },
      {
        id: 3,
        bedName: 'bed 1',
        roomId: 'room-id-2',
        booked: false,
        createdAt: '2018-08-16 012:11:52.181+01',
        updatedAt: '2018-08-16 012:11:52.181+01'
      },
      {
        id: 4,
        bedName: 'bed 2',
        roomId: 'room-id-2',
        booked: false,
        createdAt: '2018-08-16 012:11:52.181+01',
        updatedAt: '2018-08-16 012:11:52.181+01'
      },
      {
        id: 5,
        bedName: 'bed 3',
        roomId: 'room-id-2',
        booked: false,
        createdAt: '2018-08-16 012:11:52.181+01',
        updatedAt: '2018-08-16 012:11:52.181+01'
      }
    ], {}),

  down: queryInterface => queryInterface.bulkDelete('Beds', null, {})
};
