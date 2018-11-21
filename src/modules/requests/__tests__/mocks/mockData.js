const date = new Date();
const departureDate = new Date(date.setDate(date.getDate() + 1))
  .toISOString()
  .split('T')[0];
const returnDate = new Date(date.setDate(date.getDate() + 3))
  .toISOString()
  .split('T')[0];

export const dates = {
  departureDate,
  returnDate
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
    trips: []
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
    trips: []
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
    trips: []
  }
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
        bedId: 18
      }
    ]
  },
  approval: {
    approverId: 'Some manager',
    status: 'Open'
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
    picture: 'https://sgeeegege'
  },
  trips: [
    {
      origin: 'Kampala',
      destination: 'New York',
      departureDate,
      returnDate: null,
      bedId: 18
    }
  ],
  success: true
};

export const manager = {
  fullName: 'Some manager',
  email: 'some.manager@andela.com',
  userId: 'bjhdfkjdhfkd',
  passportName: 'Some Manager',
  location: 'Lagos',
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
      destination: 'Nairobi',
      departureDate,
      returnDate,
      bedId: 18
    },
    {
      origin: 'New York',
      destination: 'Nairobi',
      departureDate,
      returnDate,
      bedId: 18
    }
  ]
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
      bedId: 18
    },
    {
      origin: 'New York',
      destination: 'Nairobi',
      departureDate,
      returnDate,
      bedId: 18
    }
  ]
};

export const newRequest = {
  name: 'Tester Stephen',
  origin: 'Lagos',
  destination: 'New york',
  gender: 'Male',
  manager: 'Travel Admin',
  department: 'TDD',
  role: 'Software Developer',
  tripType: 'return',
  trips: [
    {
      origin: 'Lagos',
      destination: 'New York',
      departureDate,
      returnDate,
      bedId: 1,
    },
  ],
};

export const travelAdmin = {
  fullName: 'Travel Admin',
  email: 'travel.admin@andela.com',
  userId: '-HyfghjTUGfghjkIJM',
  passportName: 'Travel Admin',
  location: 'Lagos',
};

/*
* a function for generating mock data for testing the
* RequestController.sendNotificationToManager method
*/
export const generateMockData = (mailType) => {
  const req = {
    user: {
      UserInfo: { name: 'Dave Mathews', picture: 'https://url-to-image' }
    }
  };
  const res = {};
  const travelRequest = {
    userId: '00023',
    id: '-2s34jkw-m0y',
    manager: 'My manager'
  };
  let message;
  let mailTopic;
  if (mailType === 'New Request') {
    message = 'created a new travel request';
    mailTopic = 'New Travel Request';
  } else if (mailType === 'Updated Request') {
    message = 'edited a travel request';
    mailTopic = 'Updated Travel Request';
  } else if (mailType === 'Deleted Request') {
    message = 'deleted a travel request';
    mailTopic = 'Deleted Travel Request';
  }

  return {
    req, res, travelRequest, message, mailType, mailTopic
  };
};

export const guestHouse = {
  id: 'rx123z',
  houseName: 'Stan Lee\'s Suites',
  location: 'Nairobi',
  bathRooms: '1',
  imageUrl: 'ded',
  userId: '--MUyHJmKrxA90lPNQ1FOLNm',
  createdAt: new Date(),
  updatedAt: new Date()
};

export const rooms = [
  {
    id: 'qweaf',
    roomName: 'big cutter',
    roomType: 'ensuited',
    bedCount: '2',
    isDeleted: false,
    faulty: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    guestHouseId: 'rx123z'
  },
  {
    id: 'craite',
    roomName: 'small cutter',
    roomType: 'ensuited',
    bedCount: '2',
    isDeleted: false,
    faulty: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    guestHouseId: 'rx123z'
  }
];

export const beds = [
  {
    id: 321,
    bedName: 'bed 1',
    booked: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    roomId: 'qweaf'
  },
  {
    id: 322,
    bedName: 'bed 2',
    booked: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    roomId: 'qweaf'
  },
  {
    id: 323,
    bedName: 'bed 3',
    booked: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    roomId: 'craite'
  },
  {
    id: 324,
    bedName: 'bed 4',
    booked: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    roomId: 'craite'
  },
  {
    id: 18,
    bedName: 'bed 5',
    booked: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    roomId: 'craite'
  }
];

export const travelTeamMember = [
  {
    id: 3023,
    fullName: 'Drew Barrymore',
    email: 'drewbarrymore@andela.com',
    userId: '-MUyHJmKrxA90lPNQ1FOENx',
    picture: 'fakePicture.png',
    location: 'Lagos',
    passportName: 'Drew Barrymore',
  },
  {
    UserInfo: {
      name: 'Drew Barrymore',
      email: 'drewbarrymore@andela.com',
      id: '-MUyHJmKrxA90lPNQ1FOENx',
      picture: 'fakePicture.png'
    }
  }
];

