import request from 'supertest';
import app from '../../../app';
import models from '../../../database/models';
import {
  requestsData,
  tripsData,
  checkInData,
  checkOutData,
  travelAdmin,
  postGuestHouse
} from './mocks/tripData';
import {
  role,
} from '../../userRole/__tests__/mocks/mockData';
import Utils from '../../../helpers/Utils';
import NotificationEngine from '../../notifications/NotificationEngine';
import TripsController from '../TripsController';

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

const travelAdminPayload = {
  UserInfo: {
    id: '-LJV4b1QTDYewOtk5F65',
    fullName: 'Chris Brown',
    email: 'chris.brown@andela.com',
    name: 'Chris',
    picture: ''
  }
};

const token = Utils.generateTestToken(travelAdminpayload);
const requesterToken = Utils.generateTestToken(requesterPayload);
const travelAdminToken = Utils.generateTestToken(travelAdminPayload);

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
          picture: 'fakePicture.png',
          location: 'Lagos',
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
          picture: 'fakePicture.png',
          location: 'Lagos',
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
      await models.ChangedRoom.destroy({ truncate: true, cascade: true });
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
      await models.ChangedRoom.destroy({ truncate: true, cascade: true });
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
        const sendSurveyEmail = jest.spyOn(TripsController, 'sendSurveyEmail');
        request(app)
          .put('/api/v1/trips/2')
          .set('authorization', token)
          .send(checkOutData)
          .end((err, res) => {
            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toEqual(true);
            expect(res.body.trip.id).toEqual('2');
            expect(res.body.trip.checkStatus).toEqual('Checked Out');
            expect(sendSurveyEmail).toHaveBeenCalled();
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
            expect(res.body.trips.length).toEqual(3);
            expect(res.body.message).toEqual('Retrieved Successfully');
            if (err) return done(err);
            done();
          });
      });
    });

    describe('Test Suite for Trips Bed/Room: PUT', () => {
      beforeAll(async (done) => {
        try {
          const newUser = await models.User.create(travelAdmin);
          const userAdminRole = {
            userId: newUser.id,
            roleId: '29187'
          };
          await models.UserRole.create(userAdminRole);
          done();
        } catch (error) {
          done();
        }
      });

      it('should require a user token', (done) => {
        request(app)
          .put('/api/v1/trips/1/room')
          .send({})
          .end((err, res) => {
            expect(res.statusCode).toEqual(401);
            expect(res.body.success).toEqual(false);
            expect(res.body.error).toEqual('Please provide a token');
            if (err) return done(err);
            done();
          });
      });

      it('should not update if user is not a travel admin', (done) => {
        request(app)
          .put('/api/v1/trips/1/room')
          .set('Content-Type', 'application/json')
          .set('authorization', requesterToken)
          .send({
            bedId: 1
          })
          .end((err, res) => {
            expect(res.statusCode).toEqual(403);
            expect(res.body.success).toEqual(false);
            expect(res.body.message)
              .toEqual('Only a Travel Admin can perform this action');
            if (err) return done(err);
            done();
          });
      });

      it('should require bed id', (done) => {
        request(app)
          .put('/api/v1/trips/99/room')
          .set('Content-Type', 'application/json')
          .set('authorization', travelAdminToken)
          .send({})
          .end((err, res) => {
            expect(res.statusCode).toEqual(422);
            expect(res.body.success).toEqual(false);
            expect(res.body.errors[0].message)
              .toEqual('Bed id is required');
            if (err) return done(err);
            done();
          });
      });

      it('should require bed id to be a number', (done) => {
        request(app)
          .put('/api/v1/trips/99/room')
          .set('Content-Type', 'application/json')
          .set('authorization', travelAdminToken)
          .send({
            bedId: 'abc'
          })
          .end((err, res) => {
            expect(res.statusCode).toEqual(422);
            expect(res.body.success).toEqual(false);
            expect(res.body.errors[0].message)
              .toEqual('Bed id is required and must be a Number');
            if (err) return done(err);
            done();
          });
      });

      it('should require reason', (done) => {
        request(app)
          .put('/api/v1/trips/99/room')
          .set('Content-Type', 'application/json')
          .set('authorization', travelAdminToken)
          .send({
            bedId: 1
          })
          .end((err, res) => {
            expect(res.statusCode).toEqual(422);
            expect(res.body.success).toEqual(false);
            expect(res.body.errors[0].message)
              .toEqual('Reason for change is required');
            if (err) return done(err);
            done();
          });
      });

      it('should not update if trip id does not exist', (done) => {
        request(app)
          .put('/api/v1/trips/99/room')
          .set('Content-Type', 'application/json')
          .set('authorization', travelAdminToken)
          .send({
            bedId: 1,
            reason: 'reason'
          })
          .end((err, res) => {
            expect(res.statusCode).toEqual(400);
            expect(res.body.success).toEqual(false);
            expect(res.body.message)
              .toEqual('Trip does not exist');
            if (err) return done(err);
            done();
          });
      });

      it('should not update if bed id does not exist', (done) => {
        request(app)
          .put('/api/v1/trips/1/room')
          .set('Content-Type', 'application/json')
          .set('authorization', travelAdminToken)
          .send({
            bedId: 24,
            reason: 'reason'
          })
          .end((err, res) => {
            expect(res.statusCode).toEqual(400);
            expect(res.body.success).toEqual(false);
            expect(res.body.message)
              .toEqual('Bed does not exist');
            if (err) return done(err);
            done();
          });
      });

      it('should not update if bed is not available', (done) => {
        request(app)
          .put('/api/v1/trips/1/room')
          .set('Content-Type', 'application/json')
          .set('authorization', travelAdminToken)
          .send({
            bedId: 1,
            reason: 'reason'
          })
          .end((err, res) => {
            expect(res.statusCode).toEqual(400);
            expect(res.body.success).toEqual(false);
            expect(res.body.message)
              .toEqual('Bed is currently unavailable');
            if (err) return done(err);
            done();
          });
      });

      it('should not update if trip is checked out', (done) => {
        request(app)
          .put('/api/v1/trips/4/room')
          .set('Content-Type', 'application/json')
          .set('authorization', travelAdminToken)
          .send({
            bedId: 2,
            reason: 'reason'
          })
          .end((err, res) => {
            expect(res.statusCode).toEqual(400);
            expect(res.body.success).toEqual(false);
            expect(res.body.message)
              .toEqual('This trip is already checked out');
            if (err) return done(err);
            done();
          });
      });


      it('should not update if room is faulty', async (done) => {
        const bed = await models.Bed.findById(2);
        const room = await models.Room.findById(bed.roomId);
        room.faulty = true;
        await room.save();
        request(app)
          .put('/api/v1/trips/1/room')
          .set('Content-Type', 'application/json')
          .set('authorization', travelAdminToken)
          .send({
            bedId: 2,
            reason: 'reason'
          })
          .end(async (err, res) => {
            expect(res.statusCode).toEqual(400);
            expect(res.body.success).toEqual(false);
            expect(res.body.message)
              .toEqual('Room is currently faulty');
            room.faulty = false;
            await room.save();
            if (err) return done(err);
            done();
          });
      });

      it('should not update room if occupied by opposite sex', (done) => {
        request(app)
          .put('/api/v1/trips/1/room')
          .set('Content-Type', 'application/json')
          .set('authorization', travelAdminToken)
          .send({
            bedId: 5,
            reason: 'reason'
          })
          .end((err, res) => {
            expect(res.statusCode).toEqual(409);
            expect(res.body.success).toEqual(false);
            expect(res.body.message)
              .toEqual('Room is currently occupied or booked by the opposite gender');
            if (err) return done(err);
            done();
          });
      });

      it('should update room/bed record for a trip', (done) => {
        const notifySpy = jest.spyOn(NotificationEngine, 'notify');
        const sendMailSpy = jest.spyOn(NotificationEngine, 'sendMail');
        request(app)
          .put('/api/v1/trips/1/room')
          .set('Content-Type', 'application/json')
          .set('authorization', travelAdminToken)
          .send({
            bedId: 2,
            reason: 'reason'
          })
          .end((err, res) => {
            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toEqual(true);
            expect(res.body.message)
              .toEqual('Updated Successfully');
            expect(res.body.trip.id).toBe('1');
            expect(res.body.trip.bedId).toBe(2);
            expect(notifySpy).toHaveBeenCalled();
            expect(sendMailSpy).toHaveBeenCalled();
            if (err) return done(err);
            done();
          });
      });

      it('should save the reason in the changed room table', async (done) => {
        const changedRoom = await models.ChangedRoom.findOne({
          where: {
            tripId: '1',
            bedId: 2
          }
        });
        expect(changedRoom.reason).toBe('reason');
        done();
      });
    });
  });
});
