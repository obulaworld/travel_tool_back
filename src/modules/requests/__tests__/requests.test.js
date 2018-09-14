/* eslint-disable */

import supertest from 'supertest';
import models from '../../../database/models';
import app from '../../../app';
import testRequests from './mocks/mockData';
import Utils from '../../../helpers/Utils';

const request = supertest;

const payload = {
  UserInfo: {
    id: '-MUyHJmKrxA90lPNQ1FOLNm',
    name: 'Samuel Kubai'
  },
};

const fakeManager = {
  UserInfo: {
    id: '-MUyHJmKrxA90lPNQ1FOLNm',
    name: 'Oratorio Platimus'
  },
};
const requestId = 'xDh20cuGz'
const invalidId = 'xghvhbdebdhhe'
const token = Utils.generateTestToken(payload);
const nonRequestManagerToken = Utils.generateTestToken(fakeManager);
const invalidToken =
  'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySW5mbyI6eyJpZCI6Ii1MSEptS3J4';

describe('Requests Controller', () => {
  describe('GET /api/v1/requests', () => {
    describe('Authenticated user with no requests', () => {
      it(`should return 200 status and the appropriate
      message for a user without requests`, done => {
        const expectedResponse = {
          status: 200,
          message: 'You have no requests at the moment',
          body: {
            success: true,
            requests: [],
            meta: {
              count: {
                open: 0,
                past: 0,
              },
              pagination: {
                pageCount: 0,
                currentPage: 1,
                dataCount: 0,
              },
            },
          },
        };

        request(app)
          .get('/api/v1/requests')
          .set('authorization', token)
          .end((err, res) => {
            expect(res.body).toMatchObject(expectedResponse.body);
            expect(res.body.requests.length).toEqual(0);
            done();
          });
      });
    });

    describe('Authenticated user With requests', () => {
      let requests;
      beforeAll(async done => {
        try {
          const response = await models.Request.bulkCreate(testRequests);
          requests = JSON.parse(JSON.stringify(response));
          done();
        } catch (error) {
          throw new Error(error);
        }
      });

      it('should return 200 status, the requests and pagination data', done => {
        const expectedResponse = {
          status: 200,
          body: {
            success: true,
            requests,
            meta: {
              count: {
                open: 1,
                past: 2,
              },
              pagination: {
                pageCount: 1,
                currentPage: 1,
                dataCount: 3,
              },
            },
          },
        };

        request(app)
          .get('/api/v1/requests')
          .set('authorization', token)
          .end((err, res) => {
            expect(res.body).toMatchObject(expectedResponse.body);
            expect(res.body.requests.length).toEqual(3);
            done();
          });
      });

      it('should return 200 status and the requested number of requests when a limit query is provided', done => {
        const expectedResponse = {
          status: 200,
          body: {
            requests: requests.slice(0, 2),
            meta: {
              count: {
                open: 1,
                past: 2,
              },
              pagination: {
                pageCount: 2,
                currentPage: 1,
                dataCount: 3,
              },
            },
            success: true,
          },
        };

        request(app)
          .get('/api/v1/requests?limit=2')
          .set('authorization', token)
          .end((err, res) => {
            expect(res.body.requests).toHaveLength(2);
            expect(res).toMatchObject(expectedResponse);
            done();
          });
      });

      it('should return 200 status and only open requests when the status query is set to `open`', done => {
        const expectedResponse = {
          status: 200,
          body: {
            success: true,
            requests: requests.slice(0, 1),
            meta: {
              count: {
                open: 1,
                past: 2,
              },
              pagination: {
                pageCount: 1,
                currentPage: 1,
                dataCount: 1,
              },
            },
          },
        };

        request(app)
          .get('/api/v1/requests?status=open')
          .set('Authorization', token)
          .end((err, res) => {
            expect(res.body.requests).toHaveLength(1);
            expect(res).toMatchObject(expectedResponse);
            done();
          });
      });

      it(`should return 200 status, and appropriate feedback if the user requests for
      a page that does not exist`, done => {
        const expectedResponse = {
          status: 200,
          body: {
            success: true,
            message: 'No requests exists for this page',
            requests: [],
            meta: {
              count: {
                open: 1,
                past: 2,
              },
              pagination: {
                pageCount: 1,
                currentPage: 2,
                dataCount: 3,
              },
            },
          },
        };

        request(app)
          .get('/api/v1/requests?limit=10&page=2')
          .set('authorization', token)
          .end((err, res) => {
            expect(res.body).toMatchObject(expectedResponse.body);
            expect(res.body.requests.length).toEqual(0);
            done();
          });
      });

      it(`should return 200 status and only approved and rejected
    requests when the status query is set to 'past'`, done => {
        const expectedResponse = {
          status: 200,
          body: {
            success: true,
            requests: requests.slice(1),
            meta: {
              count: {
                open: 1,
                past: 2,
              },
              pagination: {
                pageCount: 1,
                currentPage: 1,
                dataCount: 2,
              },
            },
          },
        };

        request(app)
          .get('/api/v1/requests?status=past')
          .set('Authorization', token)
          .end((err, res) => {
            expect(res.body.requests).toHaveLength(2);
            expect(res).toMatchObject(expectedResponse);
            done();
          });
      });

      it('should throw 422 error if the status query is not open, approved, rejected or past', done => {
        const expectedResponse = {
          status: 422,
          body: {
            success: false,
            errors: [{
              location: 'query',
              param: 'status',
              value: 'archive',
              msg: 'Status must be "open", "past", "approved" or "rejected"',
            }, ],
          },
        };

        request(app)
          .get('/api/v1/requests?status=archive')
          .set('authorization', token)
          .end((err, res) => {
            expect(res).toMatchObject(expectedResponse);
            done();
          });
      });

      it('should throw 422 error if the page query is not a positive integer', done => {
        const expectedResponse = {
          status: 422,
          body: {
            success: false,
            errors: [{
              location: 'query',
              param: 'page',
              value: '-100',
              msg: 'Page must be a positive integer',
            }, ],
          },
        };

        request(app)
          .get('/api/v1/requests?page=-100')
          .set('authorization', token)
          .end((err, res) => {
            expect(res).toMatchObject(expectedResponse);
            done();
          });
      });

      it('should throw 422 error if the limit query is not a positive integer', done => {
        const expectedResponse = {
          status: 422,
          body: {
            success: false,
            errors: [{
              location: 'query',
              param: 'limit',
              value: '-100',
              msg: 'Limit must be a positive integer',
            }, ],
          },
        };

        request(app)
          .get('/api/v1/requests?limit=-100')
          .set('authorization', token)
          .end((err, res) => {
            expect(res).toMatchObject(expectedResponse);
            done();
          });
      });
    });

    describe('Unauthenticated user', () => {
      it('should throw 401 error if the user does not provide a token', done => {
        const expectedResponse = {
          status: 401,
          body: {
            success: false,
            error: 'Please provide a token',
          },
        };
        request(app)
          .get('/api/v1/requests')
          .end((err, res) => {
            expect(res).toMatchObject(expectedResponse);
            done();
          });
      });
      it("should throw 401 error if the user's provides an invalid token", done => {
        const expectedResponse = {
          status: 401,
          body: {
            success: false,
            error: 'Token is not valid',
          },
        };
        request(app)
          .get('/api/v1/requests')
          .set('authorization', invalidToken)
          .end((err, res) => {
            expect(res).toMatchObject(expectedResponse);
            done();
          });
      });
    });
  });

  describe('POST / requests - Create New Request', () => {
    describe('Unauthenticated User', () => {
      it('should check if the token exists and return 401 if it does not', async () => {
        const res = await request(app)
          .post('/api/v1/requests')
          .send({
            name: 'demola'
          });
        expect(res.statusCode).toEqual(401);
        expect(res.body.success).toEqual(false);
        expect(res.body.error).toEqual('Please provide a token');
      });

      it('should check if the token is valid and return 401 if it is not', async () => {
        const res = await request(app)
          .post('/api/v1/requests')
          .set('Authorization', invalidToken)
          .send({
            name: 'demola'
          });
        expect(res.status).toEqual(401);
        expect(res.body.success).toEqual(false);
        expect(res.body.error).toEqual('Token is not valid');
      });
    });

    describe('Authenticated User', () => {
      // check that all the fields are filled - fail if any field is missing
      it('should return 422 if validation fails', async () => {
        const validationResponse = {
          success: false,
          message: 'Validation failed',
          errors: [{
              name: 'name',
              message: 'Name is required',
            },
            {
              name: 'name',
              message: 'Name should be between 3 and 50 characters long',
            },
            {
              name: 'origin',
              message: 'Travel origin is required',
            },
            {
              name: 'destination',
              message: 'Travel destination is required',
            },
            {
              name: 'manager',
              message: 'Manager name is required',
            },
            {
              name: 'gender',
              message: 'Gender is required',
            },
            {
              name: 'department',
              message: 'Your department is required',
            },
            {
              name: 'role',
              message: 'Your role is required',
            },
            {
              name: 'departureDate',
              message: 'Departure date is required',
            },
            {
              name: 'arrivalDate',
              message: 'Arrival date is required',
            },
          ],
        };

        const res = await request(app)
          .post('/api/v1/requests')
          .set('authorization', token)
          .send({});
        expect(res.status).toEqual(422);
        expect(res.body).toMatchObject(validationResponse);
      });

      //  create request if everything is fine
      it('should add a new request to the db', async (done) => {
        const newRequest = {
          id: 'h35gbb',
          name: 'Tester Demola',
          origin: 'Kampala',
          destination: 'New york',
          gender: 'Male',
          manager: 'Samuel Kubai',
          department: 'TDD',
          role: 'Senior Consultant',
          status: 'Open',
          departureDate: '2018-08-16',
          arrivalDate: '2018-08-30',
          createdAt: '2018-08-16 012:11:52.181+01',
          updatedAt: '2018-08-16 012:11:52.181+01'
        };
        const res = await request(app)
          .post('/api/v1/requests')
          .set('authorization', token)
          .send({ ...newRequest });
        expect(res.status).toBe(201);
        expect(res.body.Approval.approverId).toBe(newRequest.manager)
        done();
      });
    });
  }); // end of CREATE REQUEST API

  describe('Get an athenticated User Request detail', () => {
    // it should get request details for a user
    it('should return request details of a user', async () => {
      const response = await request(app)
        .get(`/api/v1/requests/${requestId}`)
        .set('authorization', token)
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        success: true,
        requestData:   {
        id: 'xDh20cuGz',
        name: 'Test user A',
        origin: 'Lagos',
        destination: 'Nairobi',
        manager: 'Samuel Kubai',
        gender: 'Female',
        department: 'TDD',
        role: 'Software Developer',
        status: 'Open',
        userId: '-MUyHJmKrxA90lPNQ1FOLNm',
        departureDate: '2018-12-09',
        arrivalDate: '2018-11-12',
        createdAt: response.body.requestData.createdAt,
        updatedAt: response.body.requestData.updatedAt,
        }
      })
    })

    it('should return a 404 ststus code for unexisting requestId', async () => {
      const response = await request(app)
        .get(`/api/v1/requests/${invalidId}`)
        .set('authorization', token)
      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        message: `Request with id ${invalidId} does not exist`
      })
    })
  });
  describe('PUT / approvals/:requestId - Update Request Status', () => {
    beforeAll(async done => {
      try {
        await models.Approval.create(
          {
            requestId: 'xDh20cuGy',
            approverId: '-MUyHJmKrxA90lPNQ1FOLNm',
            status: 'Open',
          },
        );
        done();
      } catch (error) {
        throw error;
      }
    });

    describe('Requesters Manager', () => {
      it('should successfully update a requests status',
        async () => {
          const res = await request(app)
            .put('/api/v1/approvals/xDh20cuGy')
          .set('authorization', token)
          .send({ newStatus: 'Approved' });
          expect(res.statusCode).toEqual(200);
          expect(res.body.success).toEqual(true);
          expect(res.body.message).toEqual('Request approved successfully');
        });

      it('should throw validation error when newStatus does not match expected input',
        async () => {
          const newStatus = 'ApprovedRejected'

          const res = await request(app)
            .put('/api/v1/approvals/xDh20cuGy')
          .set('authorization', token)
          .send({ newStatus });
          expect(res.statusCode).toEqual(422);
        });

      it('should return an error if request is not found',
        async () => {
          const res = await request(app)
            .put('/api/v1/approvals/xDh20cuT0')
          .set('authorization', token)
          .send({ newStatus: 'Approved' });
          expect(res.statusCode).toEqual(404);
          expect(res.body.success).toEqual(false);
        });
    });

    describe('Not Requesters Manager', () => {
      it('should return an error message', async () => {
        const newRequest = {
          newStatus: 'Rejected',
        };
        const res = await request(app)
          .put('/api/v1/approvals/xDh20cuGy')
          .set('authorization', nonRequestManagerToken)
          .send({ ...newRequest });
        expect(res.status).toBe(403);
        expect(res.body).toMatchObject({
          success: false,
          error: 'Permission denied, you are not requesters manager',
        });
      });
    });

    describe('Unauthenticated User', () => {
      it('should check if the token exists and return 401 if it does not',
        async () => {
          const res = await request(app)
            .put('/api/v1/approvals/xDh20cuT0')
            .send({ newStatus: 'Rejected' });
          expect(res.statusCode).toEqual(401);
          expect(res.body.success).toEqual(false);
          expect(res.body.error).toEqual('Please provide a token');
        });

      it('should check if the token is valid and return 401 if it is not',
        async () => {
          const res = await request(app)
            .put('/api/v1/approvals/xDh20cuT0')
            .set('Authorization', invalidToken)
            .send({ newStatus: 'Approved' });
          expect(res.status).toEqual(401);
          expect(res.body.success).toEqual(false);
          expect(res.body.error).toEqual('Token is not valid');
        });
    });

    describe('Requesters Manager', () => {
      it('should not update a requests status twice',
      async () => {
        const res = await request(app)
          .put('/api/v1/approvals/xDh20cuGy')
        .set('authorization', token)
        .send({ newStatus: 'Approved' });
        expect(res.statusCode).toEqual(400);
        expect(res.body.success).toEqual(false);
        expect(res.body.message).toEqual('Request has been approved already')
      });
    });

    describe('Requesters Manager', () => {
      beforeAll(async (done) => {
        await models.Approval.destroy({
           where: {
             requestId:'xDh20cuGy',
           }
         });
        done();
      });

      it('should return an error message if approval does not exist', async () => {
        const res = await request(app)
          .put('/api/v1/approvals/xDh20cuGy')
          .set('authorization', token)
          .send({ newStatus: 'Rejected' });
        expect(res.status).toBe(404);
        expect(res.body).toMatchObject({
          success: false,
          error: 'Request not found',
        });
      });
    });
  });// end of REQUEST STATUS UPDATE
});
