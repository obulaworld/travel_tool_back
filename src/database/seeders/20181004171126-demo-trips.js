module.exports = {
  up: queryInterface => queryInterface.bulkInsert('Trips',
    [
      {
        id: 'trip-1',
        origin: 'Nairobi',
        destination: 'Lagos',
        departureDate: '2018-10-04',
        returnDate: '2018-10-16',
        checkStatus: 'Not Checked In',
        notificationCount: 0,
        createdAt: '2018-10-05T08:36:11.170Z',
        updatedAt: '2018-10-05T08:36:11.170Z',
        bedId: 6004,
        requestId: 'request-id-1',
        checkInDate: '2018-10-05'
      },
      {
        id: 'trip-2',
        origin: 'Nairobi',
        destination: 'Lagos',
        departureDate: '2018-10-01',
        returnDate: '2018-10-10',
        checkStatus: 'Not Checked In',
        notificationCount: 0,
        createdAt: '2018-10-05T08:36:11.170Z',
        updatedAt: '2018-10-05T08:36:11.170Z',
        bedId: 6001,
        requestId: 'request-id-1',
        checkInDate: '2018-10-02'
      },
      {
        id: 'trip-3',
        origin: 'Nairobi',
        destination: 'Lagos',
        departureDate: '2018-09-16',
        returnDate: '2018-10-10',
        checkStatus: 'Not Checked In',
        notificationCount: 0,
        createdAt: '2018-10-05T08:36:11.170Z',
        updatedAt: '2018-10-05T08:36:11.170Z',
        bedId: 6003,
        requestId: 'request-id-2',
        checkInDate: '2018-09-16'
      },
      {
        id: 'trip-4',
        origin: 'Nairobi',
        destination: 'Lagos',
        departureDate: '2018-10-16',
        returnDate: '2018-10-20',
        checkStatus: 'Not Checked In',
        notificationCount: 0,
        createdAt: '2018-10-05T08:36:11.170Z',
        updatedAt: '2018-10-05T08:36:11.170Z',
        bedId: 6002,
        requestId: 'request-id-2',
        checkInDate: '2018-10-16'
      },
      {
        id: 'trip-5',
        origin: 'Nairobi',
        destination: 'Lagos',
        departureDate: '2018-03-16',
        returnDate: '2018-07-20',
        checkStatus: 'Not Checked In',
        notificationCount: 0,
        createdAt: '2018-10-05T08:36:11.170Z',
        updatedAt: '2018-10-05T08:36:11.170Z',
        bedId: 6004,
        requestId: 'request-id-3',
        checkInDate: '2018-03-16',
        checkOutDate: '2018-07-20'
      },
      {
        id: 'trip-6',
        origin: 'Nairobi',
        destination: 'Lagos',
        departureDate: '2018-07-10',
        returnDate: '2018-11-30',
        checkStatus: 'Not Checked In',
        notificationCount: 0,
        createdAt: '2018-10-05T08:36:11.170Z',
        updatedAt: '2018-10-05T08:36:11.170Z',
        bedId: 6003,
        requestId: 'request-id-4',
        checkInDate: '2018-11-04',
        checkOutDate: '2018-11-30'
      },
      {
        id: 'trip-7',
        origin: 'Nairobi',
        destination: 'Lagos',
        departureDate: '2018-02-02',
        returnDate: '2018-05-30',
        checkStatus: 'Not Checked In',
        notificationCount: 0,
        createdAt: '2018-10-05T08:36:11.170Z',
        updatedAt: '2018-10-05T08:36:11.170Z',
        bedId: 6002,
        requestId: 'request-id-4',
        checkInDate: '2018-02-03',
        checkOutDate: '2018-05-30'
      },
      {
        id: 'trip-8',
        origin: 'Nairobi',
        destination: 'Lagos',
        departureDate: '2018-08-02',
        returnDate: '2018-11-10',
        checkStatus: 'Not Checked In',
        notificationCount: 0,
        createdAt: '2018-10-05T08:36:11.170Z',
        updatedAt: '2018-10-05T08:36:11.170Z',
        bedId: 6000,
        requestId: 'request-id-5',
        checkInDate: '2018-08-02',
        checkOutDate: '2018-11-10'
      },
      {
        id: 'trip-9',
        origin: 'Nairobi',
        destination: 'Lagos',
        departureDate: '2018-11-02',
        returnDate: '2019-02-10',
        checkStatus: 'Not Checked In',
        notificationCount: 0,
        createdAt: '2018-10-05T08:36:11.170Z',
        updatedAt: '2018-10-05T08:36:11.170Z',
        bedId: 6001,
        requestId: 'request-id-5',
        checkInDate: '2018-11-03'
      }
    ], {}),

  down: queryInterface => queryInterface.bulkDelete('Trips', null, {})
};