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
  mockRequest, generateMockData,
} from './mocks/mockData';
import Utils from '../../../helpers/Utils';
import RequestsController from '../RequestsController';

import UserRoleController from '../../userRole/UserRoleController';
import NotificationEngine from '../../notifications/NotificationEngine';


const request = supertest;


global.io = {
  sockets: {
    emit: (event, dataToBeEmitted) => dataToBeEmitted
  }
};

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
    picture: 'this amara'
  },
};

const fakeManager = {
  UserInfo: {
    id: '-MUyHJmKrxA90lPNQ1FOLNm',
    name: 'Oratorio Platimus',
    picture: 'fakePicture.png'
  },
};

const someManager = {
  UserInfo: {
    id: '-MUyHJmKrxA90lPNQ1FOLNm',
    name: 'Some manager',
    picture: 'fakePicture.png'
  },
};

const userMock = {
  fullName: 'Samuel Kubai',
  email: 'captan.ameria@andela.com',
  userId: '--MUyHJmKrxA90lPNQ1FOLNm',
  picture: 'fakePicture.png',
  roleId: 53019
};

const requestId = 'xDh20cuGz';
const invalidId = 'xghvhbdebdhhe';
const token = Utils.generateTestToken(payload);
const someManagerToken = Utils.generateTestToken(someManager);
const nonRequestManagerToken = Utils.generateTestToken(fakeManager);
const invalidToken = 'eyJhbGciOiJSUzI1Ni6IkpXVCJ9.eyJVc2CI6Ii1MSEptS3J4';
let updatedTripId;

