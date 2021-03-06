const passportDetail = {
  passport: {
    name: 'Michael Nthiwa',
    passportNumber: 'ABC123abc',
    nationality: 'kenyan',
    dateOfBirth: '11/06/1970',
    dateOfIssue: '11/06/1979',
    placeOfIssue: 'Kenya',
    expiryDate: '06/22/2018',
    cloudinaryUrl: 'https://res.cloudinary.com/dbk8ky24f/image/upload/v1543520867/oga7x8ewofyyirrlk9hv.jpg'
  }
};
const invalidPassportDetail = {
  passport: {
    name: 'Michael',
    passportNumber: 'A',
    nationality: 'kenyan',
    dateOfBirth: '11/06/1970',
    dateOfIssue: '11/06/1979',
    placeOfIssue: 'Kenya',
    expiryDate: '06/22/2018',
    cloudinaryUrl: 'https://res.cloudinary.com/dbk8ky24f/image/upload/v1543520867/oga7x8ewofyyirrlk9hv.jpg'
  }
};

const emptyPassportDetail = {
  passport: {
    name: '',
    nationality: '',
    dateOfBirth: '',
    dateOfIssue: '',
    placeOfIssue: '',
    expiryDate: '',
    cloudinaryUrl: ''
  }
};

const invalidCloudinaryPassportDetail = {
  passport: {
    name: 'Michael',
    passportNumber: 'ABC123abc',
    nationality: 'kenyan',
    dateOfBirth: '11/06/1970',
    dateOfIssue: '11/06/1979',
    placeOfIssue: 'Kenya',
    expiryDate: '06/22/2018',
    cloudinaryUrl: 'https://farm4.staticflickr.com/3894/15008518202_c265dfa55f_h'
  }
};

const invalidDate = {
  passport: {
    name: 'Mike',
    passportNumber: 'ABC123abczyej3',
    nationality: 'Kenyan ',
    dateOfBirth: '2018',
    dateOfIssue: '2015',
    placeOfIssue: 'Kenya',
    expiryDate: '2018',
    cloudinaryUrl: 'https://res.cloudinary.com/dbk8ky24f/image/upload/v1543520867/oga8ewofyyirrlk9hv.jpg'
  }
};
export default {
  passportDetail,
  invalidPassportDetail,
  emptyPassportDetail,
  invalidCloudinaryPassportDetail,
  invalidDate
};
