import request from 'supertest';
import moxios from 'moxios';
import models from '../../../database/models';
import app from '../../../app';
import Utils from '../../../helpers/Utils';
import { role } from '../../userRole/__tests__/mocks/mockData';

const payload = {
  UserInfo: {
    id: '-LTI9_PM3tV39gffhUIE',
    first_name: 'Moses',
    last_name: 'Gitau',
    firstName: 'Moses',
    lastName: 'Gitau',
    email: 'moses.gitau@andela.com',
    name: 'Moses Gitau',
    picture: 'fake.png',
    location: 'Nairobi, Kenya'
  },
};

const trips = [
  {
    id: 'XLT9S-3Xef',
    origin: 'Kigali, Rwanda',
    destination: 'San, Fransisco',
    departureDate: '2019-03-02',
    returnDate: '2019-03-03',
    checkStatus: 'Not Checked In',
    checkInDate: null,
    checkOutDate: null,
    accommodationType: 'Not Required',
    lastNotifyDate: null,
    notificationCount: 0,
    travelCompletion: 'false',
    otherTravelReasons: 'adf',
    createdAt: '2019-02-28T19:43:07.937Z',
    updatedAt: '2019-02-28T19:43:07.937Z',
    deletedAt: null,
    travelReasons: null,
    bedId: null,
    requestId: '3mzyo5PeA',
    beds: null
  },
  {
    id: 'XLT9S-3Xet',
    origin: 'Nairobi, Kenya',
    destination: 'Lagos, Nigeria',
    departureDate: '2019-03-02',
    returnDate: '2019-03-03',
    checkStatus: 'Not Checked In',
    checkInDate: null,
    checkOutDate: null,
    accommodationType: 'Not Required',
    lastNotifyDate: null,
    notificationCount: 0,
    travelCompletion: 'false',
    otherTravelReasons: 'adf',
    createdAt: '2019-02-28T19:43:07.937Z',
    updatedAt: '2019-02-28T19:43:07.937Z',
    deletedAt: null,
    travelReasons: null,
    bedId: null,
    requestId: '3mzyo5PeF',
    beds: null
  },
  {
    id: 'AQ1NKnICCk',
    destination: 'Lagos, Nigeria',
    origin: 'Nairobi, Kenya',
    departureDate: '2019-02-28',
    returnDate: '2019-03-01',
    checkStatus: 'Not Checked In',
    checkInDate: null,
    checkOutDate: null,
    accommodationType: 'Not Required',
    lastNotifyDate: null,
    notificationCount: 0,
    travelCompletion: 'false',
    otherTravelReasons: 'adf',
    createdAt: '2019-02-28T19:36:11.092Z',
    updatedAt: '2019-02-28T19:36:11.092Z',
    deletedAt: null,
    travelReasons: null,
    bedId: null,
    requestId: 'L3G8trcWE-',
    beds: null
  },
  {
    id: 'vmCo1lAe24',
    origin: 'Nairobi, Kenya',
    destination: 'Lagos, Nigeria',
    departureDate: '2019-03-05',
    returnDate: '2019-03-06',
    checkStatus: 'Not Checked In',
    checkInDate: null,
    checkOutDate: null,
    accommodationType: 'Hotel Booking',
    lastNotifyDate: null,
    notificationCount: 0,
    travelCompletion: 'false',
    otherTravelReasons: 'adfadsf',
    createdAt: '2019-02-28T19:46:04.398Z',
    updatedAt: '2019-02-28T19:46:04.398Z',
    deletedAt: null,
    travelReasons: null,
    bedId: null,
    requestId: 'mAemAujOX',
    beds: null
  }
];

