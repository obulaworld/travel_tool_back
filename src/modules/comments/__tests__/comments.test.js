import supertest from 'supertest';
import app from '../../../index';
import models from '../../../database/models';
import Utils from '../../../helpers/Utils';
import mockData from './mocks/mocksData';

const request = supertest(app);

const payload = {
  UserInfo: {
    id: '-MUyHJmKrxA90lPNQ1FOLNm',
    name: 'Doctor Strange',
    email: 'doctor.strange@andela.com',
    picture: 'fakepicture.png',
  },
};

const token = Utils.generateTestToken(payload);
const invalidToken = 'eyJhbGciOiJSUzI1NiIsXVCJ9.eyJVc2VySW5mbyI6eyJpZ';

describe('Comments controller', () => {
  beforeAll(async (done) => {
    try {
      await models.Request.bulkCreate(mockData.requestsMock);
      done();
    } catch (error) {
      throw new Error(error);
    }
  });

  describe('Unauthenticated user', () => {
    it('should throw 401 error if the user does not provide a token',
      async () => {
        const expectedResponse = {
          status: 401,
          body: {
            success: false,
            error: 'Please provide a token',
          },
        };
        const res = await request
          .post('/api/v1/comments')
          .send({
            comment: "I thought we agreed you'd spend only two weeks",
            requestId: '-ss60B42oZ-invalid',
          });
        expect(res).toMatchObject(expectedResponse);
      });

    it("should throw 401 error if the user's provides an invalid token",
      async () => {
        const expectedResponse = {
          status: 401,
          body: {
            success: false,
            error: 'Token is not valid',
          },
        };
        const res = await request
          .post('/api/v1/comments')
          .set('authorization', invalidToken);
        expect(res).toMatchObject(expectedResponse);
      });
  });

  describe('Authenticated User', () => {
    describe('POST api/v1/comments', () => {
      it('throws 404 if the requestId does not match', async () => {
        const expectedResponse = {
          success: false,
          error: 'Request does not exist',
        };
        const res = await request
          .post('/api/v1/comments')
          .set('authorization', token)
          .send({
            comment: "I thought we agreed you'd spend only two weeks",
            requestId: '-ss60B42oZ-invalid',
          });
        expect(res.statusCode).toEqual(404);
        expect(res.body).toEqual(expectedResponse);
      });

      it('returns 201 and creates a new comment', async () => {
        const expectedResponse = {
          success: true,
          message: 'Comment created successfully',
          comment: {
            id: 1,
            comment: "I thought we agreed you'd spend only two weeks",
            requestId: '-ss60B42oZ-a',
            userName: 'Doctor Strange',
            userEmail: 'doctor.strange@andela.com',
          },
        };
        const res = await request
          .post('/api/v1/comments')
          .set('authorization', token)
          .send({
            comment: "I thought we agreed you'd spend only two weeks",
            requestId: '-ss60B42oZ-a',
          });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toMatchObject(expectedResponse);
      });
    });
  });
});
