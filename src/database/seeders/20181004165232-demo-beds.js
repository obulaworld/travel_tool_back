module.exports = {
  up: queryInterface => queryInterface.bulkInsert('Beds',
    [
      {
        id: 6000,
        bedName: 'bed 1',
        roomId: 'room-id-1',
        booked: false,
        createdAt: '2018-08-16 012:11:52.181+01',
        updatedAt: '2018-08-16 012:11:52.181+01'
      },
      {
        id: 6001,
        bedName: 'bed 2',
        roomId: 'room-id-1',
        booked: false,
        createdAt: '2018-08-16 012:11:52.181+01',
        updatedAt: '2018-08-16 012:11:52.181+01'
      },
      {
        id: 6002,
        bedName: 'bed 1',
        roomId: 'room-id-2',
        booked: false,
        createdAt: '2018-08-16 012:11:52.181+01',
        updatedAt: '2018-08-16 012:11:52.181+01'
      },
      {
        id: 6003,
        bedName: 'bed 2',
        roomId: 'room-id-2',
        booked: false,
        createdAt: '2018-08-16 012:11:52.181+01',
        updatedAt: '2018-08-16 012:11:52.181+01'
      },
      {
        id: 6004,
        bedName: 'bed 3',
        roomId: 'room-id-2',
        booked: false,
        createdAt: '2018-08-16 012:11:52.181+01',
        updatedAt: '2018-08-16 012:11:52.181+01'
      }
    ], {}),

  down: queryInterface => queryInterface.bulkDelete('Beds', null, {})
};
