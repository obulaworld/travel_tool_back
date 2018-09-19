const testRequests = [
  {
    id: 'xDh20cuGz',
    name: 'Test user A',
    origin: 'Lagos',
    destination: 'Nairobi',
    manager: 'Samuel Kubai',
    gender: 'Female',
    department: 'TDD',
    status: 'Open',
    role: 'Software Developer',
    userId: '-MUyHJmKrxA90lPNQ1FOLNm',
    departureDate: '2018-12-09',
    arrivalDate: '2018-11-12',
    tripType: 'multi',
    createdAt: '2018-08-16 012:11:52.181+01',
    updatedAt: '2018-08-16 012:11:52.181+01',
  },
  {
    id: 'xDh20cuGy',
    name: 'Test user B',
    origin: 'Lagos',
    destination: 'Nairobi',
    manager: 'Samuel Kubai',
    gender: 'Female',
    department: 'TDD',
    status: 'Approved',
    role: 'Software Developer',
    userId: '-MUyHJmKrxA90lPNQ1FOLNm',
    departureDate: '2018-09-12',
    arrivalDate: '2018-11-12',
    tripType: 'multi',
    createdAt: '2018-08-16 012:11:52.181+01',
    updatedAt: '2018-08-16 012:11:52.181+01',
  },
  {
    id: 'xDh20cuGx',
    name: 'Test user C',
    origin: 'Lagos',
    destination: 'Nairobi',
    manager: 'Samuel Kubai',
    gender: 'Female',
    department: 'TDD',
    status: 'Rejected',
    role: 'Software Developer',
    userId: '-MUyHJmKrxA90lPNQ1FOLNm',
    departureDate: '2018-09-12',
    arrivalDate: '2018-11-12',
    tripType: 'multi',
    createdAt: '2018-08-16 012:11:52.181+01',
    updatedAt: '2018-08-16 012:11:52.181+01',
  }
];

export const newRequest = {
  id: 'h35gbb',
  name: 'Tester Demola',
  origin: 'Kampala',
  destination: 'New york',
  gender: 'Male',
  manager: 'Samuel Kubai',
  department: 'TDD',
  role: 'Senior Consultant',
  status: 'Open',
  departureDate: '2018-08-16',
  arrivalDate: '2018-08-30',
  tripType: 'multi',
  trips: [
    {
      origin: 'Nairobi',
      destination: 'New York',
      departureDate: '2018-08-16 012:11:52.181+01',
      returnDate: '2018-08-16 012:11:52.181+01'
    },
    {
      origin: 'New York',
      destination: 'Nairobi',
      departureDate: '2018-08-16 012:11:52.181+01',
      returnDate: '2018-08-16 012:11:52.181+01'
    }
  ],
  createdAt: '2018-08-16 012:11:52.181+01',
  updatedAt: '2018-08-16 012:11:52.181+01'
};

export default testRequests;
