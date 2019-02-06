const mockData = require('./__mocks__');
const constants = require('../constants');
const { beginMigration } = require('../migrator');
const axios = require('../__mocks__/mockAxios');

jest.setTimeout(90000000);

describe('Migrations', () => {
  beforeAll(async (done) => {
    await beginMigration();
    done();
  });

  it('should contain bearer token', () => {
    expect(axios.getBearerToken()).toEqual('Bearer test token');
  });

  it('should return user details from bambooHR and Andela Production API', async (done) => {
    const response = await axios.get(`${constants.productionAPI}?name=Found User`);
    expect(response.data.values[0].name).toEqual(mockData.foundUser.name);
    expect(response.data.values[0].bamboo_hr_id).toEqual(mockData.foundUser.bamboo_hr_id);
    expect(response.data.values[0].department).toEqual(mockData.foundUser.department);
    expect(response.data.values[0].gender).toEqual(mockData.foundUser.gender);
    expect(response.data.values[0].location).toEqual(mockData.foundUser.location);
    expect(response.data.values[0].id).toEqual(mockData.foundUser.id);
    done();
  });
});