const mockRequest = [
  {
    id: '3mzyo5PeA',
    name: 'Moses Gitau',
    tripType: 'return',
    manager: 'Moses Gitau',
    gender: 'Male',
    department: 'Fellowship-Programs',
    role: 'Technical Team Lead',
    status: 'Approved',
    userId: '-LTI9_PM3tV39gffhUIE',
    picture: 'fake.png',
    budgetStatus: 'Approved',
    createdAt: '2019-02-28T19:43:07.929Z',
    updatedAt: '2019-02-28T19:43:16.733Z',
    deletedAt: null,
  },
  {
    id: '3mzyo5PeF',
    name: 'Moses Gitau',
    tripType: 'return',
    manager: 'Moses Gitau',
    gender: 'Male',
    department: 'Fellowship-Programs',
    role: 'Technical Team Lead',
    status: 'Approved',
    userId: '-LTI9_PM3tV39gffhUIE',
    picture: 'fake.png',
    budgetStatus: 'Open',
    createdAt: '2019-02-28T19:43:07.929Z',
    updatedAt: '2019-02-28T19:43:16.733Z',
    deletedAt: null,
  },
  {
    id: 'L3G8trcWE-',
    name: 'Moses Gitau',
    tripType: 'return',
    manager: 'Moses Gitau',
    gender: 'Male',
    department: 'Fellowship-Programs',
    role: 'Technical Team Lead',
    status: 'Approved',
    userId: '-LTI9_PM3tV39gffhUIE',
    picture: 'fake.png',
    budgetStatus: 'Rejected',
    createdAt: '2019-02-28T19:36:11.085Z',
    updatedAt: '2019-02-28T19:42:40.518Z',
    deletedAt: null,
  },
  {
    id: 'mAemAujOX',
    name: 'Moses Gitau',
    tripType: 'return',
    manager: 'Moses Gitau',
    gender: 'Male',
    department: 'Fellowship-Programs',
    picture: 'fake.png',
    role: 'Technical Team Lead',
    status: 'Verified',
    userId: '-LTI9_PM3tV39gffhUIE',
    budgetStatus: 'Approved',
    createdAt: '2019-02-28T19:46:04.386Z',
    updatedAt: '2019-02-28T19:46:04.386Z',
    deletedAt: null,
  }
];

const userRoles = [{
  id: 1,
  userId: 1,
  roleId: 53019,
  centerId: 12345,
  createdAt: '2018-09-26T15:47:47.582Z',
  updatedAt: '2018-09-26T15:47:47.582Z'
},
{
  id: 2,
  userId: 1,
  roleId: 60000,
  centerId: 12345,
  createdAt: '2018-09-26T15:47:47.582Z',
  updatedAt: '2018-09-26T15:47:47.582Z'
}];

const userMock = {
  id: 1,
  fullName: 'Moses Gitau',
  email: 'moses.gitau@andela.com',
  userId: '-LTI9_PM3tV39gffhUIE',
  passportName: 'Moses Gitau',
  department: 'Fellowship-Programs',
  occupation: 'Technical Team Lead',
  manager: 'Moses Gitau',
  gender: 'Male',
  picture: 'fake.png',
  location: 'Nairobi',
  createdAt: '2019-02-28T19:31:07.971Z',
  updatedAt: '2019-02-28T19:35:44.022Z',
};

const mockApproval = [
  {
    id: 1,
    requestId: '3mzyo5PeF',
    status: 'Open',
    approverId: 'Moses Gitau',
    createdAt: '2018-09-26T15:47:47.582Z',
    updatedAt: '2018-09-26T15:47:47.582Z',
    deletedAt: null,
    budgetStatus: 'Open'
  },
  {
    id: 2,
    requestId: 'L3G8trcWE-',
    status: 'Approved',
    approverId: 'Moses Gitau',
    createdAt: '2018-09-26T15:47:47.582Z',
    updatedAt: '2018-09-26T15:47:47.582Z',
    deletedAt: null,
    budgetStatus: 'Rejected'
  },
  {
    id: 3,
    requestId: 'mAemAujOX',
    status: 'Verified',
    approverId: 'Moses Gitau',
    createdAt: '2018-09-26T15:47:47.582Z',
    updatedAt: '2018-09-26T15:47:47.582Z',
    deletedAt: null,
    budgetStatus: 'Approved'
  },
  {
    id: 4,
    requestId: '3mzyo5PeA',
    status: 'Approved',
    approverId: 'Moses Gitau',
    createdAt: '2018-09-26T15:47:47.582Z',
    updatedAt: '2018-09-26T15:47:47.582Z',
    deletedAt: null,
    budgetStatus: 'Approved'
  }
];

