module.exports = {
  up: queryInterface => queryInterface.bulkInsert('Documents',
    [
      {
        id: '1',
        name: 'passport',
        cloudinary_public_id: 'e93h236FvT',
        cloudinary_url: 'https://image.url',
        userId: '-LMgZQKq6MXAj_41iRWi',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        name: 'visa',
        cloudinary_public_id: 'eDjweu4I236FvT',
        cloudinary_url: 'https://image.url',
        userId: '-LMgZQKq6MXAj_41iRWi',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '3',
        name: 'yellow card',
        cloudinary_public_id: 'e93hywtEFvT',
        cloudinary_url: 'https://image.url',
        userId: '-LMgZQKq6MXAj_41iRWi',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {}),
  down: queryInterface => queryInterface
    .bulkDelete('Documents', new Date('2023-10-12'), {})
};
