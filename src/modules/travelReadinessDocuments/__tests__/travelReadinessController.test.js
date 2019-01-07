import request from 'supertest';
import app from '../../../app';
import Utils from '../../../helpers/Utils';
import models from '../../../database/models';
import { role } from '../../userRole/__tests__/mocks/mockData';
import {
  travelAdmin,
  travelAdminPayload,
  usersData,
  travelAdminRole,
  documentsData,
  requesterPayload
} from '../__mocks__';

const travelAdminToken = Utils.generateTestToken(travelAdminPayload);
const requesterToken = Utils.generateTestToken(requesterPayload);

const setUp = async () => {
  await models.UserRole.destroy({ force: true, truncate: { cascade: true } });
  await models.Role.destroy({ force: true, truncate: { cascade: true } });
  await models.TravelReadinessDocuments.destroy({ force: true, truncate: { cascade: true } });
  await models.User.destroy({ force: true, truncate: { cascade: true } });
};

describe('TravelReadiness Controller', () => {
  beforeAll(async () => {
    await setUp();
    await models.Role.bulkCreate(role);
    await models.User.create(travelAdmin);
    await models.UserRole.create(travelAdminRole);
    await models.User.bulkCreate(usersData);
    await models.TravelReadinessDocuments.bulkCreate(documentsData);
  });

  afterAll(async () => {
    await setUp();
  });

  describe('getAllUsersReadiness', () => {
    it('should require user to be a travel Admin', (done) => {
      request(app)
        .get('/api/v1/travelreadiness/users')
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

    it('should get the list of users', (done) => {
      request(app)
        .get('/api/v1/travelreadiness/users')
        .set('Content-Type', 'application/json')
        .set('authorization', travelAdminToken)
        .end((err, res) => {
          expect(res.status).toBe(200);
          expect(res.body.users).toBeDefined();
          done();
        });
    });

    it("should fetch the list of users from an admin's center", (done) => {
      request(app)
        .get('/api/v1/travelreadiness/users')
        .set('Content-Type', 'application/json')
        .set('authorization', travelAdminToken)
        .end((err, res) => {
          expect(res.status).toBe(200);
          expect(res.body.users
            .some(user => user.location !== travelAdmin.location))
            .toEqual(false);
          done();
        });
    });
  });

  describe('getUserReadiness', () => {
    it('should require user to be a travel Admin', (done) => {
      request(app)
        .get('/api/v1/travelreadiness/users/-FCbaka-ljvhsus83-B')
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

    it('should return a 404 error if user does not exist', (done) => {
      request(app)
        .get('/api/v1/travelreadiness/users/-Id-NoT-exiStent')
        .set('Content-Type', 'application/json')
        .set('authorization', travelAdminToken)
        .end((err, res) => {
          expect(res.status).toBe(404);
          expect(res.body.message).toEqual('User with id -Id-NoT-exiStent does not exist');
          if (err) return done(err);
          done();
        });
    });

    it('should get a list of the requested users passports and visas', (done) => {
      request(app)
        .get('/api/v1/travelreadiness/users/-FCbaka-ljvhsus83-B')
        .set('Content-Type', 'application/json')
        .set('authorization', travelAdminToken)
        .end((err, res) => {
          expect(res.status).toBe(200);
          expect(res.body.user.travelDocuments.passport).toBeDefined();
          expect(res.body.user.travelDocuments.visa).toBeDefined();
          expect(res.body.user.travelDocuments.passport.length).toEqual(1);
          expect(res.body.user.travelDocuments.visa.length).toEqual(1);
          done();
        });
    });
  });

  describe('getTravelReadinessDocument', () => {
    it('should require user to be a travel Admin', (done) => {
      request(app)
        .get('/api/v1/travelreadiness/documents/SyOyr_AtC')
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

    it('should return requested document information', (done) => {
      request(app)
        .get('/api/v1/travelreadiness/documents/SyOyr_AtC')
        .set('Content-Type', 'application/json')
        .set('authorization', travelAdminToken)
        .end((err, res) => {
          expect(res.status).toBe(200);
          expect(res.body.document).toBeDefined();
          done();
        });
    });

    it('should return a 404 error if document does not exist', (done) => {
      request(app)
        .get('/api/v1/travelreadiness/documents/NulI-D')
        .set('Content-Type', 'application/json')
        .set('authorization', travelAdminToken)
        .end((err, res) => {
          expect(res.status).toBe(404);
          expect(res.body.message).toEqual('Document with id NulI-D does not exist');
          done();
        });
    });
  });
});
