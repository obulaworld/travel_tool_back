/* eslint-disable */

import supertest from 'supertest';
import models from '../../../database/models';
import app from '../../../app';
import Utils from '../../../helpers/Utils';

const request = supertest;

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

const token = Utils.generateTestToken(payload);
const token1 = Utils.generateTestToken(payload1);
const invalidToken =
  'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySW5mbyI6eyJpZCI6Ii1MSEptS3J4';

describe('Notifications Controller', () => {
  describe('GET /api/v1/notifications', () => {
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
          .get('/api/v1/notifications')
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
      message for a user without notifications`, done => {
        const expectedResponse = {
          status: 404,
          body: {
            success: false,
            error: 'You have no notifications at the moment',
          },
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
      beforeEach(async done => {
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
            createdAt: "2018-08-16T11:11:52.181Z",
            updatedAt: '2018-08-16T11:11:52.181Z',
          }
        );
        notifications = JSON.parse(JSON.stringify(response));
        done();
      });

      it('should return 200 status, and notifications', done => {
        const expectedResponse = {
          status: 200,
          body: {
            success: true,
            message: 'Notification retrieved successfully',
            notifications: [notifications],
          },
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
      beforeEach(async done => {
        await models.Notification.drop();
        done();
      });

      afterAll(async done => {
        await models.sequelize.sync();
        done();
      });
    });
  });
});
