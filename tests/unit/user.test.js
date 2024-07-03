import { expect } from 'chai';
import * as UserService from '../../src/services/user.service';
import sequelize, { DataTypes } from '../../src/config/database';

const User = require('../../src/models/user')(sequelize, DataTypes);
const Note = require('../../src/models/notes')(sequelize, DataTypes);

describe('User Service Function Test', () => {
    before(async () => {
        await User.destroy({ where: {} });
        await Note.destroy({ where: {} });
    });
    after(async () => {
        await User.destroy({ where: {} });
        await Note.destroy({ where: {} });
    });

    describe('signUp Function Tests', () => {
        it('signUp() should return user object', async () => {
            const body = {
                firstName: 'sarthik',
                lastName: 'rawal',
                email: 'sarthik@gmail.com',
                password: 'Sarthik@rawal'
            };

            const result = await UserService.signUp(body);
            // console.log("-->", typeof result);
            expect(result).to.be.an('object');
            expect(result.data.email).to.equals(body.email);
        });

        it('signUp() should throw an error if email already exists', async () => {
            const body = {
                firstName: 'sarthik',
                lastName: 'rawal',
                email: 'sarthik@gmail.com',
                password: 'Sarthik@rawal'
            };
            const result = await UserService.signUp(body);
            expect(result.code).to.equal(400);
            expect(result.data).to.be.empty;
            expect(result.message).to.equals('User with this email already exists');
        });
    });

    describe('signIn Function Tests', () => {
        it('signIn() should return user and token if email and password are correct', async () => {
            const body = {
                email: 'sarthik@gmail.com',
                password: 'Sarthik@rawal'
            };
            const result = await UserService.signIn(body);
            expect(result).to.be.an('object');
            console.log("-->", result);
            console.log("-->", body);

            expect(result.data.email).to.equal(body.email);
        });

        it('signIn() should throw an error if email or password are incorrect', async () => {
            try {
                await UserService.signIn({
                    email: 'sarthik@gmail.com',
                    password: 'password'
                });

            } catch (err) {
                expect(err.message).to.equal('Invalid email or password');
            }
        });
    });
});