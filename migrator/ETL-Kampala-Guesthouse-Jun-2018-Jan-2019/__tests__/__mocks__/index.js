const today = new Date();

const foundUser = {
  id: '-MGO_OR3f2kRv1KJ8aiZ',
  name: 'Found User',
  picture: 'https://link.to.awesome/picture.jpg',
  created_at: today,
  updated_at: today,
  email: 'found.user@andela.com',
  bamboo_hr_id: 722,
  department: 'TDD',
  supervisor: 'Found Users Manager',
  jobTitle: 'Software Developer',
  supervisorEId: 721,
  location: 'Nairobi, Kenya',
  gender: 'Female',
  manager: {
    bamboo_hr_id: 721,
    id: '-LGM_MW1r0kWi2LK9soX',
    name: 'Found Users Manager',
    picture: 'https://link.to.awesome/picture.jpg',
    created_at: today,
    updated_at: today,
    email: 'found.user.manager@andela.com',
    department: 'Success',
    supervisor: null,
    jobTitle: 'TSM',
    supervisorEId: null,
    location: 'US-CA'
  }
};

const userWithoutManager = {
  ...foundUser,
  id: '-NHP_1TUj4nDx2LJ8alA',
  name: 'User Without Manager',
  email: 'user.without.manager@andela.com',
  bamboo_hr_id: 2018,
  supervisor: 'Manager Who Is Not Found',
  supervisorEId: 2017,
  manager: undefined,
  location: 'US-DC'
};

const userWithInvalidBambooID = {
  ...userWithoutManager,
  id: '-PJN_7YUj-qDx2LJ8alA',
  name: 'Invalid Bamboo HR id',
  email: 'user.with.invalid.bamboo.id@andela.com',
  bamboo_hr_id: 0
};

const userNotFoundInBambooHR = {
  ...userWithoutManager,
  id: '-AJG_7VBj-qFv2LJ2wlA',
  name: 'Not found in BambooHR',
  email: 'user.not.found.bamboo@andela.com',
  bamboo_hr_id: 404
};

const user503 = {
  ...foundUser,
  id: '-AJG_7VBj-qFv2LJ2wlA',
  name: 'User Resulting in 503',
  email: 'user.503.but.found@andela.com',
  bamboo_hr_id: 503,
  supervisor: null,
  supervisorEId: null,
  manager: undefined
};

const firstUser = {
  ...user503,
  id: '-NHP1TEj4cDx2L_J5alK',
  bamboo_hr_id: 723,
  name: 'Data For Merging',
  email: 'data.for.merging@andela.com',
  location: 'US-NY'
};

module.exports = {
  foundUser,
  userWithoutManager,
  userWithInvalidBambooID,
  userNotFoundInBambooHR,
  user503,
  firstUser
};
