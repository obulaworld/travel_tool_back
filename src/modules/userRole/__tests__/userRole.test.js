import request from 'supertest';
import app from '../../../app';
import models from '../../../database/models';
import {
  role,
  user,
  userRole,
  newRole,
  profile,
} from './mocks/mockData';
import Utils from '../../../helpers/Utils';

const payload = {
  UserInfo: {
    id: '-MUyHJmKrxA90lPNQ1FOLNm',
    fullName: 'captain america',
    email: 'captain.america@andela.com',
  },
};

const payload2 = {
  UserInfo: {
    id: '-MUyHJmKrxA90lPNQ1FOLNm',
    fullName: 'captain america',
    email: 'captain.@andela.com',
  },
};

const payload3 = {
  UserInfo: {
    id: '-MUyHJmKrxA90lPNQ1FOLNm',
    fullName: 'black window ',
    email: 'black.window@andela.com',
  },
};

const token = Utils.generateTestToken(payload);
const token2 = Utils.generateTestToken(payload2);
const token3 = Utils.generateTestToken(payload3);

describe('User Role Test', () => {
  beforeAll((done) => {
    models.Role.destroy({ force: true, truncate: { cascade: true } });
    models.Role.bulkCreate(role);
    process.env.DEFAULT_ADMIN = 'captain.america@andela.com';
    done();
  });

  afterAll((done) => {
    models.Role.destroy({ force: true, truncate: { cascade: true } });
    done();
  });

  it('should return 401 Unauthorized users', (done) => {
    request(app)
      .get('/api/v1/user')
      .expect(401)
      .end((err) => {
        if (err) {
          done(err);
        }
        done();
      });
  });

  it('should return error if field is empty when adding a new user', (done) => {
    request(app)
      .post('/api/v1/user')
      .set('Content-Type', 'application/json')
      .set('authorization', token)
      .expect(422)
      .end((err, res) => {
        expect(res.body.success).toEqual(false);
        if (err) return done(err);
        done();
      });
  });

  it('should return error if email is not an andela email address', (done) => {
    request(app)
      .post('/api/v1/user')
      .set('Content-Type', 'application/json')
      .set('authorization', token)
      .send(user.user3)
      .expect(400)
      .end((err, res) => {
        expect(res.body.success).toEqual(false);
        if (err) return done(err);
        done();
      });
  });

  it('should return error if user Id is empty', (done) => {
    request(app)
      .post('/api/v1/user')
      .set('Content-Type', 'application/json')
      .set('authorization', token)
      .send(user.user4)
      .expect(400)
      .end((err, res) => {
        expect(res.body.success).toEqual(false);
        expect(res.body.message).toEqual('User Id required');
        if (err) return done(err);
        done();
      });
  });

  it('should add a new user to the database', (done) => {
    request(app)
      .post('/api/v1/user')
      .set('Content-Type', 'application/json')
      .set('authorization', token)
      .send(user.user1)
      .expect(201)
      .end((err, res) => {
        expect(res.body.result[0]).toHaveProperty('fullName');
        expect(res.body.result[0]).toHaveProperty('email');
        expect(res.body.result[0].email).toEqual(user.user1.email);
        expect(res.body.result[0].fullName).toEqual(user.user1.fullName);
        expect(res.body.success).toEqual(true);
        if (err) return done(err);
        done();
      });
  });

  it('should add another new user to the database', (done) => {
    request(app)
      .post('/api/v1/user')
      .set('Content-Type', 'application/json')
      .set('authorization', token)
      .send(user.user2)
      .expect(201)
      .end((err, res) => {
        expect(res.body.result[0]).toHaveProperty('fullName');
        expect(res.body.result[0]).toHaveProperty('email');
        expect(res.body.result[0].email).toEqual(user.user2.email);
        expect(res.body.result[0].fullName).toEqual(user.user2.fullName);
        expect(res.body.success).toEqual(true);
        if (err) return done(err);
        done();
      });
  });

  it('should get all users in the database', (done) => {
    request(app)
      .get('/api/v1/user')
      .set('Content-Type', 'application/json')
      .set('authorization', token)
      .expect(200)
      .end((err, res) => {
        expect(res.body.success).toEqual(true);
        if (err) return done(err);
        done();
      });
  });

  it('should return only one user from the database', (done) => {
    request(app)
      .get('/api/v1/user/JNDVNFSFDK')
      .set('Content-Type', 'application/json')
      .set('authorization', token)
      .expect(200)
      .end((err, res) => {
        expect(res.body.success).toEqual(true);
        if (err) return done(err);
        done();
      });
  });

  it('should return error if login user does not exist in database when changing user role', (done) => {
    request(app)
      .put('/api/v1/user/role/update')
      .set('Content-Type', 'application/json')
      .set('authorization', token2)
      .send(userRole.superAdminRole)
      .expect(400)
      .end((err, res) => {
        expect(res.body.success).toEqual(false);
        expect(res.body.message).toEqual(
          'Logged in user Email does not exist in Database',
        );
        if (err) return done(err);
        done();
      });
  });

  it('should return error when changing user role and user is not a super admin', (done) => {
    request(app)
      .put('/api/v1/user/role/update')
      .set('Content-Type', 'application/json')
      .set('authorization', token)
      .send(userRole.superAdminRole)
      .expect(400)
      .end((err, res) => {
        expect(res.body.success).toEqual(false);
        expect(res.body.message).toEqual('Only a Super admin can do that');
        if (err) return done(err);
        done();
      });
  });

  it('should throw error if user does not exist in the database when user is set to super admin', (done) => {
    request(app)
      .put('/api/v1/user/admin')
      .set('Content-Type', 'application/json')
      .set('authorization', token2)
      .expect(400)
      .end((err, res) => {
        expect(res.body.success).toEqual(false);
        expect(res.body.message).toEqual('Email does not exist in Database');
        if (err) return done(err);
        done();
      });
  });

  it('should change user to super admin', (done) => {
    request(app)
      .put('/api/v1/user/admin')
      .set('Content-Type', 'application/json')
      .set('authorization', token)
      .expect(200)
      .end((err, res) => {
        expect(res.body.success).toEqual(true);
        expect(res.body.message).toEqual('Your role has been Updated to a Super Admin');
        if (err) return done(err);
        done();
      });
  });

  it('should throw if email does not match process env when changing user to super admin', (done) => {
    request(app)
      .put('/api/v1/user/admin')
      .set('Content-Type', 'application/json')
      .set('authorization', token3)
      .send(userRole.superAdminRole)
      .expect(409)
      .end((err, res) => {
        expect(res.body.success).toEqual(false);
        expect(res.body.message).toEqual('Email does not match');
        if (err) return done(err);
        done();
      });
  });

  it('should updated user role to admin', (done) => {
    request(app)
      .put('/api/v1/user/role/update')
      .set('Content-Type', 'application/json')
      .set('authorization', token)
      .send(userRole.superAdminRole)
      .expect(200)
      .end((err, res) => {
        expect(res.body.success).toEqual(true);
        expect(res.body.message).toEqual('Role updated successfully');
        if (err) return done(err);
        done();
      });
  });

  it('should add user profile to the database', (done) => {
    request(app)
      .put('/api/v1/user/JNDVNFSFDK/profile')
      .set('Content-Type', 'application/json')
      .set('authorization', token)
      .send(profile.profile1)
      .expect(201)
      .end((err, res) => {
        expect(res.body.success).toEqual(true);
        if (err) return done(err);
        done();
      });
  });


  it('should throw an error if the gender is wrong', (done) => {
    request(app)
      .put('/api/v1/user/JNDVNFSFDK/profile')
      .set('Content-Type', 'application/json')
      .set('authorization', token)
      .send(profile.profile2)
      .expect(400)
      .end((err, res) => {
        expect(res.body.success).toEqual(false);
        if (err) return done(err);
        done();
      });
  });

  it('should throw error when field is empty when super admin is adding new role', (done) => {
    request(app)
      .post('/api/v1/user/role')
      .set('Content-Type', 'application/json')
      .set('authorization', token)
      .send(userRole.newRole)
      .expect(422)
      .end((err, res) => {
        expect(res.body.success).toEqual(false);
        expect(res.body.message).toEqual('Validation failed');
        if (err) return done(err);
        done();
      });
  });

  it('should return error if email does not exist when updating user role', (done) => {
    request(app)
      .put('/api/v1/user/role/update')
      .set('Content-Type', 'application/json')
      .set('authorization', token)
      .send(userRole.superAdminRole2)
      .expect(400)
      .end((err, res) => {
        expect(res.body.success).toEqual(false);
        expect(res.body.message).toEqual('Email does not exist');
        if (err) return done(err);
        done();
      });
  });

  it('should throw an error if the user does not exist', (done) => {
    request(app)
      .put('/api/v1/user/JN/profile')
      .set('Content-Type', 'application/json')
      .set('authorization', token)
      .send(profile.profile1)
      .expect(400)
      .end((err, res) => {
        expect(res.body.success).toEqual(false);
        if (err) return done(err);
        done();
      });
  });

  it('should throw error when role Name is not provided when adding new role for user ', (done) => {
    request(app)
      .put('/api/v1/user/role/update')
      .set('Content-Type', 'application/json')
      .set('authorization', token)
      .send(newRole.saveSuperAdminRole)
      .expect(422)
      .end((err, res) => {
        expect(res.body.success).toEqual(false);
        expect(res.body.message).toEqual('Validation failed');
        if (err) return done(err);
        done();
      });
  });

  it('should throw error when role does not exist when updating user role ', (done) => {
    request(app)
      .put('/api/v1/user/role/update')
      .set('Content-Type', 'application/json')
      .set('authorization', token)
      .send(userRole.managerRole)
      .expect(400)
      .end((err, res) => {
        expect(res.body.success).toEqual(false);
        expect(res.body.message).toEqual('Role does not exist');
        if (err) return done(err);
        done();
      });
  });

  it('should throw error if role already exist when adding  new role when user is super admin ', (done) => {
    request(app)
      .post('/api/v1/user/role')
      .set('Content-Type', 'application/json')
      .set('authorization', token)
      .send(newRole.traveTeamRole)
      .expect(409)
      .end((err, res) => {
        expect(res.body.success).toEqual(false);
        expect(res.body.message).toEqual('Role already exist');
        if (err) return done(err);
        done();
      });
  });

  describe('Role Test', () => {
    it('should add new role when user is super admin ', (done) => {
      request(app)
        .post('/api/v1/user/role')
        .set('Content-Type', 'application/json')
        .set('authorization', token)
        .send(newRole.saveSuperAdminRole)
        .expect(201)
        .end((err, res) => {
          expect(res.body.success).toEqual(true);
          expect(res.body.message).toEqual('Role created successfully');
          if (err) return done(err);
          done();
        });
    });


    it('should get all roles in the database', (done) => {
      request(app)
        .get('/api/v1/user/roles')
        .set('Content-Type', 'application/json')
        .set('authorization', token)
        .expect(200)
        .end((err, res) => {
          expect(res.body.success).toEqual(true);
          if (err) return done(err);
          done();
        });
    });

    it('should return error if params is not a integer', (done) => {
      request(app)
        .get('/api/v1/user/roles/irfir')
        .set('Content-Type', 'application/json')
        .set('authorization', token)
        .expect(400)
        .end((err, res) => {
          expect(res.body.success).toEqual(false);
          expect(res.body.message).toEqual('Params must be an integer');
          if (err) return done(err);
          done();
        });
    });

    it('should return only one role from the database', (done) => {
      request(app)
        .get('/api/v1/user/roles/1')
        .set('Content-Type', 'application/json')
        .set('authorization', token)
        .expect(200)
        .end((err, res) => {
          expect(res.body.success).toEqual(true);
          if (err) return done(err);
          done();
        });
    });
  });
});
