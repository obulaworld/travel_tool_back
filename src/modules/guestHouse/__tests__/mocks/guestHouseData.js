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

