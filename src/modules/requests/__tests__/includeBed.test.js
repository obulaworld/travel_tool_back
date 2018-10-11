import request from 'supertest';
import models from '../../../database/models';
import app from '../../../app';
import {
  newRequest as secondRequest,
  travelAdmin,
} from './mocks/mockData';
import {
  postGuestHouse
} from '../../guestHouse/__tests__/mocks/guestHouseData';
import Utils from '../../../helpers/Utils';

global.io = {
  sockets: {
    emit: (event, dataToBeEmitted) => dataToBeEmitted
  }
};
const travelAdminPayload = {
  UserInfo: {
    id: travelAdmin.userId,
    name: travelAdmin.fullName,
    email: travelAdmin.email,
    picture: 'this picture'
  },
};

const travelAdminToken = Utils.generateTestToken(travelAdminPayload);


describe('Get an authenticated User Request detail', () => {
  beforeAll(async (done) => {
    process.env.DEFAULT_ADMIN = 'travel.admin@andela.com';
    await models.User.create(travelAdmin);
    request(app)
      .put('/api/v1/user/admin')
      .set('Content-Type', 'application/json')
      .set('authorization', travelAdminToken)
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });
  it('should return accomodation details as part of the trip details',
    async () => {
      const postResp = await request(app)
        .post('/api/v1/guesthouses')
        .set('Content-Type', 'application/json')
        .set('authorization', travelAdminToken)
        .send(postGuestHouse);
      const bedRequest = await request(app)
        .post('/api/v1/requests')
        .set('Content-Type', 'application/json')
        .set('authorization', travelAdminToken)
        .send({
          ...secondRequest,
          trips: [{
            ...secondRequest.trips[0],
            bedId: postResp.body.bed[0][0].id
          }]
        });


      const bedRequestId = bedRequest.body.request.id;
      const getTrips = await request(app)
        .get(`/api/v1/requests/${bedRequestId}`)
        .set('Content-Type', 'application/json')
        .set('authorization', travelAdminToken);
      expect(
        getTrips.body.requestData.trips[0].beds.rooms.guestHouses.houseName
      ).toEqual('Mini flat');
      expect(
        getTrips.body.requestData.trips[0].beds.rooms.roomName
      ).toEqual('big cutter');
      expect(getTrips.body.requestData.trips[0].beds.bedName).toEqual('bed 1');
    });
});
