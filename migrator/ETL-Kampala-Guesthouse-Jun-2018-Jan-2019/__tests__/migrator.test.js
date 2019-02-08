const migrator = require('../migrator');
const helpers = require('../helpers');

describe('helper methods tests', () => {
  const travelaUserObject = {
    fullName: 'Brice Nkengsa',
    email: 'brice.nkengsa@andela.com',
    userId: 'Lku1233556',
    passportName: 'Brice Nkengsa',
    department: 'Success',
    occupation: 'Software developer',
    location: 'US-NY',
    picture: 'www.com',
    gender: 'Male',
    supervisor_id: 25
  };

  const data = {
    A: 2,
    B: 'Brice Nkengsa',
    C: 'Male',
    D: '2018-02-03T21:00:00.000Z',
    E: '2018-02-10T21:00:00.000Z',
    F: 7,
    G: 'JM',
    H: 'Ikeja',
    I: 'Yes'
  };

  const requestObject = {
    id: 'request-id-1',
    name: 'Brice Nkengsa',
    manager: 'David Blair',
    gender: 'Male',
    department: 'Success',
    role: 'Software Developer',
    status: 'Verified',
    userId: 'Lku1233556',
    tripType: 'multi'
  };

  describe('handle location', () => {
    it('should return an andelan center', async (done) => {
      const expectedLocation = await helpers.getAndelaCenters(travelaUserObject.location);
      expect(expectedLocation).toEqual('New York, United States');
      done();
    });
  });

  describe('handle trip object', () => {
    it('should return trip object', () => {
      const expectedTripObject = migrator.getTripObject(data, 'request-id-1', travelaUserObject, 1);
      expect(expectedTripObject.requestId).toEqual('request-id-1');
      expect(expectedTripObject.origin).toEqual('US-NY');
      expect(expectedTripObject.destination).toEqual('Kampala, Uganda');
      expect(expectedTripObject.bedId).toEqual(1);
      expect(expectedTripObject.departureDate).toEqual('2018-02-03, 22:02:00');
      expect(expectedTripObject.returnDate).toEqual('2018-02-10, 22:02:00');
    });
  });

  describe('handle approvals', () => {
    it('should return approval object', () => {
      const expectedApprovalObject = migrator.getApprovalObject(requestObject);
      expect(expectedApprovalObject.requestId).toEqual('request-id-1');
      expect(expectedApprovalObject.approverId).toEqual('David Blair');
    });
  });
});
