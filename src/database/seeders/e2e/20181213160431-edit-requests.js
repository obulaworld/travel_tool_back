/* eslint-disable */

module.exports = {
  up: queryInterface => queryInterface.bulkInsert('Requests',
    [
      {
        id: 'request-id-1',
        name: 'Travela Test',
        status: 'Approved',
        gender: 'Female',
        manager: 'Travela Test',
        department: 'Talent & Development',
        role: 'Software developer',
        tripType: 'multi',
        picture: 'https://lh5.googleusercontent.com/-PbuF53uxx4U/AAAAAAAAAAI/AAAAAAAAAAA/AGDgw-i0-XeoeYYk7TpfNBvulhV0oFM6eg/mo/photo.jpg?sz=50',
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: '-LSsFyueC086niFc9rrz',
        deletedAt: null
      },
      {
        id: 'request-id-2',
        name: 'Travela Test',
        status: 'Rejected',
        gender: 'Female',
        manager: 'Travela Test',
        department: 'Talent & Development',
        role: 'Software developer',
        tripType: 'multi',
        picture: 'https://lh5.googleusercontent.com/-PbuF53uxx4U/AAAAAAAAAAI/AAAAAAAAAAA/AGDgw-i0-XeoeYYk7TpfNBvulhV0oFM6eg/mo/photo.jpg?sz=50',
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: '-LSsFyueC086niFc9rrz',
        deletedAt: null
      },
      {
        id: 'request-id-3',
        name: 'Travela Test',
        status: 'Verified',
        gender: 'Female',
        manager: 'Travela Test',
        department: 'Talent & Development',
        role: 'Software developer',
        tripType: 'multi',
        picture: 'https://lh5.googleusercontent.com/-PbuF53uxx4U/AAAAAAAAAAI/AAAAAAAAAAA/AGDgw-i0-XeoeYYk7TpfNBvulhV0oFM6eg/mo/photo.jpg?sz=50',
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: '-LSsFyueC086niFc9rrz',
        deletedAt: null
      },
    ],
    {},
  ),

  down: queryInterface => queryInterface.bulkDelete('Requests', null, {})
};
