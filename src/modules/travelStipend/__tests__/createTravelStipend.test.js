import supertest from 'supertest';
import app from '../../../app';
import models from '../../../database/models';
import { role } from '../../userRole/__tests__/mocks/mockData';
import mockData from './__mocks__/travelStipendMock';
import Utils from '../../../helpers/Utils';

const request = supertest(app);
const url = '/api/v1/travelStipend';

describe('TravelStipends', () => {
  const destroyTables = async () => {
    await models.TravelStipends.destroy({ force: true, truncate: { cascade: true } });
    await models.UserRole.destroy({ force: true, truncate: { cascade: true } });
    await models.Center.destroy({ truncate: true, cascade: true });
    await models.Role.destroy({ truncate: { cascade: true }, force: true });
    await models.User.destroy({ truncate: { cascade: true }, force: true });
  };

  const {
    user, payload, userRole, centers, listOfStipends
  } = mockData;

  beforeAll(async () => {
    await destroyTables();
    await models.User.create(user);
    await models.Role.bulkCreate(role);
    await models.Center.bulkCreate(centers);
    await models.UserRole.bulkCreate(userRole);
    await models.TravelStipends.bulkCreate(listOfStipends);
  });

  afterAll(async () => {
    await destroyTables();
  });

  const token = Utils.generateTestToken(payload);
  
  describe('Create Travel Stipends: POST /api/v1/travelStipend', () => {
    it('should throw 422 error if the user does not provide a stipend and a location',
      (done) => {
        const expectedResponse = {
          success: false,
          message: 'Validation failed',
          errors: [
            {
              message: 'stipend is required and must be a Number',
              name: 'stipend'
            },
            {
              message: 'center is required',
              name: 'center'
            }
          ]
        };
        request
          .post(url)
          .set('authorization', token)
          .end((err, res) => {
            if (err) done(err);
            expect(res.body).toMatchObject(expectedResponse);
            done();
          });
      });

    it('should throw 422 error if amount is not a number',
      (done) => {
        const expectedResponse = {
          status: 422,
          body: {
            success: false,
            errors: [
              {
                message: 'stipend is required and must be a Number',
                name: 'stipend'
              },
              {
                message: 'center is required',
                name: 'center'
              }
            ]
          }
        };
        request
          .post(url)
          .set('authorization', token)
          .send({ stipend: 'hrfjfgjf' })
          .end((err, res) => {
            if (err) done(err);
            expect(res).toMatchObject(expectedResponse);
            done();
          });
      });

    it('should throw 409 error if a travel stipend exists for the location',
      (done) => {
        request
          .post(url)
          .set('authorization', token)
          .send({
            center: 'Lagos',
            stipend: 4556
          })
          .expect(409)
          .end((err, res) => {
            if (err) done(err);
            expect(res.body.success).toEqual(false);
            expect(res.body.message).toEqual('A travel stipend already exists for this center');
            done();
          });
      });
    it('should create a new stipend for a location successfully',
      (done) => {
        request
          .post(url)
          .set('authorization', token)
          .send(
            {
              center: 'Nairobi',
              stipend: 75
            }
          )
          .expect(201)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.success).toEqual(true);
            expect(res.body.message).toEqual('Successfully created a new travel stipend for Nairobi');
            done();
          });
      });
    it('should not create a new stipend for a location that does not exist',
      (done) => {
        request
          .post(url)
          .set('authorization', token)
          .send(
            {
              center: 'Naples',
              stipend: 75
            }
          )
          .expect(404)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.success).toEqual(false);
            expect(res.body.message).toEqual('This Center does not exist');
            done();
          });
      });
  });
});
