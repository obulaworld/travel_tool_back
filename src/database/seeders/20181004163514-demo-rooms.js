module.exports = {
  up: queryInterface => queryInterface.bulkInsert('Rooms',
    [
      {
        id: 'room-id-1',
        roomName: 'Kwetu',
        roomType: 'ensuited',
        bedCount: 2,
        faulty: false,
        createdAt: '2018-08-16 012:11:52.181+01',
        updatedAt: '2018-08-16 012:11:52.181+01',
        guestHouseId: 'guest-house-1'
      },
      {
        id: 'room-id-2',
        roomName: 'Menengai',
        roomType: 'ensuited',
        bedCount: 3,
        faulty: false,
        createdAt: '2018-08-16 012:11:52.181+01',
        updatedAt: '2018-08-16 012:11:52.181+01',
        guestHouseId: 'guest-house-1'
      }
    ], {}),

  down: queryInterface => queryInterface.bulkDelete('Rooms', null, {})
};
