import request from 'supertest';
import app from '../../../app';
import models from '../../../database/models';
import {
  postGuestHouse
} from '../../guestHouse/__tests__/mocks/guestHouseData';
import {
  requestsData,
  tripsData,
  checkInData,
  checkOutData,
} from './mocks/tripData';
import {
  role,
} from '../../userRole/__tests__/mocks/mockData';
import Utils from '../../../helpers/Utils';

global.io = {
  sockets: {
    emit: jest.fn()
  }
};

const travelAdminpayload = {
  UserInfo: {
    id: '-MUyHJmKrxA90lPNQ1FOLNm',
    fullName: 'John Snow',
    email: 'john.snow@andela.com',
    name: 'John Snow',
    picture: ''
  },
};
const requesterPayload = {
  UserInfo: {
    id: '-AVwHJmKrxA90lPNQ1FOLNn',
    fullName: 'Jack Sparrow',
    email: 'jack.sparrow@andela.com',
    name: 'Jack',
    picture: ''
  },
};

const token = Utils.generateTestToken(travelAdminpayload);
const requesterToken = Utils.generateTestToken(requesterPayload);

describe('Test Suite for Trips Controller', () => {
  beforeAll(async () => {
    await models.Role.destroy({ truncate: true, cascade: true });
    await models.Role.bulkCreate(role);
    await models.User.destroy({ truncate: true, cascade: true });
    process.env.DEFAULT_ADMIN = 'john.snow@andela.com';
  });
  afterAll(async () => {
    await models.Role.destroy({ truncate: true, cascade: true });
    await models.User.destroy({ truncate: true, cascade: true });
  });

  describe('Setup users', () => {
    it('should add a new user to the database', (done) => {
      request(app)
        .post('/api/v1/user')
        .set('Content-Type', 'application/json')
        .set('authorization', token)
        .send({
          fullName: 'John Show',
          email: 'john.snow@andela.com',
          userId: '-MUyHJmKrxA90lPNQ1FOLNm',
        })
        .expect(201)
        .end((err, res) => {
          expect(res.body.result).toHaveProperty('fullName');
          expect(res.body.result).toHaveProperty('email');
          expect(res.body.success).toEqual(true);
          if (err) return done(err);
          done();
        });
    });
    it('should add requester user to the database', (done) => {
      request(app)
        .post('/api/v1/user')
        .set('Content-Type', 'application/json')
        .set('authorization', token)
        .send({
          fullName: 'Jack Sparrow',
          email: 'jack.sparrow@andela.com',
          userId: '-AVwHJmKrxA90lPNQ1FOLNn',
        })
        .expect(201)
        .end((err, res) => {
          expect(res.body.result).toHaveProperty('fullName');
          expect(res.body.result).toHaveProperty('email');
          expect(res.body.success).toEqual(true);
          if (err) return done(err);
          done();
        });
    });
    it('should change user to admin', (done) => {
      request(app)
        .put('/api/v1/user/admin')
        .set('Content-Type', 'application/json')
        .set('authorization', token)
        .end((err, res) => {
          expect(res.body.success).toEqual(true);
          expect(res.body.message)
            .toEqual('Your role has been Updated to a Super Admin');
          if (err) return done(err);
          done();
        });
    });
  });

  describe('Test suite for Trips API', () => {
    beforeAll(async (done) => {
      await models.GuestHouse.destroy({ truncate: true, cascade: true });
      await models.Request.destroy({ truncate: true, cascade: true });
      request(app)
        .post('/api/v1/guesthouses')
        .set('Content-Type', 'application/json')
        .set('authorization', token)
        .send(postGuestHouse)
        .end(async () => {
          await models.Request.bulkCreate(requestsData);
          await models.Trip.bulkCreate(tripsData);
          done();
        });
    });
    afterAll(async (done) => {
      await models.GuestHouse.destroy({ truncate: true, cascade: true });
      await models.Request.destroy({ truncate: true, cascade: true });
      await models.Notification.destroy({ truncate: true, cascade: true });
      await models.User.destroy({ truncate: true, cascade: true });
      await models.UserRole.destroy({ truncate: true, cascade: true });
      done();
    });
    describe('Test Suite for Trips Check In / Out API: PUT ', () => {
      it('should return error message for an unauthenticated user', (done) => {
        request(app)
          .put('/api/v1/trips/1')
          .send({})
          .end((err, res) => {
            expect(res.statusCode).toEqual(401);
            expect(res.body.success).toEqual(false);
            expect(res.body.error).toEqual('Please provide a token');
            if (err) return done(err);
            done();
          });
      });

      it('should return error message if user is not owner of the request',
        (done) => {
          request(app)
            .put('/api/v1/trips/1')
            .send(checkInData)
            .set('Content-Type', 'application/json')
            .set('authorization', requesterToken)
            .end((err, res) => {
              expect(res.statusCode).toEqual(403);
              expect(res.body.success).toEqual(false);
              expect(res.body.message)
                .toEqual('You don\'t have access to this trip');
              if (err) return done(err);
              done();
            });
        });

      it('should return error if trip does not exist', (done) => {
        request(app)
          .put('/api/v1/trips/904')
          .set('Content-Type', 'application/json')
          .set('authorization', token)
          .send(checkInData)
          .end((err, res) => {
            expect(res.statusCode).toEqual(400);
            expect(res.body.success).toEqual(false);
            expect(res.body.message).toEqual('Trip does not exist');
            if (err) return done(err);
            done();
          });
      });

      it('should return error if checktype is not provided', (done) => {
        request(app)
          .put('/api/v1/trips/1')
          .set('Content-Type', 'application/json')
          .set('authorization', token)
          .send({})
          .end((err, res) => {
            expect(res.statusCode).toEqual(422);
            expect(res.body.success).toEqual(false);
            expect(res.body.errors[0].message)
              .toEqual('Check type is required');
            if (err) return done(err);
            done();
          });
      });

      it('should return error if check type is invalid', (done) => {
        request(app)
          .put('/api/v1/trips/1')
          .set('Content-Type', 'application/json')
          .set('authorization', token)
          .send({
            checkType: 'notValid'
          })
          .end((err, res) => {
            expect(res.statusCode).toEqual(422);
            expect(res.body.success).toEqual(false);
            expect(res.body.errors[0].message)
              .toEqual('checkType must be "checkIn" or "checkOut"');
            if (err) return done(err);
            done();
          });
      });

      it('should not allow checkin if request is not approved', (done) => {
        request(app)
          .put('/api/v1/trips/1')
          .set('Content-Type', 'application/json')
          .set('authorization', token)
          .send(checkInData)
          .end((err, res) => {
            expect(res.statusCode).toEqual(400);
            expect(res.body.success).toEqual(false);
            expect(res.body.message)
              .toEqual('This trip is not approved');
            if (err) return done(err);
            done();
          });
      });

      it(`should not update trip record to check out if user has not been
        checked in`, (done) => {
        request(app)
          .put('/api/v1/trips/2')
          .set('authorization', token)
          .send(checkOutData)
          .end((err, res) => {
            expect(res.statusCode).toEqual(400);
            expect(res.body.success).toEqual(false);
            expect(res.body.message)
              .toEqual('User has either checked out or not checked in');
            if (err) return done(err);
            done();
          });
      });

      it('should update trip record to check in', (done) => {
        request(app)
          .put('/api/v1/trips/2')
          .set('Content-Type', 'application/json')
          .set('authorization', token)
          .send(checkInData)
          .end((err, res) => {
            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toEqual(true);
            expect(res.body.trip.id).toEqual('2');
            expect(res.body.trip.checkStatus).toEqual('Checked In');
            if (err) return done(err);
            done();
          });
      });

      it(`should not update trip record to check in if user
        has been checked in`,
      (done) => {
        request(app)
          .put('/api/v1/trips/2')
          .set('authorization', token)
          .send(checkInData)
          .end((err, res) => {
            expect(res.statusCode).toEqual(400);
            expect(res.body.success).toEqual(false);
            expect(res.body.message).toEqual('User has already checked in');
            if (err) return done(err);
            done();
          });
      });

      it('should update trip record to check out successfully', (done) => {
        request(app)
          .put('/api/v1/trips/2')
          .set('authorization', token)
          .send(checkOutData)
          .end((err, res) => {
            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toEqual(true);
            expect(res.body.trip.id).toEqual('2');
            expect(res.body.trip.checkStatus).toEqual('Checked Out');
            if (err) return done(err);
            done();
          });
      });

      it(`should not update trip record to check out if user has been
       checked out`, (done) => {
        request(app)
          .put('/api/v1/trips/2')
          .set('authorization', token)
          .send(checkOutData)
          .end((err, res) => {
            expect(res.statusCode).toEqual(400);
            expect(res.body.success).toEqual(false);
            expect(res.body.message)
              .toEqual('User has either checked out or not checked in');
            if (err) return done(err);
            done();
          });
      });
    });

    describe('Test Suite for Trips API: GET', () => {
      it('should not return anything for a user with no approved request',
        (done) => {
          request(app)
            .get('/api/v1/trips')
            .set('Content-Type', 'application/json')
            .set('authorization', requesterToken)
            .send({})
            .end((err, res) => {
              expect(res.statusCode).toEqual(200);
              expect(res.body.success).toEqual(true);
              expect(res.body.trips).toEqual([]);
              if (err) return done(err);
              done();
            });
        });

      it('should return data for a user with approved requests', (done) => {
        request(app)
          .get('/api/v1/trips')
          .set('Content-Type', 'application/json')
          .set('authorization', token)
          .send({})
          .end((err, res) => {
            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toEqual(true);
            expect(res.body.trips.length).toEqual(2);
            expect(res.body.message).toEqual('Retrieved Successfully');
            if (err) return done(err);
            done();
          });
      });
    });
  });
});
