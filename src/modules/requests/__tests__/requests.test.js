/* eslint-disable */

import supertest from 'supertest';
import models from '../../../database/models';
import app from '../../../index';
import testRequests from './mocks/mockData';
import Utils from '../../../helpers/Utils';

const request = supertest;

const payload = {
  UserInfo: {
    id: '-MUyHJmKrxA90lPNQ1FOLNm'
  }
};

const token = Utils.generateTestToken(payload);
const invalidToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySW5mbyI6eyJpZCI6Ii1MSEptS3J4';

describe('Requests Controller', () => {
  beforeAll(async (done) => {
    await models.sequelize.sync({
      force: true,
    });
    done();
  });

  describe('GET /api/v1/requests', () => {
    let requests;
    beforeAll(async (done) => {
      try {
        const response = await models.Request.bulkCreate(testRequests);
        requests = JSON.parse(JSON.stringify(response));
        done();
       } catch(error) {
        throw new Error(error);
      }
    });

    it('should return 200 status, the requests and pagination data', (done) => {
      const expectedResponse = {
        status: 200,
        body: {
          requests,
          pagination: {
            pageCount: 1,
            currentPage: 1,
            dataCount: 3
          },
          success: true
        }
      }

      request(app)
        .get('/api/v1/requests')
        .set('authorization', token)
        .end((err, res) => {
          expect(res).toMatchObject(expectedResponse);
          expect(res.body.requests.length).toEqual(3);
          done();
        });
    });

    it('should return 200 status and the requested number of requests when a limit query is provided', (done) => {
      const expectedResponse = {
        status: 200,
        body: {
          requests: requests.slice(0, 2),
          pagination: {
            pageCount: 2,
            currentPage: 1,
            dataCount: 3
          },
          success: true
        }
      }

      request(app)
        .get('/api/v1/requests?limit=2')
        .set('authorization', token)
        .end((err, res) => {
          expect(res.body.requests).toHaveLength(2);
          expect(res).toMatchObject(expectedResponse);
          done();
        });
    });

    it('should return 200 status and only open requests when the status query is set to `open`', (done) => {
      const expectedResponse = {
        status: 200,
        body: {
          requests: requests.slice(0,1),
          pagination: {
            pageCount: 1,
            currentPage: 1,
            dataCount: 1
          },
          success: true
        }
      }

      request(app)
        .get('/api/v1/requests?status=open')
        .set('Authorization', token)
        .end((err, res) => {
          expect(res.body.requests).toHaveLength(1);
          expect(res).toMatchObject(expectedResponse);
          done();
        });
    });

    it('should return 200 status and only approved and rejected requests when the status query is set to `past`', (done) => {
      const expectedResponse = {
        status: 200,
        body: {
          requests: requests.slice(1),
          pagination: {
            pageCount: 1,
            currentPage: 1,
            dataCount: 2
          },
          success: true
        }
      }

      request(app)
        .get('/api/v1/requests?status=past')
        .set('Authorization', token)
        .end((err, res) => {
          expect(res.body.requests).toHaveLength(2);
          expect(res).toMatchObject(expectedResponse);
          done();
        });
    });


    it('should throw 401 error if the user does not provide a token', (done) => {
      const expectedResponse = {
        status: 401,
        body: {
          success: false,
          error: 'Please provide a token'
        }
      }

      request(app)
        .get('/api/v1/requests')
        .end((err, res) => {
          expect(res).toMatchObject(expectedResponse);
          done();
        });
    });

    it('should throw 401 error if the user\'s provides an invalid token', (done) => {
      const expectedResponse = {
        status: 401,
        body: {
          success: false,
          error: 'Token is not valid'
        }
      }

      request(app)
        .get('/api/v1/requests')
        .set('authorization', invalidToken)
        .end((err, res) => {
          expect(res).toMatchObject(expectedResponse);
          done();
        });
    });

    it('should throw 422 error if the status query is not open, approved, rejected or past', (done) => {
      const expectedResponse = {
        status: 422,
        body: {
          success: false,
          error: [
            {
              location: "query",
              param: "status",
              value: "archive",
              msg: "Status must be \"open\", \"past\", \"approved\" or \"rejected\""
            }
          ]
        }
      }

      request(app)
        .get('/api/v1/requests?status=archive')
        .set('authorization', token)
        .end((err, res) => {
          expect(res).toMatchObject(expectedResponse);
          done();
        });
    });

    it('should throw 422 error if the page query is not a positive integer', (done) => {
      const expectedResponse = {
        status: 422,
        body: {
          success: false,
          error: [
            {
              location: "query",
              param: "page",
              value: "-100",
              msg: "Page must be a positive integer"
            }
          ]
        }
      }

      request(app)
        .get('/api/v1/requests?page=-100')
        .set('authorization', token)
        .end((err, res) => {
          expect(res).toMatchObject(expectedResponse);
          done();
        });
    });

    it('should throw 422 error if the limit query is not a positive integer', (done) => {
      const expectedResponse = {
        status: 422,
        body: {
          success: false,
          error: [
            {
              location: "query",
              param: "limit",
              value: "-100",
              msg: "Limit must be a positive integer"
            }
          ]
        }
      }

      request(app)
        .get('/api/v1/requests?limit=-100')
        .set('authorization', token)
        .end((err, res) => {
          expect(res).toMatchObject(expectedResponse);
          done();
        });
    });
  });
});
