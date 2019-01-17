import request from 'supertest';
import app from '../../../app';
import Utils from '../../../helpers/Utils';
import models from '../../../database/models';
import { role } from '../../userRole/__tests__/mocks/mockData';
import {
  travelAdmin,
  travelAdminPayload,
  usersData,
  travelAdminRole,
  requesterPayload
} from '../../travelReadinessDocuments/__tests__/__mocks__';
import {
  reminderPayload,
  reminderPayloadWithoutTemplate,
  reminderPayloadWithInvalidTemplate,
  reminderPayloadWithoutConditionName,
  reminderPayloadWithInvalidDocumentType,
  reminderTemplates,
  reminderPayloadWithInvalidFrequency
} from './__mocks__/mockData';

const travelAdminToken = Utils.generateTestToken(travelAdminPayload);
const requesterToken = Utils.generateTestToken(requesterPayload);

const setup = async () => {
  await models.UserRole.destroy({ force: true, truncate: { cascade: true } });
  await models.Role.destroy({ force: true, truncate: { cascade: true } });
  await models.Condition.destroy({ force: true, truncate: { cascade: true } });
  await models.Reminder.destroy({ force: true, truncate: { cascade: true } });
  await models.User.destroy({ force: true, truncate: { cascade: true } });
};

describe('Reminders Controller', () => {
  beforeAll(async () => {
    await setup();
    await models.Role.bulkCreate(role);
    await models.User.create(travelAdmin);
    await models.UserRole.create(travelAdminRole);
    await models.User.bulkCreate(usersData);
    await models.ReminderEmailTemplate.bulkCreate(reminderTemplates);
  });

  afterAll(async () => {
    await setup();
  });

  const URI = '/api/v1/reminders';

  describe('createReminder', () => {
    it('should require a valid token', (done) => {
      request(app)
        .post(URI)
        .set('Content-Type', 'application/json')
        .send(reminderPayload)
        .end((err, res) => {
          expect(res.status).toEqual(401);
          expect(res.body.error).toEqual('Please provide a token');
          done();
        });
    });

    it('should not be accessed by an unauthenticated user', (done) => {
      const invalidToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySW5';
      request(app)
        .post(URI)
        .set('Content-Type', 'application/json')
        .set('authorization', invalidToken)
        .send(reminderPayload)
        .end((err, res) => {
          expect(res.status).toEqual(401);
          expect(res.body.error).toEqual('Token is not valid');
          done();
        });
    });

    it('should require user to be an admin', (done) => {
      request(app)
        .post(URI)
        .set('Content-Type', 'application/json')
        .set('authorization', requesterToken)
        .send(reminderPayload)
        .end((err, res) => {
          expect(res.status).toEqual(403);
          expect(res.body.success).toEqual(false);
          expect(res.body.error).toEqual('You don\'t have access to perform this action');
          if (err) return done(err);
          done();
        });
    });

    it('should create a new reminder and return a success message', (done) => {
      request(app)
        .post(URI)
        .set('Content-Type', 'application/json')
        .set('authorization', travelAdminToken)
        .send(reminderPayload)
        .end((err, res) => {
          expect(res.status).toEqual(201);
          expect(res.body.success).toEqual(true);
          expect(res.body.reminder).toHaveProperty('condition');
          expect(res.body.reminder).toHaveProperty('reminders');
          done();
        });
    });

    it('should not create a new reminder with an existing reminder condition name', (done) => {
      request(app)
        .post(URI)
        .set('Content-Type', 'application/json')
        .set('authorization', travelAdminToken)
        .send(reminderPayload)
        .end((err, res) => {
          expect(res.status).toEqual(422);
          expect(res.body.errors).toEqual([{
            message: 'Reminder condition name already exists',
            name: 'conditionName'
          }]);
          done();
        });
    });

    it('should throw an error if assigned email template does not exist', (done) => {
      request(app)
        .post(URI)
        .set('Content-Type', 'application/json')
        .set('authorization', travelAdminToken)
        .send(reminderPayloadWithInvalidTemplate)
        .end((err, res) => {
          expect(res.status).toEqual(422);
          expect(res.body.success).toEqual(false);
          expect(res.body.errors).toEqual([{
            message: 'Reminder email template does not exist',
            name: 'reminders[0].reminderEmailTemplateId'
          }, {
            message: 'Reminder email template does not exist',
            name: 'reminders[1].reminderEmailTemplateId'
          }]);
          done();
        });
    });

    it('should throw an error if email template is not assigned to a reminder item', (done) => {
      request(app)
        .post(URI)
        .set('Content-Type', 'application/json')
        .set('authorization', travelAdminToken)
        .send(reminderPayloadWithoutTemplate)
        .end((err, res) => {
          expect(res.status).toEqual(422);
          expect(res.body.success).toEqual(false);
          expect(res.body.errors).toEqual([{
            message: 'Reminder email template is required',
            name: 'reminders[0].reminderEmailTemplateId'
          }, {
            message: 'Reminder email template must be a number',
            name: 'reminders[0].reminderEmailTemplateId'
          }]);
          done();
        });
    });

    it('should not allow null value for condition name', (done) => {
      request(app)
        .post(URI)
        .set('Content-Type', 'application/json')
        .set('authorization', travelAdminToken)
        .send(reminderPayloadWithoutConditionName)
        .end((err, res) => {
          expect(res.status).toEqual(422);
          expect(res.body.success).toEqual(false);
          expect(res.body.errors).toEqual([{
            message: 'Condition Name is required',
            name: 'conditionName'
          }, {
            message: 'Condition name should be more than 4 characters',
            name: 'conditionName'
          }]);
          done();
        });
    });

    it('should not allow invalid document type', (done) => {
      request(app)
        .post(URI)
        .set('Content-Type', 'application/json')
        .set('authorization', travelAdminToken)
        .send(reminderPayloadWithInvalidDocumentType)
        .end((err, res) => {
          expect(res.status).toEqual(422);
          expect(res.body.success).toEqual(false);
          expect(res.body.errors).toEqual([{
            message: 'Document Type is either Passport or Visa',
            name: 'documentType'
          }]);
          done();
        });
    });

    it('should not allow invalid reminder frequency', (done) => {
      request(app)
        .post(URI)
        .set('Content-Type', 'application/json')
        .set('authorization', travelAdminToken)
        .send(reminderPayloadWithInvalidFrequency)
        .end((err, res) => {
          expect(res.status).toEqual(422);
          expect(res.body.success).toEqual(false);
          expect(res.body.errors).toEqual([{
            message: 'Invalid reminder frequency value',
            name: 'reminders[1].frequency'
          }]);
          done();
        });
    });
  });
});
