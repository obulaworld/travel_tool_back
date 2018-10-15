import request from 'supertest';
import app from '../../../app';
import Utils from '../../../helpers/Utils';
import models from '../../../database/models';
import { updateRoomFaultStatus } from './mocks/guestHouseData';

const payload = {
  UserInfo: {
    id: '-TRUniolpknbnk',
    fullName: 'Collins Muru',
    email: 'collins.muru@andela.com',
  },
};

const token = Utils.generateTestToken(payload);


describe('Update the room fault status', () => {
  beforeAll((done) => {
    models.GuestHouse.sync({ force: true }); 
    process.env.DEFAULT_ADMIN = 'collins.muru@andela.com';
    request(app)
      .post('/api/v1/user')
      .set('authorization', token)
      .send({
        fullName: 'Collins Muru',
        email: 'collins.muru@andela.com',
        userId: '-TRUniolpknbnk',
      })
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });

  describe('Unauthorized user', () => {
    it('returns an error if the user is not a travel admin', (done) => {
      request(app)
        .put('/api/v1/room/3vgvmM4qY6')
        .set('authorization', token)
        .send(updateRoomFaultStatus.room1)
        .expect(401)
        .end((err, res) => {
          expect(res.body.success).toEqual(false);
          expect(res.body.message).toBe('Only a Travel Admin can edit fault status a Guest House');
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
    });
  });
});
