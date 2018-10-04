import supertest from 'supertest';
import sgMail from '@sendgrid/mail';
import app from '../../../app';
import models from '../../../database/models';
import Utils from '../../../helpers/Utils';
import mockData from './mocks/mocksData';
import { role } from '../../userRole/__tests__/mocks/mockData';

sgMail.send = jest.fn();

global.io = {
  sockets: {
    emit: (event, dataToEmit) => dataToEmit
  }
};
const request = supertest(app);
const payload = {
  UserInfo: {
    id: '-MUyHJmKrxA90lPNQ1FOLNm',
    name: 'Doctor Strange',
    email: 'doctor.strange@andela.com',
    picture: 'fakepicture.png',
    roleid: 53019
  }
};
const otherUser = {
  UserInfo: {
    id: '-MUnaemKrxA90lPNQ1FOLNm',
    name: 'Dark Knight',
    email: 'dark.knight@andela.com',
    picture: 'fakepicture.png',
    roleid: 53019
  }
};
const token = Utils.generateTestToken(payload);
const otherUsertoken = Utils.generateTestToken(otherUser);
const invalidToken = 'eyJhbGciOiJSUzI1NiIsXVCJ9.eyJVc2VySW5mbyI6eyJpZ';
describe('Comments controller', () => {
  beforeAll((done) => {
    models.Role.bulkCreate(role);
    models.User.create(mockData.userMock);
    models.Request.bulkCreate(mockData.requestsMock);
    done();
  });
  afterAll((done) => {
    models.Role.destroy({ force: true, truncate: { cascade: true } });
    models.User.destroy({ force: true, truncate: { cascade: true } });
    models.Request.destroy({ force: true, truncate: { cascade: true } });
    models.Comment.destroy({ force: true, truncate: { cascade: true } });
    done();
  });
  describe('Unauthenticated user', () => {
    it('should throw 401 error if the user does not provide a token',
      (done) => {
        const expectedResponse = {
          status: 401,
          body: {
            success: false,
            error: 'Please provide a token'
          }
        };
        request.post('/api/v1/comments')
          .send({
            comment: "I thought we agreed you'd spend only two weeks",
            requestId: '-ss60B42oZ-invalid'
          })
          .end((err, res) => {
            if (err) done(err);
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
            error: 'Token is not valid'
          }
        };
        request
          .post('/api/v1/comments')
          .set('authorization', invalidToken)
          .end((err, res) => {
            if (err) done(err);
            expect(res).toMatchObject(expectedResponse);
            done();
          });
      });
  });
  describe('Authenticated User', () => {
    describe('POST api/v1/comments', () => {
      it('throws 404 if the requestId does not match', (done) => {
        const expectedResponse = {
          success: false,
          error: 'Request does not exist'
        };
        request
          .post('/api/v1/comments')
          .set('authorization', token)
          .send({
            comment: "I thought we agreed you'd spend only two weeks",
            requestId: '-ss60B42oZ-invalid'
          })
          .end((err, response) => {
            if (err) done(err);
            expect(response.statusCode).toEqual(404);
            expect(response.body).toEqual(expectedResponse);
            done();
          });
      });

      it('returns 201 and creates a new comment', (done) => {
        const expectedResponse = {
          success: true,
          message: 'Comment created successfully',
          comment: {
            comment: "I thought we agreed you'd spend only two weeks",
            requestId: '-ss60B42oZ-a',
            userName: 'Doctor Strange',
            userEmail: 'doctor.strange@andela.com'
          }
        };
        request
          .post('/api/v1/comments')
          .set('authorization', token)
          .send({
            comment: "I thought we agreed you'd spend only two weeks",
            requestId: '-ss60B42oZ-a'
          })
          .end((err, res) => {
            if (err) done(err);
            const {
              comment, requestId, userName, userEmail
            } = res.body.comment;
            expect(res.statusCode).toEqual(201);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toEqual(expectedResponse.message);
            expect(comment).toEqual(expectedResponse.comment.comment);
            expect(requestId).toEqual(expectedResponse.comment.requestId);
            expect(userName).toEqual(expectedResponse.comment.userName);
            expect(userEmail).toEqual(expectedResponse.comment.userEmail);
            done();
          });
      });
    });
    describe('PUT api/v1/comments/:id', () => {
      beforeAll(async (done) => {
        await models.Comment.truncate();
        await models.Comment.create(mockData.commentMock);
        done();
      });
      it('throws 404 if the requestId does not match', (done) => {
        const expectedResponse = {
          success: false,
          error: 'Request does not exist'
        };
        request
          .put('/api/v1/comments/1')
          .set('authorization', token)
          .send({
            comment: "I thought we agreed you'd spend only two weeks",
            requestId: '-ss60B42oZ-invalid'
          })
          .end((err, response) => {
            if (err) done(err);
            expect(response.statusCode).toEqual(404);
            expect(response.body).toEqual(expectedResponse);
            done();
          });
      });
      it('throws 404 if the commentId does not match', (done) => {
        const expectedResponse = {
          success: false,
          error: 'Comment does not exist'
        };
        request
          .put('/api/v1/comments/5')
          .set('authorization', token)
          .send({
            requestId: '-ss60B42oZ-a',
            comment: "I thought we agreed you'd spend only one week",
          })
          .end((err, response) => {
            if (err) done(err);
            expect(response.statusCode).toEqual(404);
            expect(response.body).toEqual(expectedResponse);
            done();
          });
      });
      it('returns 200 and updates a comment', (done) => {
        const { id } = mockData.commentMock;
        request
          .put(`/api/v1/comments/${id}`)
          .set('authorization', token)
          .send({
            requestId: '-ss60B42oZ-a',
            comment: "I thought we agreed you'd spend only one week",
          })
          .end((err, response) => {
            if (err) done(err);
            expect(response.statusCode).toEqual(200);
            done();
          });
      });
    });
    describe('DELETE api/v1/comments/:id', () => {
      const { id } = mockData.commentMock;
      it('throws 404 if the commentId is not found', async (done) => {
        const expectedResponse = {
          success: false,
          error: 'Comment does not exist'
        };
        const response = await request
          .delete('/api/v1/comments/666')
          .set('authorization', token);
        expect(response.statusCode).toEqual(404);
        expect(response.body).toEqual(expectedResponse);
        done();
      });
      it('throws 401 if comment was created by a different user', async (done) => {
        const expectedResponse = {
          success: false,
          message: 'You are not allowed to delete this comment',
        };
        const response = await request
          .delete(`/api/v1/comments/${id}`)
          .set('authorization', otherUsertoken);
        expect(response.statusCode).toEqual(401);
        expect(response.body).toEqual(expectedResponse);
        done();
      });
      it('returns 200 and deletes a comment', async (done) => {
        const expectedResponse = {
          success: true,
          message: 'Comment deleted successfully',
        };
        const response = await request
          .delete(`/api/v1/comments/${id}`)
          .set('authorization', token);
        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual(expectedResponse);
        done();
      });
    });
  });
});
