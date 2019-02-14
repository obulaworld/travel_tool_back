import supertest from 'supertest';
import app from '../../../app';
import models from '../../../database/models';
import { role } from '../../userRole/__tests__/mocks/mockData';
import Utils from '../../../helpers/Utils';
import createTravelReasonMock from './__mock__/createTravelReasonMock';

const request = supertest;

const prepareDatabase = async () => {
  await models.UserRole.destroy({ force: true, truncate: { cascade: true } });
  await models.Role.destroy({ force: true, truncate: { cascade: true } });
  await models.Center.destroy({ force: true, truncate: { cascade: true } });
  await models.TravelReason.destroy({ force: true, truncate: { cascade: true } });
  await models.User.destroy({ force: true, truncate: { cascade: true } });
};

describe('create travel reasons', () => {
  const {
    user,
    user2,
    payload2,
    payload,
    SuperAdminRole,
    validTravelReason,
    validTravelReason2,
    invalidTravelReasonDescription,
    invalidTravelReasonTitle,
    centers
  } = createTravelReasonMock;

  const token = Utils.generateTestToken(payload);
  const token2 = Utils.generateTestToken(payload2);

  beforeAll(async () => {
    await prepareDatabase();
    await models.Role.bulkCreate(role);
    await models.User.create(user);
    await models.Center.create(centers);
    await models.UserRole.create(SuperAdminRole);
    await models.User.create(user2);
  });

  afterAll(async () => {
    await prepareDatabase();
  });

  const testClient = () => request(app).post('/api/v1/request/reasons').set('authorization', token);

  it('should fail to add a travel reason because of invalid title', (done) => {
    testClient()
      .send(invalidTravelReasonTitle)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).toEqual(422);
        expect(res.body.message).toEqual('Validation failed');
        expect(res.body.errors[0].message).toEqual('Title should not be more than 18 characters');
        expect(res.body.success).toEqual(false);
        done();
      });
  });

  it('should fail to add a travel reason because of invalid description', (done) => {
    testClient()
      .send(invalidTravelReasonDescription)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).toEqual(422);
        expect(res.body.message).toEqual('Validation failed');
        expect(res.body.errors[0].message).toEqual('Description should not be more than 140 characters');
        expect(res.body.success).toEqual(false);
        done();
      });
  });

  it('should fail to add a travel reason when lacking permissions', (done) => {
    request(app).post('/api/v1/request/reasons').set('authorization', token2)
      .set('Content-Type', 'application/json')
      .send(validTravelReason)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).toEqual(false);
        expect(res.body.error).toEqual('You don\'t have access to perform this action');
        done();
      });
  });

  it('should successfully add a travel reason as a super admin', (done) => {
    testClient()
      .send(validTravelReason)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).toEqual(201);
        expect(res.body.message).toEqual('Successfully created a travel reason');
        expect(res.body.success).toEqual(true);
        expect(res.body.travelReason.title).toEqual('boot camp');
        done();
      });
  });

  it('should successfully fail to add the same reason twice', (done) => {
    testClient()
      .send(validTravelReason2)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).toEqual(422);
        expect(res.body.message).toEqual('This travel reason already exists');
        expect(res.body.success).toEqual(false);
        done();
      });
  });
});
