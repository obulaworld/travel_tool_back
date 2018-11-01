import request from 'supertest';
import models from '../../../../database/models';
import app from '../../../../app';
import { role } from '../../../userRole/__tests__/mocks/mockData';
import {
  travelAdmin, userRole,
  travelRequester, tripsData, requestsData,
  postGuestHouse
} from './mocks/mockData';
import Utils from '../../../../helpers/Utils';

global.io = {
  sockets: {
    emit: (event, dataToBeEmitted) => dataToBeEmitted,
  },
};

const normalUser = {
  UserInfo: {
    id: '-AVwHJmKrxA90lPNQ1Fjkl',
    fullName: 'Odi Dance',
    email: 'odi.dance@andela.com',
    name: 'Odi',
    picture: ''
  },
};
const adminUser = {
  UserInfo: {
    id: '-HyfghjTUGfghjkIJM',
    fullName: 'Miguna Miguna',
    email: 'travel.admin@andela.com',
    name: 'Travel Admin',
    picture: ''
  },
};
const userToken = Utils.generateTestToken(normalUser);
const adminToken = Utils.generateTestToken(adminUser);
describe('Test Suite for Trips Analytics => Get Travel Readiness of requesters)', () => {
  beforeAll(async (done) => {
    await models.GuestHouse.destroy({ truncate: true, cascade: true });
    await models.Room.destroy({ truncate: true, cascade: true });
    await models.Bed.destroy({ truncate: true, cascade: true });
    await models.Role.destroy({ truncate: true, cascade: true });
    await models.User.destroy({ truncate: true, cascade: true });
    await models.UserRole.destroy({ truncate: true, cascade: true });
    await models.Request.destroy({ truncate: true, cascade: true });
    await models.Trip.destroy({ truncate: true, cascade: true });
    await models.Role.bulkCreate(role);
    await models.User.create(travelAdmin);
    await models.User.create(travelRequester);
    await models.UserRole.create(userRole);
    request(app)
      .post('/api/v1/guesthouses')
      .set('Content-Type', 'application/json')
      .set('authorization', adminToken)
      .send(postGuestHouse)
      .end(async () => {
        const bed = await models.Bed.findOne({});
        await models.Request.bulkCreate(requestsData);
        await models.Trip.bulkCreate(tripsData(bed.id));
        done();
      });
    process.env.DEFAULT_ADMIN = 'richy.richy@andela.com';
  });
  afterAll(async () => {
    await models.GuestHouse.destroy({ truncate: true, cascade: true });
    await models.Room.destroy({ truncate: true, cascade: true });
    await models.Bed.destroy({ truncate: true, cascade: true });
    await models.Role.destroy({ truncate: true, cascade: true });
    await models.User.destroy({ truncate: true, cascade: true });
    await models.UserRole.destroy({ truncate: true, cascade: true });
    await models.Request.destroy({ truncate: true, cascade: true });
    await models.Trip.destroy({ truncate: true, cascade: true });
  });
  it('should require a user to be authenticated', async (done) => {
    request(app)
      .get('/api/v1/analytics/readiness?page=1&limit=3')
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        expect(res.statusCode).toEqual(401);
        expect(res.body.success).toEqual(false);
        expect(res.body.error).toEqual('Please provide a token');
        if (err) return done(err);
        done();
      });
  });
  it('should require user to be a travel Admin', (done) => {
    request(app)
      .get('/api/v1/analytics/readiness?page=1&limit=3&type=json')
      .set('Content-Type', 'application/json')
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res.statusCode).toEqual(403);
        expect(res.body.success).toEqual(false);
        expect(res.body.error).toEqual('You don\'t have access to perform this action');
        if (err) return done(err);
        done();
      });
  });
  it('should return 200 status, travel readiness and pagination data', (done) => {
    request(app)
      .get('/api/v1/analytics/readiness?page=1&limit=3&type=json')
      .set('Content-Type', 'application/json')
      .set('authorization', adminToken)
      .end((err, res) => {
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toEqual(true);
        // console.log('..............................', res);
        expect(res.body.readiness[0].request.name).toEqual('Kongo Love');
        expect(res.body.readiness[1].travelReadiness).toEqual('0% complete');
        expect(res.body.readiness[2].arrivalDate).toEqual('2018-10-29T00:00:00.000Z');
        done();
      });
  });
  it('should return csv data when type is set to file', (done) => {
    request(app)
      .get('/api/v1/analytics/readiness?page=1&limit=3&type=file')
      .set('Content-Type', 'application/json')
      .set('authorization', adminToken)
      .end((err, res) => {
        expect(res.statusCode).toEqual(200);
        expect(res.header['content-type']).toBe('application/octet-stream; charset=utf-8');
        expect(res.header['content-disposition']).toBe(
          'attachment; filename="Travel readiness for all travelers"'
        );
        if (err) return done(err);
        done();
      });
  });
});
