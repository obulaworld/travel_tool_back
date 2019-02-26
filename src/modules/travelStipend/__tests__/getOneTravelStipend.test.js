import supertest from 'supertest';
import app from '../../../app';
import models from '../../../database/models';
import Utils from '../../../helpers/Utils';
import TestSetup from './helper';
import mockData from './__mocks__/travelStipendMock';

const request = supertest;

const URI = '/api/v1/travelStipend';

const expectedResponseBody = {
  success: false,
  error: 'Please provide a token'
};
  
const expectedResponse = {
  status: 401,
  body: expectedResponseBody
};

const { payload, payloadNotAdmin } = mockData;
const superAdminToken = Utils.generateTestToken(payload);
const requesterToken = Utils.generateTestToken(payloadNotAdmin);

  
const getOneTravelStipend = (id, done, expected, bodyField = null, token = superAdminToken) => {
  const api = request(app)
    .get(`${URI}/${id}`);
  if (token) {
    api.set('Authorization', token);
  }
  api.end((err, res) => {
    if (err) done(err);
    if (expected) {
      expect(res.status).toEqual(expected.status);
      expect(bodyField ? res.body[bodyField] : res.body)
        .toEqual(bodyField ? expected[bodyField] : expected.body);
    }
    done();
  });
};

describe('Fetch One Travel Stipend', () => {
  let stipendId;

  beforeAll(async () => {
    await TestSetup.destoryTables();
    await TestSetup.createTables();
  });

  beforeEach(async () => {
    await models.TravelStipends.destroy({ force: true, truncate: { cascade: true } });

    const { travelStipend } = mockData;
    const response = await request(app)
      .post(URI)
      .set('AUthorization', superAdminToken)
      .send(travelStipend);
    stipendId = response.body.stipend.id;
  });

  afterAll(async () => {
    await TestSetup.destoryTables();
  });

  describe('GET /travelStipend/:id', () => {
    it('should require a valid token', (done) => {
      getOneTravelStipend(
        stipendId,
        done,
        expectedResponse,
        null,
        null
      );
    });

    it('should ensure provided token is valid', (done) => {
      const invalidToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySW5';
     

      getOneTravelStipend(
        stipendId,
        done,
        {
          status: 401,
          body: {
            ...expectedResponseBody,
            error: 'Token is not valid'
          }
        },
        null,
        invalidToken
      );
    });

    it('should ensure user is super admin', (done) => {
      getOneTravelStipend(
        stipendId,
        done,
        {
          status: 403,
          error: 'You don\'t have access to perform this action'
        },
        'error',
        requesterToken
      );
    });

    it('should ensure travelStipend exists', (done) => {
      getOneTravelStipend(
        999,
        done,
        {
          status: 404,
          error: 'Travel stipend does not exist'
        },
        'error',
        superAdminToken
      );
    });

    it('should fetch one travelStipend', (done) => {
      request(app)
        .get(`${URI}/${stipendId}`)
        .set('Authorization', superAdminToken)
        .end((err, res) => {
          if (err) return done();
          expect(res.status).toEqual(200);
          expect(res.body.success).toEqual(true);
          expect(res.body.travelStipend.id).toEqual(stipendId);
          done();
        });
    });
  });
});