describe('Requests Controller', () => {
  beforeAll((done) => {
    models.Role.destroy({ force: true, truncate: { cascade: true } });
    models.Request.destroy({ force: true, truncate: { cascade: true } });
    models.Trip.truncate();
    models.Notification.truncate();
    models.Role.bulkCreate(role);
    models.User.create(userMock);
    done();
  });

  afterAll(async (done) => {
    await models.Role.destroy({ force: true, truncate: { cascade: true } });
    await models.Request.destroy({ force: true, truncate: { cascade: true } });
    await models.Trip.truncate();
    await models.Notification.truncate();
    await models.User.truncate();
    done();
  });

  describe('GET /api/v1/requests', () => {
    let requests;
    describe('Authenticated user with no requests', () => {
      it(`should return 200 status and the appropriate
      message for a user without requests`, (done) => {
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
      beforeAll(async (done) => {
        try {
          const response = await models.Request.bulkCreate(testRequests);
          await models.User.create(manager);
          requests = JSON.parse(JSON.stringify(response));
          done();
        } catch (error) {
          throw new Error(error);
        }
      });

      it('should return 200 status, the requests and pagination data',
        (done) => {
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

      it(`should return 200 status and the requested number of
        requests when a limit query is provided`, (done) => {
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

      it(`should return 200 status and only open
        requests when the status query is set to 'open'`, (done) => {
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

      it(`should return 200 status, and appropriate feedback
        if the user requests for a page that does not exist`, (done) => {
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
    requests when the status query is set to 'past'`, (done) => {
        request(app)
          .get('/api/v1/requests?status=past')
          .set('Authorization', token)
          .end((err, res) => {
            expect(res.body.requests).toHaveLength(2);
            expect(res.status).toEqual(200);
            done();
          });
      });

      it(`should return 200 status code and matching response data if search
        match is found `, (done) => {
        const expectedResponse = {
          status: 200,
          body: {
            requests: requests.slice(0, 1),
            meta: {
              count: {
                open: 1,
                past: 0,
              },
              pagination: {
                pageCount: 1,
                currentPage: 1,
                dataCount: 1,
              },
            },
            success: true,
          },
        };

        request(app)
          .get('/api/v1/requests?limit=2&search=user%20A')
          .set('authorization', token)
          .end((err, res) => {
            expect(res.body.requests).toHaveLength(1);
            expect(res).toMatchObject(expectedResponse);
            done();
          });
      });

      it(`should return 200 status code and matching response data if search
        match is found and parameter is a status `, (done) => {
        const expectedResponse = {
          status: 200,
          body: {
            requests: requests.slice(0, 1),
            meta: {
              count: {
                open: 1,
                past: 0,
              },
              pagination: {
                pageCount: 1,
                currentPage: 1,
                dataCount: 1,
              },
            },
            success: true,
          },
        };

        request(app)
          .get('/api/v1/requests?limit=2&search=open')
          .set('authorization', token)
          .end((err, res) => {
            expect(res.body.requests).toHaveLength(1);
            expect(res).toMatchObject(expectedResponse);
            done();
          });
      });

      it(`should return 200 status code and paginated response
        if search parameter is capitalized`, (done) => {
        const expectedResponse = {
          status: 200,
          body: {
            requests: requests.slice(1, 2),
            meta: {
              count: {
                open: 0,
                past: 1,
              },
              pagination: {
                pageCount: 1,
                currentPage: 1,
                dataCount: 1,
              },
            },
            success: true,
          },
        };

        request(app)
          .get('/api/v1/requests?limit=2&search=USER%20B')
          .set('authorization', token)
          .end((err, res) => {
            expect(res.body.requests).toHaveLength(1);
            expect(res).toMatchObject(expectedResponse);
            done();
          });
      });

      it(`should return 200 status code and response data
      if search parameter is empty`, (done) => {
        const expectedResponse = {
          status: 200,
          body: {
            requests: [requests[1], requests[0]],
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
          .get('/api/v1/requests?limit=2&search=')
          .set('authorization', token)
          .end((err, res) => {
            expect(res.body.requests).toHaveLength(2);
            expect(res).toMatchObject(expectedResponse);
            expect(res.body.requests).toHaveLength(2);
            done();
          });
      });

      it(`should return proper status code and proper error
        message if no search result is found`, (done) => {
        request(app)
          .get('/api/v1/requests?limit=2&status=open&search=xshdje')
          .set('authorization', token)
          .end((err, res) => {
            expect(res.status).toBe(200);
            expect(res.body.message).toBe('No records found');
            done();
          });
      });

      it(`should throw 422 error if the
        status query is not open, approved, rejected or past`, (done) => {
        const expectedResponse = {
          status: 422,
          body: {
            success: false,
            errors: [{
              location: 'query',
              param: 'status',
              value: 'archive',
              msg: 'Status must be "open", "past", "approved" or "rejected"',
            }],
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

      it('should throw 422 error if the page query is not a positive integer',
        (done) => {
          const expectedResponse = {
            status: 422,
            body: {
              success: false,
              errors: [{
                location: 'query',
                param: 'page',
                value: '-100',
                msg: 'Page must be a positive integer',
              }],
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

      it('should throw 422 error if the limit query is not a positive integer',
        (done) => {
          const expectedResponse = {
            status: 422,
            body: {
              success: false,
              errors: [{
                location: 'query',
                param: 'limit',
                value: '-100',
                msg: 'Limit must be a positive integer',
              }],
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
      it('should throw 401 error if the user does not provide a token',
        (done) => {
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

      it("should throw 401 error if the user's provides an invalid token",
        (done) => {
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
      it('should check if the token exists and return 401 if it does not',
        async (done) => {
          const res = await request(app)
            .post('/api/v1/requests')
            .send({
              name: 'demola'
            });
          expect(res.statusCode).toEqual(401);
          expect(res.body.success).toEqual(false);
          expect(res.body.error).toEqual('Please provide a token');
          done();
        });

      it('should check if the token is valid and return 401 if it is not',
        async (done) => {
          const res = await request(app)
            .post('/api/v1/requests')
            .set('Authorization', invalidToken)
            .send({
              name: 'demola'
            });
          expect(res.status).toEqual(401);
          expect(res.body.success).toEqual(false);
          expect(res.body.error).toEqual('Token is not valid');
          done();
        });
    });

    describe('Authenticated User', () => {
      // check that all the fields are filled - fail if any field is missing
      it('should return 422 if validation fails', async (done) => {
        const res = await request(app)
          .post('/api/v1/requests')
          .set('authorization', token)
          .send({});
        expect(res.status).toEqual(422);
        expect(res.body).toMatchObject(emptyRequestResponse);
        done();
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

      it(`should throw 422 error while creating a request that is not
        multi-trip with more than one trip`, async (done) => {
        const expectedResponse = {
          body: {
            success: false,
            errors: [
              {
                location: 'body',
                param: 'trips',
                msg: 'A return trip must have one trip'
              }
            ]
          },
          status: 422
        };
        const res = await request(app)
          .post('/api/v1/requests')
          .set('authorization', token)
          .send({
            ...newRequest,
            trips: [
              {
                departureDate: dates.departureDate,
                returnDate: dates.returnDate,
                origin: 'Lagos',
                destination: 'Angola'
              },
              {
                departureDate: dates.departureDate,
                returnDate: dates.returnDate,
                origin: 'Angola',
                destination: 'Nairobi'
              }
            ]
          });
        expect(res).toMatchObject(expectedResponse);
        done();
      });

      it(`should not throw 422 error while
      creating a request with invalid date`, async (done) => {
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
        };
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
                destination: 'Nairobi'
              }
            ]
          });
        expect(res).toMatchObject(expectedResponse);
        done();
      });

      it(`should throw 422 error while creating a request if the returnDate
        is less than the returnDate`,
      async (done) => {
        const expectedResponse = {
          body: {
            success: false,
            errors: [
              {
                location: 'body',
                param: 'trips[0]',
                msg: 'returnDate must be greater than departureDate'
              }
            ]
          },
          status: 422
        };
        const res = await request(app)
          .post('/api/v1/requests')
          .set('authorization', token)
          .send({
            ...newRequest,
            trips: [
              {
                departureDate: dates.returnDate,
                returnDate: dates.departureDate,
                origin: 'Angola',
                destination: 'Nairobi'
              }
            ]
          });
        expect(res).toMatchObject(expectedResponse);
        done();
      });
    });
  }); // end of CREATE REQUEST API

  describe('Test suite for approval endpoints GET: api/v1/approvals', () => {
    it(`should return 404 status code and message if search
    match is not found`, (done) => {
      supertest(app)
        .get('/api/v1/approvals?status=open&search=qwert')
        .set('authorization', someManagerToken)
        .end((err, res) => {
          expect(res.status).toBe(200);
          expect(res.body.message).toBe('No records found');
          done();
        });
    });

    it(`should return 200 status code and matching response data if search
    match is found`, (done) => {
      supertest(app)
        .get('/api/v1/approvals?page=1&status=open&search=test')
        .set('authorization', someManagerToken)
        .end((err, res) => {
          expect(res.status).toBe(200);
          expect(res.body.approvals).toHaveLength(1);
          expect(res.body.message).toBe('Approvals retrieved successfully');
          done();
        });
    });

    it(`should return 200 status code and response data
        if search parameter is empty`, (done) => {
      supertest(app)
        .get('/api/v1/approvals?page=1&status=open&search=')
        .set('authorization', someManagerToken)
        .end((err, res) => {
          expect(res.status).toBe(200);
          expect(res.body.approvals).toHaveLength(1);
          expect(res.body.message).toBe('Approvals retrieved successfully');
          done();
        });
    });
  });

  describe('Get an authenticated User Request detail', () => {
    // it should get request details for a user
    it('should return request details of a user', async (done) => {
      const response = await request(app)
        .get(`/api/v1/requests/${requestId}`)
        .set('authorization', token);
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        success: true,
        requestData: {
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
      });
      done();
    });

    it('should return the expected number of trips', async (done) => {
      const postResp = await request(app)
        .post('/api/v1/requests')
        .set('authorization', token)
        .send(mockRequest);
      const createdRequestId = postResp.body.request.id;

      const getResp = await request(app)
        .get(`/api/v1/requests/${createdRequestId}`)
        .set('authorization', token);
      expect(getResp.body.requestData.trips).toHaveLength(2);
      done();
    });

    it('should return the correct type of the request', async (done) => {
      const postResp = await request(app)
        .post('/api/v1/requests')
        .set('authorization', token)
        .send(mockRequest);
      const createdRequestType = postResp.body.request.tripType;
      expect(createdRequestType).toBe('multi');
      done();
    });

    it('should return a 404 ststus code for unexisting requestId',
      async (done) => {
        const response = await request(app)
          .get(`/api/v1/requests/${invalidId}`)
          .set('authorization', token);
        expect(response.status).toBe(404);
        expect(response.body).toEqual({
          error: `Request with id ${invalidId} does not exist`,
          success: false
        });
        done();
      });
  });

  describe('PUT /api/v1/requests/:requestId', () => {
    describe('Authenticated user', () => {
      it('should edit the request and return 200 and updated request',
        (done) => {
          const expectedResponse = {
            body: {
              ...editRequestSuccessResponse
            },
            status: 200,
          };
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

      it('should return 422 error if the user supplies empty fields',
        (done) => {
          const expectedResponse = {
            body: {
              ...emptyRequestResponse
            },
            status: 422,
          };
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
        };
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
      });
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
        };
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
      });
      it(`should return 409 error if the
        request has been approved or rejected`, (done) => {
        const expectedResponse = {
          body: {
            success: false,
            error: 'Request could not be updated because it has been approved'
          },
          status: 409,
        };
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
        };
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
        };
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
    beforeAll(async (done) => {
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
        async (done) => {
          const res = await request(app)
            .put('/api/v1/approvals/xDh20cuGy')
            .set('authorization', token)
            .send({ newStatus: 'Approved' });
          expect(res.statusCode).toEqual(200);
          expect(res.body.success).toEqual(true);
          expect(res.body.message).toEqual('Request approved successfully');
          done();
        });

      it(`should throw validation error when
        newStatus does not match expected input`, async (done) => {
        const newStatus = 'ApprovedRejected';

        const res = await request(app)
          .put('/api/v1/approvals/xDh20cuGy')
          .set('authorization', token)
          .send({ newStatus });
        expect(res.statusCode).toEqual(422);
        done();
      });

      it('should return an error if request is not found',
        async (done) => {
          const res = await request(app)
            .put('/api/v1/approvals/xDh20cu8T0')
            .set('authorization', token)
            .send({ newStatus: 'Approved' });
          expect(res.statusCode).toEqual(404);
          expect(res.body.success).toEqual(false);
          done();
        });
    });

    describe('Not Requesters Manager', () => {
      it('should return an error message', async (done) => {
        const res = await request(app)
          .put('/api/v1/approvals/xDh20cuGy')
          .set('authorization', nonRequestManagerToken)
          .send({ newStatus: 'Rejected' });
        expect(res.status).toBe(403);
        expect(res.body).toMatchObject({
          success: false,
          error: 'Permission denied, you are not requesters manager',
        });
        done();
      });
    });

    describe('Unauthenticated User', () => {
      it('should check if the token exists and return 401 if it does not',
        async (done) => {
          const res = await request(app)
            .put('/api/v1/approvals/xDh20cuT0')
            .send({ newStatus: 'Rejected' });
          expect(res.statusCode).toEqual(401);
          expect(res.body.success).toEqual(false);
          expect(res.body.error).toEqual('Please provide a token');
          done();
        });

      it('should check if the token is valid and return 401 if it is not',
        async (done) => {
          const res = await request(app)
            .put('/api/v1/approvals/xDh20cuT0')
            .set('Authorization', invalidToken)
            .send({ newStatus: 'Approved' });
          expect(res.status).toEqual(401);
          expect(res.body.success).toEqual(false);
          expect(res.body.error).toEqual('Token is not valid');
          done();
        });
    });

    describe('Requesters Manager', () => {
      it('should not update a requests status twice',
        async (done) => {
          const res = await request(app)
            .put('/api/v1/approvals/xDh20cuGy')
            .set('authorization', token)
            .send({ newStatus: 'Approved' });
          expect(res.statusCode).toEqual(400);
          expect(res.body.success).toEqual(false);
          expect(res.body.error).toEqual('Request has been approved already');
          done();
        });
    });

    describe('Requesters Manager', () => {
      beforeAll(async (done) => {
        await models.Approval.destroy({
          where: {
            requestId: 'xDh20cuGy',
          }
        });
        done();
      });

      it('should return an error message if approval does not exist',
        async (done) => {
          const res = await request(app)
            .put('/api/v1/approvals/xDh20cuGy')
            .set('authorization', token)
            .send({ newStatus: 'Rejected' });
          expect(res.status).toBe(404);
          expect(res.body).toMatchObject({
            success: false,
            error: 'Request not found',
          });
          done();
        });
    });
  });// end of REQUEST STATUS UPDATE

  // Tests to capture the sendNotificationToManager method
  describe('RequestController.sendNotificationToManager', () => {
    beforeAll(() => {
      // mock the modules and functions that will cause side-effects
      jest.mock('../../userRole/UserRoleController');
      jest.mock('../../notifications/NotificationEngine');

      UserRoleController.getRecipient = jest.fn()
        .mockReturnValue({ userId: '00023' });
      NotificationEngine.notify = jest.fn();
      NotificationEngine.sendMail = jest.fn();
    });

    // unmock these modules as they may be used in other tests
    afterAll(() => {
      jest.unmock('../../userRole/UserRoleController');
      jest.unmock('../../notifications/NotificationEngine');
    });


    it('should send "pending" notification if mailType is "New Request"',
      async (done) => {
        const {
          req, res, travelRequest, message, mailTopic, mailType
        } = generateMockData('New Request');
        await RequestsController.sendNotificationToManager(
          req, res, travelRequest, message, mailTopic, mailType
        );
        const [args] = NotificationEngine
          .notify.mock.calls[NotificationEngine.notify.mock.calls.length - 1];
        expect(args.notificationType).toEqual('pending');
        done();
      });

    it('should send "general" notification if mailType is "Updated Request"',
      async (done) => {
        // generate the mock data and call the function
        const {
          req, res, travelRequest, message, mailTopic, mailType
        } = generateMockData('Updated Request');
        await RequestsController.sendNotificationToManager(
          req, res, travelRequest, message, mailTopic, mailType
        );

        // get the arguments that NotificationEngine.notify was called with last
        const [args] = NotificationEngine
          .notify.mock.calls[NotificationEngine.notify.mock.calls.length - 1];
        expect(args.notificationType).toEqual('general');
        done();
      });

    it('should default to sending "general" notification if '
      + 'mailType is not given',
    async (done) => {
      // generate the mock data and call the function
      const {
        req, res, travelRequest, message, mailTopic, mailType
      } = generateMockData(undefined);
      await RequestsController.sendNotificationToManager(
        req, res, travelRequest, message, mailTopic, mailType
      );

      // get the arguments that NotificationEngine.notify was called with last
      const [args] = NotificationEngine
        .notify.mock.calls[NotificationEngine.notify.mock.calls.length - 1];
      expect(args.notificationType).toEqual('general');
      done();
    });
  });
});
