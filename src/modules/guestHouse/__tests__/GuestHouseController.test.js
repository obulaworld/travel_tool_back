import request from 'supertest';
import app from '../../../app';
import { postGuestHouse, postGuestHouse2 } from './mocks/guestHouseData';
import models from '../../../database/models';
import Utils from '../../../helpers/Utils';

const payload = {
  UserInfo: {
    id: '-MUyHJmKrxA90lPNQ1FOLNm',
    fullName: 'John Snow',
    email: 'john.snow@andela.com',
  },
};

const token = Utils.generateTestToken(payload);
describe('Guest Role Test', () => {
  beforeAll((done) => {
    process.env.DEFAULT_ADMIN = 'john.snow@andela.com';
    done();
  });
  it('should not save a new guest house if user does not exist', (done) => {
    request(app)
      .post('/api/v1/guesthouses')
      .set('Content-Type', 'application/json')
      .set('authorization', token)
      .send(postGuestHouse)
      .expect(400)
      .end((err, res) => {
        expect(res.body.success).toEqual(false);
        expect(res.body.message).toEqual('User not found in database');
        if (err) return done(err);
        done();
      });
  });

  afterAll((done) => {
    models.Role.destroy({ force: true, truncate: { cascade: true } });
    models.User.truncate();
    done();
  });


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
        expect(res.body.result[0]).toHaveProperty('fullName');
        expect(res.body.result[0]).toHaveProperty('email');
        expect(res.body.success).toEqual(true);
        if (err) return done(err);
        done();
      });
  });

  it('should not add new guest house if user is not a travel admin', (done) => {
    request(app)
      .post('/api/v1/guesthouses')
      .set('Content-Type', 'application/json')
      .set('authorization', token)
      .send(postGuestHouse)
      .expect(401)
      .end((err, res) => {
        expect(res.body.success).toEqual(false);
        expect(res.body.message).toEqual('Only a Travel Admin can create a Guest House');
        if (err) return done(err);
        done();
      });
  });

  it('should change user to admin', (done) => {
    request(app)
      .put('/api/v1/user/admin')
      .set('Content-Type', 'application/json')
      .set('authorization', token)
      .expect(200)
      .end((err, res) => {
        expect(res.body.success).toEqual(true);
        expect(res.body.message).toEqual('Your role has been Updated to a Super Admin');
        if (err) return done(err);
        done();
      });
  });
  it('should not add new guest house if image is not url', (done) => {
    request(app)
      .post('/api/v1/guesthouses')
      .set('Content-Type', 'application/json')
      .set('authorization', token)
      .send(postGuestHouse2)
      .expect(400)
      .end((err, res) => {
        expect(res.body.success).toEqual(false);
        expect(res.body.message).toEqual('Only Url allowed for Image');
        if (err) return done(err);
        done();
      });
  });

  it('should add a new guest house to the database', (done) => {
    request(app)
      .post('/api/v1/guesthouses')
      .set('Content-Type', 'application/json')
      .set('authorization', token)
      .send(postGuestHouse)
      .expect(201)
      .end((err, res) => {
        expect(res.body.success).toEqual(true);
        expect(res.body.message).toEqual('Guest House created successfully');
        if (err) return done(err);
        done();
      });
  });
});
