module.exports = {
  up: queryInterface => queryInterface.bulkInsert('Requests',
    [
      {
        id: 'request-id-1',
        name: 'Lazuli Doe',
        status: 'Approved',
        gender: 'Female',
        manager: 'John Mutuma',
        department: 'TDD',
        role: 'Senior Consultant',
        tripType: 'multi',
        picture: 'test.photo.test',
        createdAt: '2018-08-16 012:11:52.181+01',
        updatedAt: '2018-08-16 012:11:52.181+01',
        userId: '-LJV4b1QTCYewOtk5F63'
      },
      {
        id: 'request-id-2',
        name: 'Mark Doe',
        status: 'Approved',
        gender: 'Male',
        manager: 'John Mutuma',
        department: 'TDD',
        role: 'Senior Consultant',
        tripType: 'multi',
        picture: 'test.photo.test',
        createdAt: '2018-08-16 012:11:52.181+01',
        updatedAt: '2018-08-16 012:11:52.181+01',
        userId: '-LJV4b1QTCYewOtk5F63'
      },
      {
        id: 'request-id-3',
        name: 'Alice Doe',
        status: 'Approved',
        gender: 'Female',
        manager: 'John Mutuma',
        department: 'TDD',
        role: 'Senior Consultant',
        tripType: 'multi',
        picture: 'test.photo.test',
        createdAt: '2018-08-16 012:11:52.181+01',
        updatedAt: '2018-08-16 012:11:52.181+01',
        userId: '-LJV4b1QTCYewOtk5F63'
      },
      {
        id: 'request-id-4',
        name: 'Snow Doe',
        status: 'Approved',
        gender: 'Female',
        manager: 'John Mutuma',
        department: 'TDD',
        role: 'Senior Consultant',
        tripType: 'multi',
        picture: 'test.photo.test',
        createdAt: '2018-08-16 012:11:52.181+01',
        updatedAt: '2018-08-16 012:11:52.181+01',
        userId: '-LJV4b1QTCYewOtk5F63'
      },
      {
        id: 'request-id-5',
        name: 'Tommy Stout',
        status: 'Approved',
        gender: 'Male',
        manager: 'John Mutuma',
        department: 'TDD',
        role: 'Senior Consultant',
        tripType: 'multi',
        picture: 'test.photo.test',
        createdAt: '2018-08-16 012:11:52.181+01',
        updatedAt: '2018-08-16 012:11:52.181+01',
        userId: '-LJV4b1QTCYewOtk5F63'
      }
    ], {}),

  down: queryInterface => queryInterface.bulkDelete('Requests', null, {})
};
