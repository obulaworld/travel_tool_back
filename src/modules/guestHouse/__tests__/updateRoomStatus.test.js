import request from 'supertest';
import app from '../../../app';
import Utils from '../../../helpers/Utils';
import models from '../../../database/models';
import { role } from '../../userRole/__tests__/mocks/mockData';
import {
  updateRoomFaultStatus,
  GuestHouseEpic,
  GuestHouseEpicRoom,
  GuestHouseEpicBed,
} from './mocks/guestHouseData';


const payload = {
  UserInfo: {
    id: '-TRUniplpknbbh',
    fullName: 'Collins Muru',
    email: 'collins.muru@andela.com',
  },
};

const token = Utils.generateTestToken(payload);
const invalidToken = 'YYTRYIM0nrbuy7tonfenu';


describe('Update the room fault status', () => {
  beforeAll(async (done) => {
    await models.Role.destroy({ truncate: true, cascade: true });
    await models.Role.bulkCreate(role);
    await models.User.destroy({ truncate: true, cascade: true });
    await models.UserRole.destroy({ truncate: true, cascade: true });
    process.env.DEFAULT_ADMIN = 'collins.muru@andela.com';
    request(app)
      .post('/api/v1/user')
      .set('authorization', token)
      .send({
        fullName: 'Collins Muru',
        email: 'collins.muru@andela.com',
        userId: '-TRUniplpknbbh',
      })
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });

  afterAll(async () => {
    await models.Role.destroy({ truncate: true, cascade: true });
    await models.User.destroy({ truncate: true, cascade: true });
    await models.GuestHouse.destroy({ truncate: true, cascade: true });
    await models.UserRole.destroy({ truncate: true, cascade: true });
  });

  describe('Unauthorized user', () => {
    it('returns an error if the user is not a travel admin', (done) => {
      request(app)
        .put('/api/v1/room/3vgvmM4qY6')
        .set('authorization', token)
        .send(updateRoomFaultStatus.room1)
        .expect(403)
        .end((err, res) => {
          expect(res.body.success).toEqual(false);
          expect(res.body.error)
            .toBe('You don\'t have access to perform this action');
          if (err) return done(err);
          done();
        });
    });

    it('returns an error if the user is not in the database', (done) => {
      request(app)
        .put('/api/v1/room/3vgvmM4qY6')
        .set('authorization', invalidToken)
        .send(updateRoomFaultStatus.room1)
        .expect(401)
        .end((err, res) => {
          expect(res.body.success).toEqual(false);
          expect(res.body.error).toBe('Token is not valid');
          if (err) return done(err);
          done();
        });
    });

    describe('Update user to a travel admin', () => {
      beforeAll((done) => {
        request(app)
          .put('/api/v1/user/admin')
          .set('Content-Type', 'application/json')
          .set('authorization', token)
          .end((err) => {
            if (err) return done(err);
            done();
          });
      });

      it('returns error if the room does not exist', (done) => {
        request(app)
          .put('/api/v1/room/3vgvmM4qY6')
          .set('authorization', token)
          .send(updateRoomFaultStatus.room1)
          .expect(400)
          .end((err, res) => {
            expect(res.body.success).toEqual(false);
            expect(res.body.message).toBe('The room does not exist');
            if (err) return done(err);
            done();
          });
      });

      describe('Update room fault status', () => {
        beforeAll(async (done) => {
          await models.Bed.destroy({ truncate: true, cascade: true });
          await models.Room.destroy({ truncate: true, cascade: true });
          await models.GuestHouse.destroy({ truncate: true, cascade: true });
          await models.GuestHouse.create(GuestHouseEpic);
          await models.Room.create(GuestHouseEpicRoom);
          await models.Bed.bulkCreate(GuestHouseEpicBed);
          done();
        });
        it('returns appropriate message if room is updated', (done) => {
          request(app)
            .put('/api/v1/room/bEu6thdW')
            .set('authorization', token)
            .send(updateRoomFaultStatus.room1)
            .expect(201)
            .end((err, res) => {
              expect(res.body.success).toEqual(true);
              expect(res.body.message).toBe('Room maintainance details updated successfully');
              if (err) return done(err);
              done();
            });
        });

        it('returns appropriate message if body of request is wrong', (done) => {
          request(app)
            .put('/api/v1/room/bEu6thdW')
            .set('authorization', token)
            .send(updateRoomFaultStatus.room2)
            .expect(400)
            .end((err, res) => {
              expect(res.body.success).toEqual(false);
              expect(res.body.message).toBe('Room status can only be true or false');
              if (err) return done(err);
              done();
            });
        });
      });
    });
  });
});
