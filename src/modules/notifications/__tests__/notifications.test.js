/* eslint-disable */
import supertest from 'supertest';
import models from '../../../database/models';
import app from '../../../app';
import Utils from '../../../helpers/Utils';
import {
  userOgo,
  userOgoNotifications
} from './__mocks__/notificationsData';

const request = supertest;
const invalidToken =  'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySW5mbyI6eyJpZCI6Ii1MSEptS3J4'; // eslint-disable-line

describe('Notifications Controller', () => {
  describe('GET /api/v1/notifications', () => {
    const payload = {
      UserInfo: {
        id: '-MUyHJmKrxA90lPNQ1FOLNm',
        name: 'Samuel Kubai'
      },
    };

    const payload1 = {
      UserInfo: {
        id: '-MUyHJmKrxA90lPNOLNm',
        name: 'Optimum Price'
      },
    };

    beforeAll(async () => {
      await models.Notification.truncate();
    });

    afterAll(async () => {
      await models.Notification.truncate();
    });

    const token = Utils.generateTestToken(payload);
    const token1 = Utils.generateTestToken(payload1);

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
            .get('/api/v1/notifications')
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
            .get('/api/v1/notifications')
            .set('authorization', invalidToken)
            .end((err, res) => {
              expect(res).toMatchObject(expectedResponse);
              done();
            });
        });
    });

    describe('Authenticated user with no notifications', () => {
      it(`should return 200 status and the appropriate
      message for a user without notifications`, (done) => {
        const expectedResponse = {
          status: 404,
          body: {
            success: false,
            error: 'You have no notifications at the moment',
          }
        };
        request(app)
          .get('/api/v1/notifications')
          .set('authorization', token1)
          .end((err, res) => {
            expect(res.body).toMatchObject(expectedResponse.body);
            expect(res.body.error)
              .toEqual('You have no notifications at the moment');
            done();
          });
      });
    });

    describe('Authenticated user With notifications', () => {
      let notifications;
      beforeEach(async (done) => {
        const response = await models.Notification.create(
          {
            senderId: '-MUyH.JmKr0lPNQ1FOLNm',
            senderName: 'Test user B',
            senderImage: '/path/to/image',
            recipientId: '-MUyHJmKrxA90lPNOLNm',
            notificationType: 'pending',
            notificationStatus: 'unread',
            message: 'approved your request',
            requestId: 'xDh20cuGy',
            notificationLink: '/requests/link',
            createdAt: '2018-08-16T11:11:52.181Z',
            updatedAt: '2018-08-16T11:11:52.181Z',
          }
        );
        notifications = JSON.parse(JSON.stringify(response));
        done();
      });

      it('should return 200 status, and notifications', (done) => {
        const expectedResponse = {
          status: 200,
          body: {
            success: true,
            message: 'Notification retrieved successfully',
            notifications: [notifications],
          }
        };

        request(app)
          .get('/api/v1/notifications')
          .set('authorization', token1)
          .end((err, res) => {
            expect(res.body).toMatchObject(expectedResponse.body);
            expect(res.body.notifications.length).toEqual(1);
            done();
          });
      });
    });

    describe('Handle server errors', () => {
      beforeEach(async (done) => {
        await models.Notification.drop();
        done();
      });

      afterAll(async (done) => {
        await models.Notification.sync();
        done();
      });

      it('should return 500 status, and error message', (done) => {
        const expectedResponse = {
          status: 500,
          body: {
            success: false,
            error: 'Server Error'
          }
        };

        request(app)
          .get('/api/v1/notifications')
          .set('authorization', token)
          .end((err, res) => {
            expect(res.body).toMatchObject(expectedResponse.body);
            expect(res.body.notifications).toBe(undefined);
            done();
          });
      });
    });
  });

  describe('PUT /api/v1/notifications', () => {
    const payload = {
      UserInfo: {
        id: userOgo.userId,
        name: userOgo.fullName
      },
    };

    const userOgoToken = Utils.generateTestToken(payload);

    beforeAll(async () => {
      await models.Notification.truncate();
      await models.Notification.bulkCreate(userOgoNotifications);
    });

    afterAll(async () => {
      await models.Notification.truncate();
    });

    describe('Unauthenticated User', () => {
      it('should throw 401 error if user does not provide a token', (done) => {
        const expectedResponse = {
          status: 401,
          body: {
            success: false,
            error: 'Please provide a token',
          },
        };

        request(app)
          .put('/api/v1/notifications')
          .send({
            currentStatus: 'unread',
            newStatus: 'read',
            notificationType: 'pending'
          })
          .end((err, res) => {
            if (err) return done(err);
            expect(res.status).toEqual(expectedResponse.status);
            expect(res.body).toMatchObject(expectedResponse.body);
            done();
          });
      });

      it('should throw 401 error if user provides an invalid token',
        (done) => {
          const expectedResponse = {
            status: 401,
            body: {
              success: false,
              error: 'Token is not valid'
            }
          };

          request(app)
            .put('/api/v1/notifications')
            .set('authorization', invalidToken)
            .send({
              currentStatus: 'unread',
              newStatus: 'read',
              notificationType: 'pending'
            })
            .end((err, res) => {
              if (err) return done(err);
              expect(res.status).toEqual(expectedResponse.status);
              expect(res.body).toMatchObject(expectedResponse.body);
              done();
            });
        });
    });

    describe('Authenticated user with wrong payload', () => {
      it('should return 422 if newStatus is a number', (done) => {
        const expectedResponse = {
          status: 422,
          body: {
            success: false,
            errors: [
              {
                message: 'newStatus must be "read"',
                name: 'newStatus'
              }
            ]
          },
        };

        request(app)
          .put('/api/v1/notifications')
          .set('authorization', userOgoToken)
          .send({
            currentStatus: 'unread',
            newStatus: '12345',
            notificationType: 'pending'
          })
          .end((err, res) => {
            if (err) return done(err);
            expect(res.status).toEqual(expectedResponse.status);
            expect(res.body).toMatchObject(expectedResponse.body);
            done();
          });
      });

      it('should return 422 if newStatus is not `read`', (done) => {
        const expectedResponse = {
          status: 422,
          body: {
            success: false,
            errors: [
              {
                message: 'newStatus must be "read"',
                name: 'newStatus'
              }
            ]
          },
        };

        request(app)
          .put('/api/v1/notifications')
          .set('authorization', userOgoToken)
          .send({
            currentStatus: 'unread',
            newStatus: 'good',
            notificationType: 'pending'
          })
          .end((err, res) => {
            if (err) return done(err);
            expect(res.status).toEqual(expectedResponse.status);
            expect(res.body).toMatchObject(expectedResponse.body);
            done();
          });
      });

      it('should return 422 if currentStatus is not `unread`', (done) => {
        const expectedResponse = {
          status: 422,
          body: {
            success: false,
            errors: [
              {
                message: 'currentStatus must be "unread"',
                name: 'currentStatus'
              }
            ]
          },
        };

        request(app)
          .put('/api/v1/notifications')
          .set('authorization', userOgoToken)
          .send({
            currentStatus: 'read',
            newStatus: 'read',
            notificationType: 'pending'
          })
          .end((err, res) => {
            expect(res.status).toEqual(expectedResponse.status);
            expect(res.body).toMatchObject(expectedResponse.body);
            done();
          });
      });

      it(`should return 422 if notificationType is
        neither pending nor general`, (done) => {
        const expectedResponse = {
          status: 422,
          body: {
            success: false,
            errors: [
              {
                message: 'notificationType can only be pending or general',
                name: 'notificationType'
              }
            ]
          },
        };

        request(app)
          .put('/api/v1/notifications')
          .set('authorization', userOgoToken)
          .send({
            currentStatus: 'unread',
            newStatus: 'read',
            notificationType: 'wrong'
          })
          .end((err, res) => {
            if (err) return done(err);
            expect(res.status).toEqual(expectedResponse.status);
            expect(res.body).toMatchObject(expectedResponse.body);
            done();
          });
      });

      it('should return 422 if payload doesn\'t have `newStatus` property',
        (done) => {
          const expectedResponse = {
            status: 422,
            body: {
              success: false,
              message: 'Validation failed',
              errors: [
                {
                  message: 'newStatus field is required',
                  name: 'newStatus'
                },
                {
                  message: 'newStatus must be "read"',
                  name: 'newStatus'
                }
              ]
            },
          };

          request(app)
            .put('/api/v1/notifications')
            .set('authorization', userOgoToken)
            .send({
              currentStatus: 'unread',
              notificationType: 'general'
            })
            .end((err, res) => {
              if (err) return done(err);
              expect(res.status).toEqual(expectedResponse.status);
              expect(res.body).toMatchObject(expectedResponse.body);
              done();
            });
        });

      it(`should return 422 if payload
          doesn't have "notificationType" property`,
      (done) => {
        const expectedResponse = {
          status: 422,
          body: {
            success: false,
            errors: [
              {
                message: 'notificationType field is required',
                name: 'notificationType'
              },
              {
                message: 'notificationType can only be pending or general',
                name: 'notificationType'
              },
            ]
          },
        };

        request(app)
          .put('/api/v1/notifications')
          .set('authorization', userOgoToken)
          .send({
            currentStatus: 'unread',
            newStatus: 'read'
          })
          .end((err, res) => {
            if (err) return done(err);
            expect(res.status).toEqual(expectedResponse.status);
            expect(res.body).toMatchObject(expectedResponse.body);
            done();
          });
      });
    });

    describe('Authenticated user with unread notifications', () => {
      it('should return 200 if notifications were successfully updated',
        (done) => {
          const expectedResponse = {
            status: 200,
            body: {
              success: true,
              message: 'All general notifications have been marked as read',
            },
          };

          request(app)
            .put('/api/v1/notifications')
            .set('authorization', userOgoToken)
            .send({
              currentStatus: 'unread',
              newStatus: 'read',
              notificationType: 'general'
            })
            .end((err, res) => {
              if (err) return done(err);
              expect(res.status).toEqual(expectedResponse.status);
              expect(res.body).toMatchObject(expectedResponse.body);
              done();
            });
        });
    });

    describe('Authenticated user with no unread notifications', () => {
      it('should throw 404 error if no unread notification', (done) => {
        const expectedResponse = {
          status: 404,
          body: {
            success: false,
            error: 'You have no general notifications at the moment'
          },
        };

        request(app)
          .put('/api/v1/notifications')
          .set('authorization', userOgoToken)
          .send({
            currentStatus: 'unread',
            newStatus: 'read',
            notificationType: 'general'
          })
          .end((err, res) => {
            if (err) return done(err);
            expect(res.status).toEqual(expectedResponse.status);
            expect(res.body).toMatchObject(expectedResponse.body);
            done();
          });
      });
    });

    describe('Handle server errors', () => {
      beforeAll(async (done) => {
        await models.Notification.drop();
        done();
      });

      afterAll(async (done) => {
        await models.Notification.sync();
        done();
      });

      it('should return 500 status, and error message', (done) => {
        const expectedResponse = {
          status: 500,
          body: {
            success: false,
            error: 'Server Error'
          }
        };

        request(app)
          .put('/api/v1/notifications')
          .set('authorization', userOgoToken)
          .send({
            currentStatus: 'unread',
            newStatus: 'read',
            notificationType: 'general'
          })
          .end((err, res) => {
            expect(res.body).toMatchObject(expectedResponse.body);
            done();
          });
      });
    });
  });
});