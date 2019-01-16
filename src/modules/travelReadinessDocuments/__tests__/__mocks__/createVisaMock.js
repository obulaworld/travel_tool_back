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
      visaType: 'H-2A',
      cloudinaryUrl: 'https://res.cloudinary.com/ined/image/upload/v1538568663/Logo_blue_2x.png'
    }
};

const validVisa2 = {
  visa:
  {
    entryType: 'Multiple',
    country: 'Nigeria',
    dateOfIssue: '02-01-2018',
    expiryDate: '06-01-2018',
    visaType: 'H-2A',
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
      visaType: 'H-2A',
      cloudinaryUrl: 'https://res.cloudinary.com/ined/image/upload/v1538568663/Logo_blue_2x.png'
    },
  countyMissing:
   {
     visa: {
       entryType: 'Multiple',
       name: 'Permit',
       dateOfIssue: '02-01-2018',
       expiryDate: '06-01-2018',
       visaType: 'H-2A',
       cloudinaryUrl: 'https://res.cloudinary.com/ined/image/upload/v1538568663/Logo_blue_2x.png'
     }
   }
};

const passport = {
  passport: {
    name: 'Mike',
    passportNumber: 'ABC123ab',
    nationality: 'Kenyan ',
    dateOfBirth: '2018/11/02',
    dateOfIssue: '2017/11/01',
    placeOfIssue: 'Kenya',
    expiryDate: '2018/11/01',
    cloudinaryUrl: 'https://res.cloudinary.com/dbk8ky24f/image/upload/v1543520867/oga8ewofyyirrlk9hv.jpg'
  }
};

export default {
  user, payload, validVisa, validVisa2, invalidDocument, passport
};