export const normalRequester = [
  {
    id: 3024,
    fullName: 'Felix Sterling',
    email: 'felixsterling@andela.com',
    userId: '-MUyHJmKrxA90lPNQ1FOENy',
    picture: 'fakePicture.png',
    location: 'Lagos',
    passportName: 'Felix Sterling',
  },
  {
    UserInfo: {
      name: 'Felix Sterling',
      email: 'felixsterling@andela.com',
      id: '-MUyHJmKrxA90lPNQ1FOENy',
      picture: 'fakePicture.png',
    }
  }
];

export const userRoles = [
  {
    userId: 3023,
    roleId: 339458
  },
  {
    userId: 3024,
    roleId: 401938,
  }
];

export const checkListItems = [
  {
    id: 'qwsaafr',
    name: 'Visa',
    requiresFiles: true,
    destinationName: 'Nairobi, Kenya'
  }
];

export const checkListSubmissions = [
  {
    id: 'eqwu',
    value: 'visa link',
    tripId: 'trip798',
    checklistItemId: 'qwsaafr'
  }
];

export const requestsList = [
  {
    id: 'qw234re',
    name: 'Felix Sterling',
    manager: 'Samuel Kubai',
    role: 'Software Developer',
    gender: 'Male',
    department: 'TDD',
    tripType: 'return',
    status: 'Approved',
    userId: '-MUyHJmKrxA90lPNQ1FOENy',
    picture: 'https://sgeeegege'
  },
  {
    id: 'qw234rb',
    name: 'Felix Sterling',
    manager: 'Samuel Kubai',
    role: 'Software Developer',
    gender: 'Male',
    department: 'TDD',
    tripType: 'return',
    status: 'Open',
    userId: '-MUyHJmKrxA90lPNQ1FOENy',
    picture: 'https://sgeeegege'
  },
  {
    id: 'qw234rc',
    name: 'Felix Sterling',
    manager: 'Samuel Kubai',
    role: 'Software Developer',
    gender: 'Male',
    department: 'TDD',
    tripType: 'return',
    status: 'Approved',
    userId: '-MUyHJmKrxA90lPNQ1FOENy',
    picture: 'https://sgeeegege'
  },
  {
    id: 'qw234rq',
    name: 'Felix Sterling',
    manager: 'Samuel Kubai',
    role: 'Software Developer',
    gender: 'Male',
    department: 'TDD',
    tripType: 'return',
    status: 'Approved',
    userId: '-MUyHJmKrxA90lPNQ1FOENy',
    picture: 'https://sgeeegege'
  },
  {
    id: 'qw235rp',
    name: 'Felix Sterling',
    manager: 'Samuel Kubai',
    role: 'Software Developer',
    gender: 'Male',
    department: 'TDD',
    tripType: 'return',
    status: 'Approved',
    userId: '-MUyHJmKrxA90lPNQ1FOENy',
    picture: 'https://sgeeegege'
  },
  {
    id: 'eq23xsd',
    name: 'Felix Sterling',
    manager: 'Samuel Kubai',
    role: 'Software Developer',
    gender: 'Male',
    department: 'TDD',
    tripType: 'return',
    status: 'Approved',
    userId: '-MUyHJmKrxA90lPNQ1FOENy',
    picture: 'https://sgeeegege'
  }
];

export const approvalsList = [
  {
    id: 1209,
    requestId: 'qw234re',
    status: 'Approved',
    approverId: 'Samuel Kubai'
  },
  {
    id: 1210,
    requestId: 'qw234rc',
    status: 'Approved',
    approverId: 'Samuel Kubai'
  },
  {
    id: 1213,
    requestId: 'qw234rq',
    status: 'Approved',
    approverId: 'Samuel Kubai'
  },
  {
    id: 1214,
    requestId: 'qw235rp',
    status: 'Approved',
    approverId: 'Samuel Kubai'
  },
  {
    id: 1215,
    requestId: 'eq23xsd',
    status: 'Approved',
    approverId: 'Samuel Kubai'
  }
];

export const trips = [
  {
    id: 'trip797',
    requestId: 'qw234rb',
    origin: 'Lagos, Nigeria',
    destination: 'Nairobi, Kenya',
    bedId: 323,
    departureDate: dates.departureDate,
    returnDate: dates.returnDate,
  },
  {
    id: 'trip798',
    requestId: 'qw234re',
    origin: 'Lagos, Nigeria',
    destination: 'Nairobi, Kenya',
    bedId: 323,
    departureDate: dates.departureDate,
    returnDate: dates.returnDate,
  },
  {
    id: 'trip799',
    requestId: 'qw234rc',
    origin: 'kampala, Uganda',
    destination: 'Nairobi, Kenya',
    bedId: 323,
    departureDate: dates.departureDate,
    returnDate: dates.returnDate,
  },
  {
    id: 'trip800',
    requestId: 'qw234rq',
    origin: 'Lagos, Nigeria',
    destination: 'Nairobi, Kenya',
    bedId: 323,
    departureDate: '2017-01-01',
    returnDate: dates.returnDate,
  },
  {
    id: 'trip802',
    requestId: 'qw235rp',
    origin: 'Lagos, Nigeria',
    destination: 'Nairobi, Kenya',
    bedId: 323,
    departureDate: dates.departureDate,
    returnDate: dates.returnDate,
  }
];

export default testRequests;
