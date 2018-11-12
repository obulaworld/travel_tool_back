/* eslint-disable */
import supertest from 'supertest';
import cloudinary from 'cloudinary';
import models from '../../../database/models';
import app from '../../../app';
import Utils from '../../../helpers/Utils';
import path from 'path';
import { checklistSubmission,checklist, requestMock, tripsMock, bedData, roomData, guestHouse, userData } from '../../travelChecklist/__tests__/mocks/mockData';

class Error {
    static handleError(error) {
      return error;
    }
  }
let  uploader = class uploader{
    static async upload (file, options, callback) {
        const containers = file.split('/')
        const fileName = containers[containers.length-1]
        const result = {
            url: 'http://example.com/file.pdf',
            secure_url: 'https://example.com/file.pdf',
            public_id: 'gcgg7xkbj90-nv',
            original_filename: `${fileName}`,
        }
        const error={};
        if(containers.length>2){
            return callback(error, result)
        }
        if(containers.length===2){
            const theError = {error:{errno: -2, path: file}};
            throw Error.handleError(theError)
        }
        throw Error.handleError({message:'server error', status: 500})
        
    }
}
cloudinary.v2.uploader = uploader;

cloudinary.config=({})=>jest.fn();

const requesterPayload = {
    UserInfo: {
      id: '-AVwHJmKrxA90lPNQ1FOLNn',
      fullName: 'Mark Marcus',
      email: 'mark.marcus@andela.com',
      name: 'Mark',
      picture: '',
      userId: '-AVwHJmKrxA90lPNQ1FOLNn'
    },
  };

const request = supertest(app);
const token = Utils.generateTestToken(requesterPayload);

describe('Travel ChecklistController', () => {
  describe('POST /checklists/:checklistItemId/submission', () => {
      afterEach(async (done)=>{
          await models.ChecklistSubmission.destroy({ force: true, truncate: { cascade: true } });
          done()
      })
    it('should create submission if upload false', (done) => {
        request
        .post('/api/v1/checklists/46664/submission')
        .set('Content-Type', 'application/json')
        .set('authorization', token)
        .send({
            "file": null,
            "submissionId":null,
            "tripId": '35678',
            "isUpload": false,
            "data":{
                "airline": "Kenya Airways",
                "flightNumber": "KQ 532",
                "arrivalTime": "19:35:00"
            },
            "label":"AirTicket"
        })
        .end((err, res) => {
          expect(res.body.success).toEqual(true);
          expect(res.body.message)
            .toEqual('Uploaded Successfully');
          if (err) return done(err);
          done();
        });
    });
    it('should create submission when upload true', (done) => {
        const absolutePath = path.resolve('./src/modules/travelChecklist/__tests__/upload.yml');
        request
        .post('/api/v1/checklists/466764/submission')
        .set('Content-Type', 'application/json')
        .set('authorization', token)
        .send({
            "file": absolutePath,
            "submissionId":null,
            "tripId": '87678',
            "isUpload": true,
            "data":null,
            "label": "PassPort"
        })
        .end((err, res) => {
          expect(res.body.success).toEqual(true);
          expect(res.body.message)
            .toEqual('Uploaded Successfully');
          if (err) return done(err);
          done();
        });
    });
    it('should update checklist item submission', async(done) => {
        const absolutePath = path.resolve('./src/modules/travelChecklist/__tests__/upload.yml');
        await models.ChecklistSubmission.create(checklistSubmission);
        request
        .post('/api/v1/checklists/46664/submission')
        .set('Content-Type', 'application/json')
        .set('authorization', token)
        .send({
            "file": absolutePath,
            "submissionId": '1',
            "tripId": '35678',
            "isUpload": true,
            "data":null,
            "label": "YelloFever"
        })
        .end((err, res) => {
          expect(res.body.success).toEqual(true);
          expect(res.body.message)
            .toEqual('Uploaded Successfully');
          if (err) return done(err);
          done();
        });
    });
    it('should throw error with wrong file path', (done) => {
        request
        .post('/api/v1/checklists/46664/submission')
        .set('Content-Type', 'application/json')
        .set('authorization', token)
        .send({
            "file": 'travelChecklist/upload',
            "submissionId":null,
            "tripId": '35678',
            "isUpload": true,
            "data":null,
            "label":"YelloFever"
  })
  .end((err, res) => {
    expect(res.body.success).toEqual(false);
    expect(res.body.error.error.path)
      .toEqual('travelChecklist/upload');
    if (err) return done(err);
    done();
  });
});
it('should throw 500 error when server crashes', (done) => {
request
.post('/api/v1/checklists/466764/submission')
.set('Content-Type', 'application/json')
.set('authorization', token)
.send({ 
  "file": undefined,
  "submissionId": null,
  "tripId": {num:765678},
  "isUpload": true,
  "data":null,
  "label": "YelloFever" })
.end((err, res) => {
expect(res.body.success).toEqual(false);
expect(res.body.error.message)
  .toEqual('server error');
if (err) return done(err);
done();
});
});
})
  describe('GET /checklists/:requestId/submission', () => {
    afterEach(async (done)=>{
        await models.ChecklistSubmission.destroy({ force: true, truncate: { cascade: true } });
        done()
    })
      it('should get check item submission', async(done) => {
        await models.User.create(userData) 
        await models.GuestHouse.create(guestHouse)
        await models.Request.create(requestMock);
        await models.Room.create(roomData)
        await models.Bed.bulkCreate(bedData)
        await models.Trip.create(tripsMock)
        await models.ChecklistItem.create(checklist)
        await models.ChecklistSubmission.create(checklistSubmission)
          request
          .get('/api/v1/checklists/35678/submission')
          .set('Authorization', token)
          .end((err, res) => {
              expect(res.body.success).toBe(true)
              expect(res.body.message).toEqual('Successfully retrieved')
              done()
          });
      })
      it('should return null for non existent submission', async(done) => {
          request
          .get('/api/v1/checklists/35678/submission')
          .set('Authorization', token)
          .end((err, res) => {
              expect(res.body.success).toBe(true)
              expect(res.body.message).toEqual('Submission does not exist')
              done()
          });
      })
  })
});