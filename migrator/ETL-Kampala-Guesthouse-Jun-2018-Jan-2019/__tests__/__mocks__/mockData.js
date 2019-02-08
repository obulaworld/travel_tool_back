const mockData = require('.');

module.exports = [
  {
    A: 1,
    B: mockData.foundUser.name,
    C: 'Female',
    D: '2018-01-01T21:00:00.000Z',
    E: '2018-01-25T21:00:00.000Z',
    F: 24,
    G: 'JM',
    H: 'Marina',
    I: 'Yes',
    J: 'Booked'
  },
  {
    A: 3,
    B: mockData.foundUser.manager.name,
    C: 'Female',
    D: '2018-01-16T21:00:00.000Z',
    E: '2018-01-23T21:00:00.000Z',
    F: 7,
    G: 'JM',
    H: 'Ikoyi',
    I: 'Yes',
    J: 'Booked'
  },
  {
    A: 4,
    B: mockData.firstUser.name,
    C: 'Female',
    D: '2018-01-17T21:00:00.000Z',
    E: '2018-01-27T21:00:00.000Z',
    F: 10,
    G: 'JM',
    H: 'Lekki',
    I: 'Yes',
    J: 'Booked'
  },
  {
    A: 5,
    B: mockData.user503.name,
    C: 'Female',
    D: '2018-01-20T21:00:00.000Z',
    E: '2018-01-26T21:00:00.000Z',
    F: 6,
    G: 'JM',
    H: 'Ikeja'
  },
  {
    A: 6,
    B: mockData.userWithoutManager.name,
    C: 'Female',
    D: '2018-01-20T21:00:00.000Z',
    E: '2018-01-27T21:00:00.000Z',
    F: 7,
    G: 'JM',
    H: 'Bariga'
  },
  {
    A: 1,
    B: mockData.userNotFoundInBambooHR.name,
    C: 'Male',
    D: '2018-01-27T21:00:00.000Z',
    E: '2018-02-09T21:00:00.000Z',
    F: 13,
    G: 'JM',
    H: 'Badagry',
    I: 'Yes'
  }
];
