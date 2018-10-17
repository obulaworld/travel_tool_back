import request from 'supertest';
import app from '../../../app';
import models from '../../../database/models';
import { role } from '../../userRole/__tests__/mocks/mockData';
import Utils from '../../../helpers/Utils';
import centers from './mocks/mockData';

const payload = {
  UserInfo: {
    id: '-MUyHJmKrxA90ldPNQ1FOLNm',
    fullName: 'black windows ',
    email: 'black.windows@andela.com'
  }
};

const payload2 = {
  UserInfo: {
    id: '-MUyHJmKrxA90ldPNQ1FOLNm',
    fullName: 'white windows ',
    email: 'white.windows@andela.com'
  }
};

const token = Utils.generateTestToken(payload);
const token2 = Utils.generateTestToken(payload2);

describe('Update center test', () => {
  beforeAll(async () => {
    await models.Role.destroy({ where: {}, force: true });
    await models.User.destroy({ where: {}, force: true });
    await models.UserRole.destroy({ force: true, truncate: { cascade: true } });
    await models.Role.bulkCreate(role);
    await models.Center.bulkCreate(centers);
    process.env.DEFAULT_ADMIN = 'black.windows@andela.com';
  });

  afterAll((done) => {
    models.Role.destroy({ where: {}, force: true });
    models.Center.destroy({ where: {}, force: true });
    models.User.destroy({ where: {}, force: true });
    models.UserRole.destroy({ force: true, truncate: { cascade: true } });
    models.Center.destroy({ force: true, truncate: { cascade: true } });
    done();
  });

  it('should create a user in the database', (done) => {
    request(app)
      .post('/api/v1/user')
      .set('Content-Type', 'application/json')
      .set('authorization', token)
      .send({
        userId: '-MUyHJmKrxA90ldPNQ1FOLNm',
        fullName: 'black windows ',
        email: 'black.windows@andela.com'
      })
      .expect(201)
      .end((err, res) => {
        expect(res.body.success).toEqual(true);
        expect(res.body.result).toHaveProperty('userId');
        expect(res.body.result).toHaveProperty('fullName');
        expect(res.body.result).toHaveProperty('email');
        if (err) return done(err);
        done();
      });
  });

  it('should create a another user in the database', (done) => {
    request(app)
      .post('/api/v1/user')
      .set('Content-Type', 'application/json')
      .set('authorization', token2)
      .send({
        userId: '-HJmKrxA90ldPN1FOLNm',
        fullName: 'white windows ',
        email: 'white.windows@andela.com'
      })
      .expect(201)
      .end((err, res) => {
        expect(res.body.success).toEqual(true);
        expect(res.body.result).toHaveProperty('userId');
        expect(res.body.result).toHaveProperty('fullName');
        expect(res.body.result).toHaveProperty('email');
        if (err) return done(err);
        done();
      });
  });

  it('should update user to super admin', (done) => {
    request(app)
      .put('/api/v1/user/admin')
      .set('Content-Type', 'application/json')
      .set('authorization', token)
      .expect(200)
      .end((err, res) => {
        expect(res.body.message).toEqual(
          'Your role has been Updated to a Super Admin'
        );
        if (err) return done(err);
        done();
      });
  });

  it('should update user to travel team member', (done) => {
    request(app)
      .put('/api/v1/user/role/update')
      .set('Content-Type', 'application/json')
      .set('authorization', token)
      .send({
        email: 'black.windows@andela.com',
        roleName: 'Travel Team Member',
        center: 'New York, United States'
      })
      .expect(200)
      .end((err, res) => {
        expect(res.body.success).toEqual(true);
        expect(res.body.message).toEqual('Role updated successfully');
        if (err) return done(err);
        done();
      });
  });

  it('should update travel team member center', (done) => {
    request(app)
      .patch('/api/v1/center/user/11')
      .set('Content-Type', 'application/json')
      .set('authorization', token)
      .send({
        center: 'Nairobi, Kenya'
      })
      .expect(200)
      .end((err, res) => {
        expect(res.body.success).toEqual(true);
        expect(res.body.message).toEqual('Center updated successfully');
        if (err) return done(err);
        done();
      });
  });

  it('should throw error if id in params is not a number', (done) => {
    request(app)
      .patch('/api/v1/center/user/ofjfnf')
      .set('Content-Type', 'application/json')
      .set('authorization', token)
      .send({
        center: 'Nairobi, Kenya'
      })
      .expect(400)
      .end((err, res) => {
        expect(res.body.message).toEqual('Only Number allowed for id');
        if (err) return done(err);
        done();
      });
  });

  it('should throw error if user does have a travel team member role', (done) => {
    request(app)
      .patch('/api/v1/center/user/200')
      .set('Content-Type', 'application/json')
      .set('authorization', token)
      .send({
        center: 'Nairobi, Kenya'
      })
      .expect(404)
      .end((err, res) => {
        expect(res.body.message).toEqual(
          `The user with the id ${200} does not have a travel team member role`
        );
        if (err) return done(err);
        done();
      });
  });
});
