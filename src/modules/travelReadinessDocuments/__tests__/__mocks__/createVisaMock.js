const user = {
  id: '1000',
  fullName: 'Samuel Kubai',
  email: 'black.windows@andela.com',
  userId: '-MUyHJmKrxA90lPNQ1FOLNm',
  picture: 'Picture',
  location: 'Lagos',
  createdAt: '2018-08-16 012:11:52.181+01',
  updatedAt: '2018-08-16 012:11:52.181+01'
};

const payload = {
  UserInfo: {
    id: '-MUyHJmKrxA90lPNQ1FOLNm',
    name: 'Samuel Kubai'
  }
};

const validVisa = {
  visa:
    {
      entryType: 'Single',
      country: 'Kenya',
      dateOfIssue: '02-01-2018',
      expiryDate: '06-01-2018',
      cloudinaryUrl: 'https://res.cloudinary.com/ined/image/upload/v1538568663/Logo_blue_2x.png'
    }
};

const invalidDocument = {
  invalid:
    {
      entryType: 'H-2A',
      country: 'Kenya',
      dateOfIssue: '02-01-2018',
      expiryDate: '06-01-2018',
      cloudinaryUrl: 'https://res.cloudinary.com/ined/image/upload/v1538568663/Logo_blue_2x.png'
    }
};

const passport = {
  passport: {
    passportNumber: 'qw357etrty',
    nationality: 'kenyan',
    dateOfBirth: '1970-01-01',
    dateOfIssue: '2018-11-01',
    placeOfIssue: 'Kenya',
    expiryDate: '2029-11-01',
    cloudinaryUrl: 'https://res.cloudinary.com/dbk8ky2'
  }
};

export default {
  user, payload, validVisa, invalidDocument, passport
};
