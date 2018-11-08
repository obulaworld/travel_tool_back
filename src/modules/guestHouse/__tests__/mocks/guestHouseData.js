export const postGuestHouse = {
  houseName: 'Mini flat',
  location: 'Lagos Nigeria',
  bathRooms: '1',
  imageUrl: 'https://www.lol.com',
  rooms: [
    {
      roomName: 'big cutter',
      roomType: 'ensuited',
      bedCount: '1'
    },
    {
      roomName: 'small cutter',
      roomType: 'non-ensuited',
      bedCount: '1'
    }
  ]
};

export const postGuestHouse2 = {
  houseName: 'Mini flat',
  location: 'Lagos Nigeria',
  bathRooms: '1',
  imageUrl: 'ded',
  rooms: [
    {
      roomName: 'big cutter',
      roomType: 'ensuited',
      bedCount: '1'
    },
    {
      roomName: 'small cutter',
      roomType: 'non-ensuited',
      bedCount: '1'
    }
  ]
};

export const updateRoomFaultStatus = {
  room1: {
    fault: false
  },
  room2: {
    fault: 'falses'
  }
};

export const guestHouseResponse = {
  success: true,
  message: 'Guest House created successfully',
  guestHouse: {
    houseName: 'Mini flat',
    location: 'Lagos Nigeria',
    bathRooms: 1,
    imageUrl: 'https://www.lol.com',
    id: 'qJ-G_C3TX',
    userId: '-LHJlGhZ9HiNldVt-jB-',
    updatedAt: '2018-09-26T15:47:47.563Z',
    createdAt: '2018-09-26T15:47:47.563Z'
  },
  rooms: [
    {
      id: 'ygfwl4-XT5',
      roomName: 'big cutter',
      roomType: 'ensuited',
      bedCount: '1',
      faulty: false,
      createdAt: '2018-09-26T15:47:47.576Z',
      updatedAt: '2018-09-26T15:47:47.576Z',
      guestHouseId: 'qJ-G_C3TX'
    },
    {
      id: 'mNPQzvpO1u',
      roomName: 'small cutter',
      roomType: 'non-ensuited',
      bedCount: '1',
      faulty: false,
      createdAt: '2018-09-26T15:47:47.576Z',
      updatedAt: '2018-09-26T15:47:47.576Z',
      guestHouseId: 'qJ-G_C3TX'
    }
  ],
  bed: [
    [
      {
        id: 18,
        roomId: 'ygfwl4-XT5',
        bedName: 'bed 1',
        updatedAt: '2018-09-26T15:47:47.582Z',
        createdAt: '2018-09-26T15:47:47.582Z'
      }
    ],
    [
      {
        id: 19,
        roomId: 'mNPQzvpO1u',
        bedName: 'bed 1',
        updatedAt: '2018-09-26T15:47:47.583Z',
        createdAt: '2018-09-26T15:47:47.583Z'
      }
    ]
  ]
};


export const GuestHouseEpic = {
  id: 'ND56thdW',
  houseName: 'Bukoto Heights',
  location: 'Kampala, Uganda',
  bathRooms: '2',
  imageUrl: 'https://www.lol.com',
  userId: '-TRUniplpknbbh',
  createdAt: '2018-09-26T15:47:47.576Z',
  updatedAt: '2018-09-26T15:47:47.576Z',
};

export const GuestHouseEpicRoom = {
  id: 'bEu6thdW',
  roomName: 'big cutter',
  roomType: 'ensuited',
  bedCount: '2',
  faulty: false,
  guestHouseId: 'ND56thdW',
  createdAt: '2018-09-26T15:47:47.576Z',
  updatedAt: '2018-09-26T15:47:47.576Z',
};

export const GuestHouseEpicBed = [
  {
    id: 18,
    roomId: 'bEu6thdW',
    bedName: 'bed 1',
    booked: false,
    updatedAt: '2018-09-26T15:47:47.582Z',
    createdAt: '2018-09-26T15:47:47.582Z'
  },
  {
    id: 19,
    roomId: 'bEu6thdW',
    bedName: 'bed 2',
    booked: false,
    updatedAt: '2018-09-26T15:47:47.582Z',
    createdAt: '2018-09-26T15:47:47.582Z'
  },
];

