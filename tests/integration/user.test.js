import { expect } from 'chai';
import request from 'supertest';
import app from '../../src/index';
import sequelize, { DataTypes } from '../../src/config/database';

const User = require('../../src/models/user')(sequelize, DataTypes);
const Note = require('../../src/models/notes')(sequelize, DataTypes);


describe('User APIs Test', () => {
  before(async () => {
    await User.destroy({ where: {} });
    await Note.destroy({ where: {} });
  });
  after(async () => {
    await User.destroy({ where: {} });
    await Note.destroy({ where: {} });
  });
  describe('User Registration', () => {
    it('should register a new user', (done) => {
      const newUser = {
        firstName: 'testname',
        lastName: 'testlastname',
        email: 'testmail@gmail.com',
        password: 'Password@123'
      };

      request(app)
        .post('/api/v1/users/signup')
        .send(newUser)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.statusCode).to.equal(201);
          expect(res.body.data).to.be.an('object');
          expect(res.body.data).to.include.keys(
            'id',
            'firstName',
            'lastName',
            'email'
          );
          done();
        });
    });

    it('should throw an error if email already exists', (done) => {
      const existingUser = {
        firstName: 'testname',
        lastName: 'testlastname',
        email: 'testmail@gmail.com',
        password: 'Password@123'
      };

      request(app)
        .post('/api/v1/users/signup')
        .send(existingUser)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.statusCode).to.equal(400);
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal(
            'User with this email already exists'
          );
          done();
        });
    });
  });

  describe('User Login', () => {
    it('should log in the user', (done) => {
      const userCredentials = {
        email: 'testmail@gmail.com',
        password: 'Password@123'
      };

      request(app)
        .post('/api/v1/users/signin')
        .send(userCredentials)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.statusCode).to.equal(200);
          expect(res.body.data).to.be.an('object');
          expect(res.body.data).to.include.keys('token');
          done();
        });
    });

    it('should throw an error if email or password are incorrect', (done) => {
      const invalidCredentials = {
        email: 'testmail@gmail.com',
        password: 'W1rong@pssword'
      };

      request(app)
        .post('/api/v1/users/signin')
        .send(invalidCredentials)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.statusCode).to.equal(401);
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal('Invalid email or password');
          done();
        });
    });
  });
});