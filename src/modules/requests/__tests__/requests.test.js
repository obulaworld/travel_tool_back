/* eslint-disable */

import supertest from 'supertest';
import models from '../../../database/models';
import app from '../../../app';
import { role } from '../../userRole/__tests__/mocks/mockData';
import {
  testRequests,
  emptyRequestResponse,
  editRequestSuccessResponse,
  createRequestSuccessResponse,
  dates,
  manager,
  mockRequest,
}
 from './mocks/mockData';
import Utils from '../../../helpers/Utils';

const request = supertest;

const dataToBeEmitted = {
  sender: 'Ademola Ariya',
  recipient: 'Samuel Kubai'
};

global.io = {
  sockets: {
    emit: (event, dataToBeEmitted) => dataToBeEmitted
  }
}

const newRequest = {
  name: 'Test',
  manager: 'Some manager',
  tripType: 'return',
  gender: 'Female',
  department: 'TDD',
  role: 'Software Developer',
  trips: [
    {
      origin: 'Lagos',
      destination: 'Nairobi',
      departureDate: dates.departureDate,
      returnDate: dates.returnDate
    }
  ]
};

const payload = {
  UserInfo: {
    id: '-MUyHJmKrxA90lPNQ1FOLNm',
    name: 'Samuel Kubai',
    picture:'this amara'
  },
};

const fakeManager = {
  UserInfo: {
    id: '-MUyHJmKrxA90lPNQ1FOLNm',
    name: 'Oratorio Platimus'
  },
};

const user = {
  fullName: 'Some manager',
  email: '',
  userId: '-MUyHJmKrxA90lPNQ1FOLNm',
  roleId: '53019',
 }

const requestId = 'xDh20cuGz'
const invalidId = 'xghvhbdebdhhe'
const token = Utils.generateTestToken(payload);
const nonRequestManagerToken = Utils.generateTestToken(fakeManager);
const invalidToken =
  'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySW5mbyI6eyJpZCI6Ii1MSEptS3J4';
let updatedTripId;