export const editGuestHouseEpic = {
  editdata1: {
    id: 'ND56thdW',
    houseName: 'Bukoto Heights',
    location: 'Kampala, Uganda',
    bathRooms: '5',
    imageUrl: 'https://www.lol.com',
    rooms: [
      {
        roomName: 'Victoria suite',
        roomType: 'ensuited',
        bedCount: '1',
        id: 'bEu6thdW',
        isDeleted: false
      },
    ]
  },
  editdata2: {
    houseName: 'Bukoto Heights',
    location: 'Kampala, Uganda',
    bathRooms: '5',
    imageUrl: 'https://www.lol.com',
    rooms: [
      {
        roomName: 'Victoria suite',
        roomType: 'ensuited',
        bedCount: '1',
        id: 'invalid_bEuhdW',
        isDeleted: false
      },
    ]
  },
  editdata3: {
    houseName: 'Bukoto Heights',
    location: 'Kampala, Uganda',
    bathRooms: '5',
    imageUrl: 'https://www.lol.com',
    rooms: [
      {
        roomName: 'Victoria suite',
        roomType: 'ensuited',
        bedCount: '1',
        id: 'bEu6thdW',
      },
    ]
  },
  editdata4: {
    id: 'ND56thdW',
    houseName: 'Bukoto Heights',
    location: 'Kampala, Uganda',
    bathRooms: '5',
    imageUrl: 'https://www.lol.com',
    rooms: [
      {
        roomName: 'Victoria suite',
        roomType: 'ensuited',
        bedCount: '4',
        id: 'bEu6thdW',
      },
      {
        roomName: 'Victoria suite',
        roomType: 'ensuited',
        bedCount: '1',
      },
    ]
  },
  editdata5: {
    id: 'ND56thdW',
    houseName: 'Bukoto Heights',
    location: 'Kampala, Uganda',
    bathRooms: '5',
    imageUrl: 'https://www.lol.com',
    rooms: [
      {
        roomName: 'Victoria suite',
        roomType: 'ensuited',
        bedCount: '1',
      },
    ]
  },
};

// edit data two

export const GuestHouseEpicData = {
  id: 'Rh46thdW',
  houseName: 'Mutungo Heights',
  location: 'Kampala, Uganda',
  bathRooms: '2',
  imageUrl: 'https://www.lol.com',
  userId: '-TRUniplpknbbh',
  createdAt: '2018-09-26T15:47:47.576Z',
  updatedAt: '2018-09-26T15:47:47.576Z',
};

export const GuestHouseEpicRoomData = {
  id: 'sE3u6thdW',
  roomName: 'Rwenzori',
  roomType: 'ensuited',
  bedCount: '2',
  faulty: false,
  guestHouseId: 'Rh46thdW',
  createdAt: '2018-09-26T15:47:47.576Z',
  updatedAt: '2018-09-26T15:47:47.576Z',
};

export const GuestHouseEpicBedData = [
  {
    id: 10,
    roomId: 'sE3u6thdW',
    bedName: 'bed 3',
    booked: true,
    updatedAt: '2018-09-26T15:47:47.582Z',
    createdAt: '2018-09-26T15:47:47.582Z'
  },
  {
    id: 11,
    roomId: 'sE3u6thdW',
    bedName: 'bed 4',
    booked: true,
    updatedAt: '2018-09-26T15:47:47.582Z',
    createdAt: '2018-09-26T15:47:47.582Z'
  },
];

export const editGuestHouseEpicData = {
  editdata5: {
    houseName: 'Bukoto Heights',
    location: 'Kampala, Uganda',
    bathRooms: '5',
    imageUrl: 'https://www.lol.com',
    rooms: [
      {
        roomName: 'Victoria',
        roomType: 'ensuited',
        bedCount: '1',
        id: 'sE3u6thdW',
      },
    ]
  }
};

// edit data three


export const GuestHouseEpicData3 = {
  id: 'qN46thdW',
  houseName: 'Mutungo Heights',
  location: 'Kampala, Uganda',
  bathRooms: '2',
  imageUrl: 'https://www.lol.com',
  userId: '-TRUniplpknbbh',
  createdAt: '2018-09-26T15:47:47.576Z',
  updatedAt: '2018-09-26T15:47:47.576Z',
};

export const GuestHouseEpicRoomData3 = {
  id: 'Uf6j9TdW',
  roomName: 'Rwenzori',
  roomType: 'ensuited',
  bedCount: '2',
  faulty: false,
  guestHouseId: 'qN46thdW',
  createdAt: '2018-09-26T15:47:47.576Z',
  updatedAt: '2018-09-26T15:47:47.576Z',
};

export const GuestHouseEpicBedData3 = [
  {
    id: 6,
    roomId: 'Uf6j9TdW',
    bedName: 'bed 3',
    booked: false,
    updatedAt: '2018-09-26T15:47:47.582Z',
    createdAt: '2018-09-26T15:47:47.582Z'
  },
  {
    id: 7,
    roomId: 'Uf6j9TdW',
    bedName: 'bed 4',
    booked: true,
    updatedAt: '2018-09-26T15:47:47.582Z',
    createdAt: '2018-09-26T15:47:47.582Z'
  },
];

export const editGuestHouseEpicData3 = {
  editdata6: {
    houseName: 'Bukoto Heights',
    location: 'Kampala, Uganda',
    bathRooms: '5',
    imageUrl: 'https://www.lol.com',
    rooms: [
      {
        roomName: 'Victoria',
        roomType: 'ensuited',
        bedCount: '2',
        id: 'Uf6j9TdW',
      },
    ]
  }
};

export const editGuestHouseEpicData4 = {
  editdata7: {
    houseName: 'Bukoto Heights',
    location: 'Kampala, Uganda',
    bathRooms: '5',
    imageUrl: 'https://www.lol.com',
    rooms: [
      {
        roomName: 'Victoria',
        roomType: 'ensuited',
        bedCount: '2',
        id: 'Uf6j9TdW',
      },
      {
        roomName: 'Room To remove',
        roomType: 'ensuited',
        bedCount: '1',
        id: 'Uf6j7887se',
      },
    ],
  }
};
