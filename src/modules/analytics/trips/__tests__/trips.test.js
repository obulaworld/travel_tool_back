
import request from 'supertest';
import app from '../../../../app';
import models from '../../../../database/models';
import {
  requesterPayload,
  travelAdminPayload,
  userRole,
  travelAdmin,
  travelRequester,
  requestsData,
  tripsData,
  postGuestHouse,
  tripsReportResponse
} from '../__mocks__/tripsData';
import {
  role,
} from '../../../userRole/__tests__/mocks/mockData';
import Utils from '../../../../helpers/Utils';

const requesterToken = Utils.generateTestToken(requesterPayload);
const travelAdminToken = Utils.generateTestToken(travelAdminPayload);

describe('Test Suite for Trips Analytics (Get Trips / Month by Department)', () => {
  beforeAll(async () => {
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
    await request(app)
      .post('/api/v1/guesthouses')
      .set('Content-Type', 'application/json')
      .set('authorization', travelAdminToken)
      .send(postGuestHouse);
    const bed = models.Bed.findOne({});
    await models.Request.bulkCreate(requestsData);
    await models.Trip.bulkCreate(tripsData(bed.id));
    process.env.DEFAULT_ADMIN = 'john.snow@andela.com';
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
  it('should require a user token', (done) => {
    request(app)
      .get('/api/v1/analytics/trips/departments')
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
      .get('/api/v1/analytics/trips/departments')
      .set('Content-Type', 'application/json')
      .set('authorization', requesterToken)
      .end((err, res) => {
        expect(res.statusCode).toEqual(403);
        expect(res.body.success).toEqual(false);
        expect(res.body.error).toEqual('You don\'t have access to perform this action');
        if (err) return done(err);
        done();
      });
  });

  it('should require filterBy and type in the query parameter', (done) => {
    request(app)
      .get('/api/v1/analytics/trips/departments')
      .set('Content-Type', 'application/json')
      .set('authorization', travelAdminToken)
      .end((err, res) => {
        expect(res.statusCode).toEqual(422);
        expect(res.body.success).toEqual(false);
        expect(res.body.errors[0].message)
          .toEqual('filterBy is required');
        expect(res.body.errors[1].message)
          .toEqual('filterBy must be "month"');
        expect(res.body.errors[2].message)
          .toEqual('type is required');
        expect(res.body.errors[3].message)
          .toEqual('type must be "json" or "file"');
        if (err) return done(err);
        done();
      });
  });

  it('should get trips from admin location', (done) => {
    request(app)
      .get('/api/v1/analytics/trips/departments?filterBy=month&type=json')
      .set('Content-Type', 'application/json')
      .set('authorization', travelAdminToken)
      .end((err, res) => {
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toEqual(true);
        expect(res.body.data).toEqual(tripsReportResponse);
        if (err) return done(err);
        done();
      });
  });

  it('should return csv file', (done) => {
    request(app)
      .get('/api/v1/analytics/trips/departments?filterBy=month&type=file')
      .set('Content-Type', 'application/json')
      .set('authorization', travelAdminToken)
      .end((err, res) => {
        expect(res.statusCode).toEqual(200);
        expect(res.header['content-type']).toBe('text/csv; charset=utf-8');
        expect(res.header['content-disposition']).toBe(
          'attachment; filename="Departmental Trips Per Month Report.csv"'
        );
        if (err) return done(err);
        done();
      });
  });
});
