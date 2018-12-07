import request from 'supertest';
import app from '../../../app';
import { postGuestHouse, postGuestHouse2 } from './mocks/guestHouseData';
import models from '../../../database/models';
import Utils from '../../../helpers/Utils';
import { role } from '../../userRole/__tests__/mocks/mockData';

const payload = {
  UserInfo: {
    id: '-MUyHJmKrxA90lPNQ1FOLNm',
    fullName: 'John Snow',
    email: 'john.snow@andela.com',
    picture: 'fakePicture.png'
  },
};

const token = Utils.generateTestToken(payload);
describe('Guest Role Test', () => {
  beforeAll(async (done) => {
    await models.Role.sync({ force: true });
    await models.Role.bulkCreate(role);
    await models.User.sync({ force: true });
    await models.UserRole.destroy({ force: true, truncate: { cascade: true } });
    process.env.DEFAULT_ADMIN = 'john.snow@andela.com';
    done();
  });
  afterAll(async (done) => {
    await models.Role.destroy({ force: true, truncate: { cascade: true } });
    await models.User.destroy({ force: true, truncate: { cascade: true } });
    await models.UserRole.destroy({ force: true, truncate: { cascade: true } });
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
        expect(res.body.message)
          .toEqual('You are not signed in to the application');
        if (err) return done(err);
        done();
      });
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

  it('should not add new guest house if user is not a travel admin', (done) => {
    request(app)
      .post('/api/v1/guesthouses')
      .set('Content-Type', 'application/json')
      .set('authorization', token)
      .send(postGuestHouse)
      .expect(403)
      .end((err, res) => {
        expect(res.body.success).toEqual(false);
        expect(res.body.error).toEqual('You don\'t have access to perform this action');
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

describe('Guest Rooms - GET', () => {
  it('should not get bed if gender is not provided', (done) => {
    request(app)
      .get('/api/v1/availablerooms?location=Lagos&departureDate=2018-12-12')
      .set('authorization', token)
      .expect(422)
      .end((err, res) => {
        expect(res.body.success).toEqual(false);
        expect(res.body.message)
          .toEqual('Please fill the details for departure date, gender and location');
        if (err) return done(err);
        done();
      });
  });

  it('should not get bed if location is not provided', (done) => {
    request(app)
      .get('/api/v1/availablerooms?gender=Male&departureDate=2018-12-12')
      .set('authorization', token)
      .expect(422)
      .end((err, res) => {
        expect(res.body.success).toEqual(false);
        expect(res.body.message)
          .toEqual('Please fill the details for departure date, gender and location');
        if (err) return done(err);
        done();
      });
  });

  it('should not get bed if departureDate is not provided', (done) => {
    request(app)
      .get('/api/v1/availablerooms?location=Lagos&gender?Male')
      .set('authorization', token)
      .expect(422)
      .end((err, res) => {
        expect(res.body.success).toEqual(false);
        expect(res.body.message)
          .toEqual('Please fill the details for departure date, gender and location');
        if (err) return done(err);
        done();
      });
  });

  it('should not get bed if departureDate is invalid', (done) => {
    request(app)
      .get('/api/v1/availablerooms?location=Lagos&gender=Male&departureDate=67-23-12')
      .set('authorization', token)
      .expect(422)
      .end((err, res) => {
        expect(res.body.success).toEqual(false);
        expect(res.body.message)
          .toEqual('Invalid departure or arrival dates');
        if (err) return done(err);
        done();
      });
  });

  it('should not get bed if arrivalDate is invalid', (done) => {
    request(app)
      .get('/api/v1/availablerooms?location=Lagos&gender=Male&departureDate=2018-12-12&arrivalDate=98-22-22')
      .set('authorization', token)
      .expect(422)
      .end((err, res) => {
        expect(res.body.success).toEqual(false);
        expect(res.body.message)
          .toEqual('Invalid departure or arrival dates');
        if (err) return done(err);
        done();
      });
  });

  it('should get beds if all fields are valid', (done) => {
    request(app)
      .get('/api/v1/availablerooms?location=Lagos&gender=Male&departureDate=2018-12-12&arrivalDate=2018-12-22')
      .set('authorization', token)
      .expect(200)
      .end((err, res) => {
        expect(res.body.success).toEqual(true);
        expect(res.body.message)
          .toEqual('Available rooms fetched');
        if (err) return done(err);
        done();
      });
  });
});
