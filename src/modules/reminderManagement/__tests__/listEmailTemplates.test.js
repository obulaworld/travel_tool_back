import supertest from 'supertest';
import app from '../../../app';
import models from '../../../database/models';
import { role } from '../../userRole/__tests__/mocks/mockData';
import mockData from './__mocks__/listEmailTemplatesMock';
import Utils from '../../../helpers/Utils';

const request = supertest;

describe('list Email Templates', () => {
  const destroyTables = async () => {
    await models.UserRole.destroy({ force: true, truncate: { cascade: true } });
    await models.Role.destroy({ force: true, truncate: { cascade: true } });
    await models.User.destroy({ force: true, truncate: { cascade: true } });
    await models.ReminderEmailTemplate.destroy({ force: true, truncate: { cascade: true } });
  };

  const {
    user, list, payload, userRole
  } = mockData;

  beforeAll(async () => {
    await destroyTables();
    await models.User.create(user);
    await models.Role.bulkCreate(role);
    await models.UserRole.bulkCreate(userRole);
    await models.ReminderEmailTemplate.bulkCreate(list.templates);
  });
  afterAll(async () => {
    await destroyTables();
  });

  const token = Utils.generateTestToken(payload);

  it('gets the count of all templates', (done) => {
    request(app).get('/api/v1/reminderManagement/emailTemplates')
      .set('Authorization', token)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toEqual(200);
        expect(res.body.metaData.pagination.totalCount).toEqual(list.templates.length);
        done();
      });
  });

  it('searches if provided with search parameter', (done) => {
    const url = '/api/v1/reminderManagement/emailTemplates?search=visa';
    const test = request(app)
      .get(url)
      .set('Authorization', token);
    test.end((err, res) => {
      if (err) done(err);
      const { body: { metaData: { pagination: { totalCount } } } } = res;
      expect(totalCount).toEqual(1);
      done();
    });
  });
});
