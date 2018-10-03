const date = new Date();
const departureDate = new Date(date.setDate(date.getDate() + 1))
  .toISOString().split('T')[0];
const returnDate = new Date(date.setDate(date.getDate() + 3))
  .toISOString().split('T')[0];

export const dates = {
  departureDate,
  returnDate,
};

export const testRequests = [
  {
    id: 'xDh20cuGz',
    name: 'Test user A',
    manager: 'Samuel Kubai',
    role: 'Software Developer',
    gender: 'Female',
    department: 'TDD',
    tripType: 'return',
    status: 'Open',
    userId: '-MUyHJmKrxA90lPNQ1FOLNm',
    picture: 'https://sgeeegege',
    trips: [],
  },
  {
    id: 'xDh20cuGy',
    name: 'Test user B',
    manager: 'Samuel Kubai',
    tripType: 'oneWay',
    gender: 'Female',
    department: 'TDD',
    status: 'Approved',
    role: 'Software Developer',
    userId: '-MUyHJmKrxA90lPNQ1FOLNm',
    picture: 'https://sgeeegege',
    trips: [],
  },
  {
    id: 'xDh20cuGx',
    name: 'Test user C',
    manager: 'Samuel Kubai',
    tripType: 'multi',
    gender: 'Female',
    department: 'TDD',
    status: 'Rejected',
    role: 'Software Developer',
    userId: '-MUyHJmKrxA90lPNQ1FOLNm',
    picture: 'https://sgeeegege',
    trips: [],
  },
];

export const emptyRequestResponse = {
  success: false,
  errors: [
    {
      location: 'body',
      param: 'name',
      msg: 'Name  cannot be empty and must be between 3 and 50 characters long'
    },
    {
      location: 'body',
      param: 'manager',
      msg: 'manager cannot be empty'
    },
    {
      location: 'body',
      param: 'tripType',
      msg: 'tripType cannot be empty'
    },
    {
      location: 'body',
      param: 'tripType',
      msg: 'tripType must be "return", "oneWay" or "multi"'
    },
    {
      location: 'body',
      param: 'gender',
      msg: 'gender cannot be empty'
    },
    {
      location: 'body',
      param: 'department',
      msg: 'department cannot be empty'
    },
    {
      location: 'body',
      param: 'role',
      msg: 'role cannot be empty'
    },
    {
      location: 'body',
      param: 'trips',
      msg: 'trips must be an array'
    },
    {
      location: 'body',
      param: 'trips',
      msg: 'trips cannot be empty'
    }
  ]
};

export const createRequestSuccessResponse = {
  success: true,
  message: 'Request created successfully',
  request: {
    status: 'Open',
    name: 'Test',
    tripType: 'return',
    manager: 'Some manager',
    gender: 'Female',
    department: 'TDD',
    role: 'Software Developer',
    trips: [
      {
        origin: 'Lagos',
        destination: 'Nairobi',
        departureDate,
        returnDate,
      }
    ],
  },
  approval: {
    approverId: 'Some manager',
    status: 'Open',
  }
};

export const editRequestSuccessResponse = {
  request: {
    status: 'Open',
    name: 'Test',
    tripType: 'oneWay',
    manager: 'Some manager',
    gender: 'Female',
    department: 'TDD',
    role: 'Software Developer',
    picture: 'https://sgeeegege',
  },
  trips: [
    {
      origin: 'Kampala',
      destination: 'New York',
      departureDate,
      returnDate: null,
    }
  ],
  success: true,
};

export const manager = {
  fullName: 'Some manager',
  email: 'some.manager@andela.com',
  userId: 'bjhdfkjdhfkd',
  passportName: 'Some Manager',
};


export const mockRequest = {
  name: 'Tester Demola',
  origin: 'Kampala',
  destination: 'New york',
  gender: 'Male',
  manager: 'Some manager',
  department: 'TDD',
  role: 'Senior Consultant',
  tripType: 'multi',
  picture: 'https://sgeeegege',
  trips: [
    {
      origin: 'Nairobi',
      destination: 'New York',
      departureDate,
      returnDate,
    },
    {
      origin: 'New York',
      destination: 'Nairobi',
      departureDate,
      returnDate
    }
  ],
};

export const anotherMockRequest = {
  name: 'Tester Stephen',
  origin: 'Lagos',
  destination: 'New york',
  gender: 'Male',
  manager: 'Some manager',
  department: 'TDD',
  role: 'Software Developer',
  tripType: 'multi',
  trips: [
    {
      origin: 'Nairobi',
      destination: 'New York',
      departureDate,
      returnDate,
    },
    {
      origin: 'New York',
      destination: 'Nairobi',
      departureDate,
      returnDate
    }
  ],
};

export default testRequests;