const centerMock = {
  id: 12345,
  location: 'Nairobi, Kenya',
  createdAt: '2018-09-26T15:47:47.582Z',
  updatedAt: '2018-09-26T15:47:47.582Z'
};

const token = Utils.generateTestToken(payload);

describe('Should allow the budget checker to view requests by budget status', () => {
  beforeAll(async () => {
    moxios.install();

    await models.UserRole.destroy({ force: true, truncate: { cascade: true } });
    await models.Role.destroy({ force: true, truncate: { cascade: true } });
    await models.User.destroy({ force: true, truncate: { cascade: true } });
    await models.Center.destroy({ force: true, truncate: { cascade: true } });
    await models.Trip.destroy({ force: true, truncate: { cascade: true } });
    await models.Approval.destroy({ force: true, truncate: { cascade: true } });
    await models.Request.destroy({ force: true, truncate: { cascade: true } });
    await models.Notification.destroy({ force: true, truncate: { cascade: true } });

    process.env.DEFAULT_ADMIN = 'peter.paul@andela.com';
    await models.Center.create(centerMock);
    await models.Role.bulkCreate(role);
    await models.User.create(userMock);
    await models.UserRole.bulkCreate(userRoles);
    await models.Request.bulkCreate(mockRequest);
    await models.Approval.bulkCreate(mockApproval);
    await models.Trip.bulkCreate(trips);
  });

  afterAll(async () => {
    moxios.uninstall();

    await models.Trip.destroy({ force: true, truncate: { cascade: true } });
    await models.Approval.destroy({ force: true, truncate: { cascade: true } });
    await models.Request.destroy({ force: true, truncate: { cascade: true } });
    await models.Notification.destroy({ force: true, truncate: { cascade: true } });
    await models.UserRole.destroy({ force: true, truncate: { cascade: true } });
    await models.Role.destroy({ force: true, truncate: { cascade: true } });
    await models.User.destroy({ force: true, truncate: { cascade: true } });
    await models.Center.destroy({ force: true, truncate: { cascade: true } });
  });

  const fetchBudgetApprovals = done => (query, callback) => {
    request(app)
      .get(`/api/v1/approvals/budget/?${query}`)
      .set('authorization', token)
      .send()
      .end((err, res) => {
        if (err) return done(err);
        callback(res);
        done();
      });
  };

  it('Should return a list of requests that have already been approved by the manager', (done) => {
    fetchBudgetApprovals(done)('', ({ status, body }) => {
      expect(status).toEqual(200);
      const statuses = body.approvals.map(approval => approval.status);
      expect(statuses).toEqual(['Open', 'Approved', 'Verified']);
    });
  });

  it('Should return a list of approvals that are open', (done) => {
    fetchBudgetApprovals(done)('budgetStatus=open', ({ status, body }) => {
      expect(status).toEqual(200);
      expect(body.approvals.length).toEqual(1);
      expect(body.approvals[0].budgetStatus).toEqual('Open');
    });
  });

  it('Should return a list of approvals that have been approved/rejected', (done) => {
    fetchBudgetApprovals(done)('budgetStatus=past', ({ status, body }) => {
      expect(status).toEqual(200);
      expect(body.approvals.length).toEqual(2);
      expect(body.approvals[0].budgetStatus).toEqual('Rejected');
      expect(body.approvals[1].budgetStatus).toEqual('Approved');
    });
  });

  it('Should return a list of approvals that have been approved by the budget checker', (done) => {
    fetchBudgetApprovals(done)('budgetStatus=approved', ({ status, body }) => {
      expect(status).toEqual(200);
      expect(body.approvals.length).toEqual(1);
      expect(body.approvals[0].budgetStatus).toEqual('Approved');
    });
  });
});
