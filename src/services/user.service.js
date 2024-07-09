import sequelize, { DataTypes } from '../config/database';
const User = require('../models/user')(sequelize, DataTypes);
import HttpStatus from 'http-status-codes';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { UniqueConstraintError } from 'sequelize';
import { sendResetPasswordEmail } from '../utils/sendEmail';
import { consume, publish } from '../config/rabbitmq';

dotenv.config();

// creating secrete key for JWT
const secretKey = process.env.JWT_SECRET;

export const signUp = async (userDetails) => {
  try {
    if (userDetails != null) {
      const hashedPassword = await bcrypt.hash(userDetails.password, 10);
      userDetails.password = hashedPassword;

      const data = await User.create(userDetails);

      const message = JSON.stringify(data);
      await publish('User', message);
      await consume('User', message)
      return {
        code: HttpStatus.CREATED,
        data: data,
        message: 'Created user successfully'
      };
    } else {
      return {
        code: HttpStatus.UNAUTHORIZED,
        data: [],
        message: 'invalid details entered'
      };
    }
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      return {
        code: HttpStatus.BAD_REQUEST,
        data: [],
        message: 'User with this email already exists'
      };
    } else {
      return {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        data: [],
        message: 'Something went wrong'
      };
    }
  }
};

export const signIn = async (userDetails) => {
  // console.log("--> user details", userDetails);
  try {
    if (!userDetails.email || !userDetails.password) {
      return {
        code: HttpStatus.BAD_REQUEST,
        data: [],
        message: 'Email and password are required'
      };
    }

    const user = await User.findOne({ where: { email: userDetails.email } });

    if (!user) {
      return {
        code: HttpStatus.UNAUTHORIZED,
        data: [],
        message: 'Invalid email or password'
      };
    }

    const validPassword = await bcrypt.compare(
      userDetails.password,
      user.password
    );

    if (!validPassword) {
      return {
        code: HttpStatus.UNAUTHORIZED,
        data: [],
        message: 'Invalid email or password'
      };
    }

    // generate JWT token
    const token = jwt.sign({ userId: user.id, email: user.email }, secretKey);

    return {
      code: HttpStatus.OK,
      data: { token },
      user: user,
      message: 'Login successful'
    };
  } catch (error) {
    return {
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      data: [],
      message: error.message
    };
  }
};

export const forgetPassword = async (email) => {
  const user = await User.findOne({ where: { email } });
  console.log("-user", user);
  try {
    if (!user) {
      return {
        code: HttpStatus.BAD_REQUEST,
        message: 'No user found..!'
      }
    }
    const token = jwt.sign({ userId: user.id, email: user.email }, secretKey, { expiresIn: '10m' });

    const link = `UserId - ${user.id} & token - ${token}`;
    console.log("--> link", link);

    await sendResetPasswordEmail(user.email, token);
    return {
      code: HttpStatus.OK,
      data: user,
      message: 'Link sent on the mail'
    }
  } catch (error) {
    return {
      code: HttpStatus.BAD_REQUEST,
      data: [],
      message: error.message
    }
  }
}

export const resetPassword = async (newPassword, userId) => {
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    newPassword = hashedPassword;
    const user = await User.update({ password: newPassword }, { where: { id: userId } });

    return {
      code: HttpStatus.OK,
      data: user,
      message: 'Password updated 🫡'
    }
  } catch (error) {
    return {
      code: HttpStatus.BAD_GATEWAY,
      data: [],
      message: error.message
    }
  }
}
