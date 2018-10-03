const date = new Date();
const dateDeparture = new Date(date.setDate(date.getDate() + 1))
  .toISOString().split('T')[0];
const dateReturn = new Date(date.setDate(date.getDate() + 3))
  .toISOString().split('T')[0];

export const dates = {
  departureDate: dateDeparture,
  returnDate: dateReturn,
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
    status: 'Approved',
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
    departureDate: dates.departureDate,
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
  }
];