describe('Requests Controller', () => {
  beforeAll((done) => {
    models.Role.bulkCreate(role);
    done();
  });
  describe('GET /api/v1/requests', () => {
    let requests;
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
      beforeAll(async done => {
        try {
          const response = await models.Request.bulkCreate(testRequests);
          await models.User.create(user);
          requests = JSON.parse(JSON.stringify(response));
          done();
        } catch (error) {
          throw new Error(error);
        }
      });

      it('should return 200 status, the requests and pagination data', done => {
        const expectedResponse = {
          status: 200,
        };

        request(app)
          .get('/api/v1/requests')
          .set('authorization', token)
          .end((err, res) => {
            expect(res.status).toEqual(expectedResponse.status);
            expect(res.body.requests.length).toEqual(3);
            done();
          });
      });

      it('should return 200 status and the requested number of requests when a limit query is provided', done => {
        const expectedResponse = {
          status: 200,
        };

        request(app)
          .get('/api/v1/requests?limit=2')
          .set('authorization', token)
          .end((err, res) => {
            expect(res.body.requests).toHaveLength(2);
            expect(res.status).toEqual(expectedResponse.status);
            done();
          });
      });

      it('should return 200 status and only open requests when the status query is set to `open`', done => {
        const expectedResponse = {
          status: 200,
        };

        request(app)
          .get('/api/v1/requests?status=open')
          .set('Authorization', token)
          .end((err, res) => {
            expect(res.body.requests).toHaveLength(1);
            expect(res.status).toEqual(expectedResponse.status);
            expect(res.body.requests[0].status).toEqual('Open');
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
        };

        request(app)
          .get('/api/v1/requests?status=past')
          .set('Authorization', token)
          .end((err, res) => {
            expect(res.body.requests).toHaveLength(2);
            expect(res.status).toEqual(200);
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
    beforeAll((done) => {
      models.User.create(user);
      done();
    });
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
        const res = await request(app)
          .post('/api/v1/requests')
          .set('authorization', token)
          .send({});
        expect(res.status).toEqual(422);
        expect(res.body).toMatchObject(emptyRequestResponse);
      });

      //  create request if everything is fine
      it('should add a new request to the db', async (done) => {
        const res = await request(app)
          .post('/api/v1/requests')
          .set('authorization', token)
          .send({ ...newRequest });
        expect(res.status).toBe(201);
        expect(res.body).toMatchObject(createRequestSuccessResponse);
        done();
      });

      it(`should throw 422 error while creating a request that is not multi-trip
      with more than one trip` ,async(done) => {
        const expectedResponse = {
          body: {
            success: false,
            errors: [
             {
               location: "body",
               param: "trips",
               msg: "A return trip must have one trip"
             }
            ]
          },
          status: 422
        }
        const res = await request(app)
          .post('/api/v1/requests')
          .set('authorization', token)
          .send({
            ...newRequest,
            trips: [
              {
                departureDate: dates.departureDate,
                returnDate: dates.returnDate,
                origin: "Lagos",
                destination :  "Angola"
              },
              {
                departureDate: dates.departureDate,
                returnDate: dates.returnDate,
                origin: "Angola",
                destination :  "Nairobi"
              }
            ]
          });
        expect(res).toMatchObject(expectedResponse);
        done();
      });

      it(`should not throw 422 error while creating a request with invalid date`
      , async(done) => {
        const expectedResponse = {
          body: {
            success: false,
            errors: [
             {
               location: 'body',
               param: 'trips[0].returnDate',
               msg: 'Please specify a valid ISO return date'
             }
            ]
          },
          status: 422
        }
        const res = await request(app)
          .post('/api/v1/requests')
          .set('authorization', token)
          .send({
            ...newRequest,
            trips: [
              {
                departureDate: dates.departureDate,
                returnDate: 'baddate',
                origin: 'Angola',
                destination :  "Nairobi"
              }
            ]
          });
        expect(res).toMatchObject(expectedResponse);
        done();
      });

      it(`should throw 422 error while creating a request if the returnDate
        is less than the returnDate`
      , async(done) => {
        const expectedResponse = {
          body: {
            success: false,
            errors: [
             {
               location: "body",
               param: "trips[0]",
               msg: "returnDate must be greater than departureDate"
             }
            ]
          },
          status: 422
        }
        const res = await request(app)
          .post('/api/v1/requests')
          .set('authorization', token)
          .send({
            ...newRequest,
            trips: [
              {
                departureDate: dates.returnDate,
                returnDate: dates.departureDate,
                origin: "Angola",
                destination :  "Nairobi"
              }
            ]
          });
        expect(res).toMatchObject(expectedResponse);
        done();
      });
    });
  }); // end of CREATE REQUEST API

  describe('Get an authenticated User Request detail', () => {
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
        manager: 'Samuel Kubai',
        gender: 'Female',
        department: 'TDD',
        role: 'Software Developer',
        status: 'Open',
        userId: '-MUyHJmKrxA90lPNQ1FOLNm',
        tripType: 'return',
        createdAt: response.body.requestData.createdAt,
        updatedAt: response.body.requestData.updatedAt,
        comments: [],
        trips: []
        }
      })
    })

    it('should return the expected number of trips', async () => {
      const postResp = await request(app)
        .post('/api/v1/requests')
        .set('authorization', token)
        .send(mockRequest);
      const createdRequestId = postResp.body.request.id;

      const getResp = await request(app)
        .get(`/api/v1/requests/${createdRequestId}`)
        .set('authorization', token)
      expect(getResp.body.requestData.trips).toHaveLength(2);
    });

    it('should return the correct type of the request', async () => {
      const postResp = await request(app)
        .post('/api/v1/requests')
        .set('authorization', token)
        .send(mockRequest);
      const createdRequestType = postResp.body.request.tripType;
      expect(createdRequestType).toBe('multi');
    });

    it('should return a 404 ststus code for unexisting requestId', async () => {
      const response = await request(app)
        .get(`/api/v1/requests/${invalidId}`)
        .set('authorization', token)
      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        error: `Request with id ${invalidId} does not exist`,
        success: false
      });
    });
  });

  describe('PUT /api/v1/requests/:requestId', () => {
    describe('Authenticated user', () => {
      it('should edit the request and return 200 and updated request', (done) => {
        const expectedResponse = {
          body: {
            ...editRequestSuccessResponse
          },
          status: 200,
        }
        request(app)
          .put('/api/v1/requests/xDh20cuGz')
          .set('authorization', token)
          .send({
            ...newRequest,
            tripType: 'oneWay',
            trips: [
              {
                origin: 'Kampala',
                destination: 'New York',
                departureDate: dates.departureDate,
              }
            ]
          })
          .end((err, res) => {
            updatedTripId = res.body.trips[0].id;
            expect(res)
              .toMatchObject(expectedResponse);
            done();
        });
      });
      it('should return 422 error if the user supplies empty fields', (done) => {
        const expectedResponse = {
          body: {
            ...emptyRequestResponse
          },
          status: 422,
        }
        request(app)
          .put('/api/v1/requests/xDh20cuGz')
          .set('authorization', token)
          .send({})
          .end((err, res) => {
            expect(res)
              .toMatchObject(expectedResponse);
            done();
        });
      });
      it(`should return 422 error if a user tries to update
        a oneWay request with a returnDate`, (done) => {
        const expectedResponse = {
          body: {
            success: false,
            errors: [
              {
                location: 'body',
                param: 'trips[0].returnDate',
                msg: 'A oneWay trip cannot have a returnDate'
            }
            ]
          },
          status: 422,
        }
        request(app)
          .put('/api/v1/requests/xDh20cuGz')
          .set('authorization', token)
          .send({
            ...newRequest,
            tripType: 'oneWay'
          })
          .end((err, res) => {
            expect(res)
              .toMatchObject(expectedResponse);
            done();
        });
      })
      it(`should return 422 error if a user tries to update
        a multi-trip request with only one trip`, (done) => {
        const expectedResponse = {
          body: {
            success: false,
            errors: [
              {
                location: 'body',
                param: 'trips',
                msg: 'A multi trip must have more than one trip'
            }
            ]
          },
          status: 422,
        }
        request(app)
          .put('/api/v1/requests/xDh20cuGz')
          .set('authorization', token)
          .send({
            ...newRequest,
            tripType: 'multi'
          })
          .end((err, res) => {
            expect(res)
              .toMatchObject(expectedResponse);
            done();
        });
      })
      it('should return 409 error if the request has been approved or rejected', (done) => {
        const expectedResponse = {
          body: {
            success: false,
            error: 'Request could not be updated because it has been approved'
          },
          status: 409,
        }
        request(app)
          .put('/api/v1/requests/xDh20cuGy')
          .set('authorization', token)
          .send({
            ...newRequest
          })
          .end((err, res) => {
            expect(res)
              .toMatchObject(expectedResponse);
            done();
        });
      });
      it('should return 404 error if the request does not exist', (done) => {
        const expectedResponse = {
          body: {
            success: false,
            error: 'Request was not found'
          },
          status: 404,
        }
        request(app)
          .put('/api/v1/requests/myRequest0iD')
          .set('authorization', token)
          .send({
            ...newRequest
          })
          .end((err, res) => {
            expect(res)
              .toMatchObject(expectedResponse);
            done();
        });
      });
      it(`should update or create a new trip if it does not exist
        in the database`, (done) => {
        const trips = [
          {
            id: updatedTripId,
            origin: 'Kigali',
            destination: 'Kampala',
            departureDate: dates.departureDate,
            returnDate: dates.returnDate,
          },
          {
            origin: 'Kampala',
            destination: 'Lagos',
            departureDate: dates.departureDate,
            returnDate: dates.returnDate,
          }
        ];
        const expectedResponse = {
          body: {
            ...editRequestSuccessResponse,
            request: {
              ...editRequestSuccessResponse.request,
              tripType: 'multi',
            },
            trips
          },
          status: 200,
        }
        request(app)
          .put('/api/v1/requests/xDh20cuGz')
          .set('authorization', token)
          .send({
            ...newRequest,
            tripType: 'multi',
            trips
          })
          .end((err, res) => {
            expect(res)
              .toMatchObject(expectedResponse);
            done();
        });
      });
    });
    describe('Unauthenticated user', () => {
      it('should throw 401 error if token is not valid', (done) => {
        request(app)
          .put('/api/v1/requests/xDh20cuGz')
          .set('authorization', invalidToken)
          .send({
            name: 'Grace John',
          })
          .end((err, res) => {
            expect(res)
              .toMatchObject({
                body: {
                  success: false,
                  error: 'Token is not valid'
                },
                status: 401
              });
            done();
        });
      });
      it('should throw 401 error if token is not provided', (done) => {
        request(app)
          .put('/api/v1/requests/xDh20cuGz')
          .send({
            name: 'Grace John',
          })
          .end((err, res) => {
            expect(res)
              .toMatchObject({
                body: {
                  success: false,
                  error: 'Please provide a token'
                },
                status: 401
              });
            done();
        });
      });
    });
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
        expect(res.body.error).toEqual('Request has been approved already')
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