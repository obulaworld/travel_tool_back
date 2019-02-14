const listTravelStipendMock = {
  travelStipends: [
    {
      id: 1,
      stipend: 75,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: '-MUyHJmKrxA90lPNQ1FOLNm',
      centerId: 12345
    },
    {
      id: 2,
      stipend: 75,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: '-MUyHJmKrxA90lPNQ1FOLNm',
      centerId: 23456
    }
  ]

};

const user = {
  id: 1,
  fullName: 'Samuel Kubai',
  email: 'sam.kubai@andela.com',
  userId: '-MUyHJmKrxA90lPNQ1FOLNm',
  picture: 'Picture',
  location: 'Lagos',
  createdAt: '2019-02-11 012:11:52.181+01',
  updatedAt: '2019-02-11 012:11:52.181+01'
};

const payload = {
  UserInfo: {
    id: '-MUyHJmKrxA90lPNQ1FOLNm',
    email: 'sam.kubai@andela.com',
    name: 'Samuel Kubai'
  }
};

const userRole = [{
  id: 1,
  userId: 1,
  roleId: 10948,
  centerId: 12345,
  createdAt: new Date(),
  updatedAt: new Date()
}];

const listOfStipends = [
  {
    id: 100,
    amount: 75,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: '-MUyHJmKrxA90lPNQ1FOLNm',
    centerId: 12345
  },
  {
    id: 200,
    amount: 75,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: '-MUyHJmKrxA90lPNQ1FOLNm',
    centerId: 23456
  }
];
const centers = [
  {
    id: 12345,
    location: 'Lagos',
    createdAt: new Date(),
    updatedAt: new Date()

  },
  {
    id: 23456,
    location: 'Kampala',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 54675,
    location: 'Nairobi',
    createdAt: new Date(),
    updatedAt: new Date()
  },
];

export default {
  listTravelStipendMock, user, payload, userRole, centers, listOfStipends
};
