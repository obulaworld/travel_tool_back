const date = new Date();
const dateToday = new Date(date.setDate(date.getDate()))
  .toISOString().split('T')[0];
const dateDeparture = new Date(date.setDate(date.getDate() + 1))
  .toISOString().split('T')[0];
const dateReturn = new Date(date.setDate(date.getDate() + 3))
  .toISOString().split('T')[0];

export const dates = {
  departureDate: dateDeparture,
  returnDate: dateReturn,
  dateToday
};

export const checkInData = {
  checkType: 'checkIn'
};

export const checkOutData = {
  checkType: 'checkOut'
};

export const requestsData = [
  {
    id: 'xDh20cuGz',
    name: 'James Bond',
    manager: 'Samuel Kubai',
    role: 'Software Developer',
    gender: 'Female',
    department: 'TDD',
    tripType: 'return',
    status: 'Open',
    picture: 'https://sgeeegege',
    userId: '-MUyHJmKrxA90lPNQ1FOLNm',
  },
  {
    id: 'xDh20cuGy',
    name: 'Samuel Jackson',
    manager: 'Samuel Kubai',
    tripType: 'oneWay',
    gender: 'Female',
    department: 'TDD',
    status: 'Verified',
    picture: 'https://sgeeegege',
    role: 'Software Developer',
    userId: '-MUyHJmKrxA90lPNQ1FOLNm',
  },
  {
    id: 'xDh20cuGx',
    name: 'Stephen Neutron',
    manager: 'Samuel Kubai',
    tripType: 'multi',
    gender: 'Female',
    department: 'TDD',
    status: 'Approved',
    picture: 'https://sgeeegege',
    role: 'Software Developer',
    userId: '-MUyHJmKrxA90lPNQ1FOLNm',
  },
  {
    id: 'xDh20cuGs',
    name: 'Anita Baker',
    manager: 'Samuel Kubai',
    tripType: 'multi',
    gender: 'Male',
    department: 'TDD',
    status: 'Approved',
    picture: 'https://sgeeegege',
    role: 'Software Developer',
    userId: '-MUyHJmKrxA90lPNQ1FOLNm',
  },
];

export const tripsData = [
  {
    id: 1,
    requestId: 'xDh20cuGz',
    origin: 'Nairobi',
    destination: 'New York',
    bedId: 1,
    departureDate: dates.departureDate,
    returnDate: dates.returnDate,
  },
  {
    id: 2,
    requestId: 'xDh20cuGy',
    origin: 'New York',
    destination: 'Nairobi',
    bedId: 1,
    departureDate: dates.dateToday,
    returnDate: dates.returnDate,
  },
  {
    id: 3,
    requestId: 'xDh20cuGx',
    origin: 'New York',
    destination: 'Nairobi',
    bedId: 1,
    departureDate: '2018-09-27',
    returnDate: dates.returnDate,
  },
  {
    id: 4,
    requestId: 'xDh20cuGs',
    origin: 'New York',
    destination: 'Nairobi',
    bedId: 4,
    departureDate: '2018-09-27',
    returnDate: dates.returnDate,
    checkOutDate: dates.returnDate,
    checkStatus: 'Checked Out'
  },
  {
    id: 5,
    requestId: 'xDh20cuGy',
    origin: 'New York',
    destination: 'Nairobi',
    bedId: 1,
    departureDate: dates.departureDate,
    returnDate: dates.returnDate,
  },
];

export const tripsResponse = {
  success: true,
  trips: [
    {
      id: '2',
      origin: 'New York',
      destination: 'Nairobi',
      departureDate: '2018-09-30',
      returnDate: '2018-10-03',
      checkStatus: 'Checked Out',
      checkInDate: '2018-09-29T18:56:49.132Z',
      checkOutDate: '2018-09-29T18:56:49.180Z',
      lastNotifyDate: null,
      notificationCount: 0,
      createdAt: '2018-09-29T18:56:49.018Z',
      updatedAt: '2018-09-29T18:56:49.180Z',
      bedId: 1,
      requestId: 'xDh20cuGy',
      request: {
        id: 'xDh20cuGy',
        name: 'Samuel Jackson',
        tripType: 'oneWay',
        manager: 'Samuel Kubai',
        gender: 'Female',
        department: 'TDD',
        role: 'Software Developer',
        status: 'Verified',
        userId: '-MUyHJmKrxA90lPNQ1FOLNm',
        createdAt: '2018-09-29T18:56:49.014Z',
        updatedAt: '2018-09-29T18:56:49.014Z'
      },
      beds: {
        id: 1,
        bedName: 'bed 1',
        createdAt: '2018-09-29T18:56:49.008Z',
        updatedAt: '2018-09-29T18:56:49.008Z',
        roomId: 'Xi9htlDeC4',
        rooms: {
          id: 'Xi9htlDeC4',
          roomName: 'big cutter',
          roomType: 'ensuited',
          bedCount: 1,
          faulty: 'false',
          createdAt: '2018-09-29T18:56:49.005Z',
          updatedAt: '2018-09-29T18:56:49.005Z',
          guestHouseId: '-5mKYgpcl',
          guestHouses: {
            id: '-5mKYgpcl',
            houseName: 'Mini flat',
            location: 'Lagos Nigeria',
            bathRooms: 1,
            imageUrl: 'https://www.lol.com',
            createdAt: '2018-09-29T18:56:49.002Z',
            updatedAt: '2018-09-29T18:56:49.002Z',
            userId: '-MUyHJmKrxA90lPNQ1FOLNm'
          }
        }
      }
    }
  ],
  message: 'Retrieved Successfully'
};

export const travelAdmin = {
  id: 1983,
  fullName: 'Chris Brown',
  email: 'chris.brown@andela.com',
  createdAt: '2018-08-16 012:11:52.181+01',
  updatedAt: '2018-08-16 012:11:52.181+01',
  userId: '-LJV4b1QTDYewOtk5F65',
  roleId: '29187',
  gender: 'male',
  location: 'Lagos',
};

export const postGuestHouse = {
  houseName: 'Mini flat',
  location: 'Lagos Nigeria',
  bathRooms: '1',
  imageUrl: 'https://www.lol.com',
  rooms: [
    {
      roomName: 'big cutter',
      roomType: 'ensuited',
      bedCount: '3'
    },
    {
      roomName: 'small cutter',
      roomType: 'non-ensuited',
      bedCount: '3'
    }
  ]
};
