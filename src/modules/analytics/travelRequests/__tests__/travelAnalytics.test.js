import request from 'supertest';
import app from '../../../../app';
import models from '../../../../database/models';
import { role } from '../../../userRole/__tests__/mocks/mockData';
import Utils from '../../../../helpers/Utils';
import {
  userRole,
  travelAdmin,
  travelRequester,
  requestsData,
  tripsData,
  postGuestHouse,
  userPayload,
  travelAdminPayload,
  analyticsResopnse
} from '../__mocks__/travelAnalyticsData';

const travelAdminToken = Utils.generateTestToken(travelAdminPayload);
const travellerToken = Utils.generateTestToken(userPayload);

describe('Test for travel analytics by location', () => {
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
    const user = await models.User.create(travelAdmin);
    await models.User.create(travelRequester);
    await models.UserRole.create(userRole);
    request(app)
      .post('/api/v1/guesthouses')
      .set('Content-Type', 'application/json')
      .set('authorization', travelAdminToken)
      .send(postGuestHouse)
      .end(async () => {
        const bed = await models.Bed.findOne({});
        await models.Request.bulkCreate(requestsData);
        await models.Trip.bulkCreate(tripsData(bed.id));
        done();
      });
    process.env.DEFAULT_ADMIN = 'captain.america@andela.com';
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

  it('should require a user to be authenticated', (done) => {
    request(app)
      .get('/api/v1/analytics')
      .end((err, res) => {
        expect(res.statusCode).toEqual(401);
        expect(res.body.success).toEqual(false);
        expect(res.body.error).toEqual('Please provide a token');
        if (err) return done(err);
        done();
      });
  });

  it('should require one to be a travel admin', (done) => {
    request(app)
      .get('/api/v1/analytics')
      .set('Content-Type', 'application/json')
      .set('authorization', travellerToken)
      .end((err, res) => {
        expect(res.statusCode).toEqual(403);
        expect(res.body.success).toEqual(false);
        expect(res.body.error).toEqual("You don't have access to perform this action");
        if (err) return done(err);
        done();
      });
  });

  it(' should display details of travel admin for Nairobi', (done) => {
    request(app)
      .get('/api/v1/analytics')
      .set('Content-Type', 'application/json')
      .set('authorization', travelAdminToken)
      .end((err, res) => {
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toEqual(true);
        expect(res.body).toEqual(analyticsResopnse);
        if (err) return done(err);
        done();
      });
  });

  it('should filter by date', (done) => {
    request(app)
      .get('/api/v1/analytics')
      .set('Content-Type', 'application/json')
      .set('authorization', travelAdminToken)
      .end((err, res) => {
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toEqual(true);
        if (err) return done(err);
        done();
      });
  });

  it('should return a csv report file', (done) => {
    request(app)
      .get('/api/v1/analytics?type=file')
      .set('Content-Type', 'application/json')
      .set('authorization', travelAdminToken)
      .end((err, res) => {
        expect(res.statusCode).toEqual(200);
        expect(res.headers['content-type']).toEqual('text/csv; charset=utf-8');
        expect(res.headers['content-disposition']).toEqual(
          'attachment; filename="Travel Analysis Report.csv"'
        );
        expect(res.text).toContain('total_requests');
        if (err) return done(err);
        done();
      });
  });

  it('should return response in json format', (done) => {
    request(app)
      .get('/api/v1/analytics?type=json')
      .set('Content-Type', 'application/json')
      .set('authorization', travelAdminToken)
      .end((err, res) => {
        expect(res.statusCode).toEqual(200);
        expect(res.headers['content-type']).toEqual('application/json; charset=utf-8');
        expect(res.text).toContain('total_requests');
        if (err) return done(err);
        done();
      });
  });
});
