/* istanbul ignore file  */
const { URL } = require('url');
const constants = require('../constants');
const mockData = require('../__tests__/__mocks__');

const dataFromProd = arrayOfValues => ({
  data: {
    values: arrayOfValues || []
  }
});

const mockError = (statusCode) => {
  const error = new Error(`Request failed with status code ${statusCode}`);
  error.response = {
    status: statusCode
  };
  throw error;
};

const handle503 = jest
  .fn()
  .mockImplementationOnce(() => mockError(503))
  .mockImplementationOnce(() => mockError(503))
  .mockImplementationOnce(() => dataFromProd([{ ...mockData.user503 }]))
  .mockImplementationOnce(() => mockError(503))
  .mockImplementationOnce(() => mockError(503))
  .mockImplementationOnce(() => ({ data: { ...mockData.user503 } }));

const handleUserQuery = (name) => {
  switch (name) {
    case 'Data For Merging':
      return dataFromProd([{ ...mockData.firstUser }]);
    case 'Found User':
      return dataFromProd([{ ...mockData.foundUser, manager: undefined }]);
    case 'Not Found in Andela':
      return dataFromProd();
    case 'Invalid Bamboo HR id':
      return dataFromProd([{ ...mockData.userWithInvalidBambooID }]);
    case 'User Without Manager':
      return dataFromProd([{ ...mockData.userWithoutManager }]);
    case 'Not found in BambooHR':
      return dataFromProd([{ ...mockData.userNotFoundInBambooHR }]);
    case 'User Resulting in 503':
      return handle503();
    case 'Found Users Manager':
      return dataFromProd([{ ...mockData.foundUser.manager }]);
    default:
      return dataFromProd();
  }
};

const handleManagerQuery = (bambooId) => {
  switch (Number(bambooId)) {
    case 721:
      return dataFromProd([{ ...mockData.foundUser.manager }]);
    case 2018:
      return dataFromProd([{ ...mockData.userWithoutManager }]);
    case 2017:
      return dataFromProd();
    default:
      return dataFromProd();
  }
};

const handleAndelaAPI = (searchParams) => {
  const { value } = searchParams.entries().next();
  const [queryKey, queryValue] = value;
  switch (queryKey) {
    case 'name':
      return handleUserQuery(queryValue);
    case 'bamboo_hr_id':
      return handleManagerQuery(queryValue);
    default:
  }
};
const  getBearerToken = () => {
  return "Bearer test token";
};

const handleBambooAPI = (searchParams) => {
  switch (Number(searchParams.get('id'))) {
    case 722:
      return { data: mockData.foundUser };
    case 721:
      return { data: mockData.foundUser.manager };
    case 2018:
      return { data: mockData.userWithoutManager };
    case 2017:
      return { data: {} };
    case 503:
      return handle503();
    case 404:
      return mockError(404);
    case 723:
      return { data: { ...mockData.firstUser } };
    default:
      return { data: {} };
  }
};

const get = jest.fn((url) => {
  const { hostname, searchParams } = new URL(url);
  let resolveValue;
  switch (hostname) {
    case new URL(constants.productionAPI).hostname:
      resolveValue = handleAndelaAPI(searchParams);
      break;
    case new URL(constants.bambooHRAPI).hostname:
      resolveValue = handleBambooAPI(searchParams);
      break;
    default:
      break;
  }

  return Promise.resolve(resolveValue);
});

module.exports = {
  get,
  handle503,
  getBearerToken
};
