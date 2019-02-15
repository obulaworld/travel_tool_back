import supertest from 'supertest';
import app from '../../../app';
import models from '../../../database/models';
import { role } from '../../userRole/__tests__/mocks/mockData';
import mockData from './__mocks__/travelStipendMock';
import Utils from '../../../helpers/Utils';

const request = supertest(app);
const url = '/api/v1/travelStipend';
const {
  user, payload, userRole, centers, listOfStipends,
  payloadNotAdmin,
} = mockData;
const token = Utils.generateTestToken(payload);
const nonAdminToken = Utils.generateTestToken(payloadNotAdmin);

describe('TravelStipends', () => {
  const prepareTables = async () => {
    await models.TravelStipends.destroy({ force: true, truncate: { cascade: true } });
    await models.UserRole.destroy({ force: true, truncate: { cascade: true } });
    await models.Center.destroy({ truncate: true, cascade: true });
    await models.Role.destroy({ truncate: { cascade: true }, force: true });
    await models.User.destroy({ truncate: { cascade: true }, force: true });
  };

  beforeAll(async () => {
    await prepareTables();
    await models.User.bulkCreate(user);
    await models.Role.bulkCreate(role);
    await models.Center.bulkCreate(centers);
    await models.UserRole.bulkCreate(userRole);
    await models.TravelStipends.bulkCreate(listOfStipends);
  });

  afterAll(async () => {
    await prepareTables();
  });

  describe('Delete Travel Stipend: DELETE /api/v1/travelStipend/:id', () => {
    it('should throw 500 if id is not an integer',
      (done) => {
        const expectedResponse = {
          success: false,
          error: 'Stipend id should be an integer'
        };
        request
          .delete(`${url}/rt`)
          .set('authorization', token)
          .end((err, response) => {
            if (err)done(err);
            expect(response.statusCode).toEqual(400);
            expect(response.body).toEqual(expectedResponse);
            done();
          });
      });

    it('should throw 404 error if the stipend does not exist',
      (done) => {
        const expectedResponse = {
          success: false,
          error: 'Travel stipend does not exist'
        };
        request
          .delete(`${url}/789000`)
          .set('authorization', token)
          .end((err, res) => {
            if (err) done(err);
            expect(res.statusCode).toEqual(404);
            expect(res.body).toEqual(expectedResponse);
            done();
          });
      });

    it('should throw 200 if the stipend is successfully deleted',
      (done) => {
        const travelStipendId = listOfStipends[0].id;
        const expectedResponse = {
          success: true,
          message: 'Travel Stipend deleted successfully'
        };
        request
          .delete(`${url}/${travelStipendId}`)
          .set('authorization', token)
          .end((err, res) => {
            if (err) done(err);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(expectedResponse);
            done();
          });
      });

    it('should throw 404 error if stipend is already deleted',
      (done) => {
        const travelStipendId = listOfStipends[0].id;
        const expectedResponse = {
          success: false,
          error: 'Travel stipend does not exist'
        };
        request
          .delete(`${url}/${travelStipendId}`)
          .set('authorization', token)
          .end((err, res) => {
            if (err) done(err);
            expect(res.statusCode).toEqual(404);
            expect(res.body).toEqual(expectedResponse);
            done();
          });
      });

    it('should throw 403 error if the user is not superadmin', (done) => {
      const travelStipendId = listOfStipends[0].id;
      request
        .delete(`${url}/${travelStipendId}`)
        .set('authorization', nonAdminToken)
        .end((err, res) => {
          if (err) done(err);
          expect(res.statusCode).toEqual(403);
          done();
        });
    });
  });
});
