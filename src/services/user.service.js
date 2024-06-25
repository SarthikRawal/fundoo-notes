import sequelize, { DataTypes } from '../config/database';
const User = require('../models/user')(sequelize, DataTypes);
import HttpStatus from 'http-status-codes';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// creating secrete key for JWT
const secretKey = process.env.JWT_SECRET;

export const signUp = async (userDetails) => {
  try {
    if (userDetails != null) {
      const hashedPassword = await bcrypt.hash(userDetails.password, 10);
      userDetails.password = hashedPassword;


      const data = await User.create(userDetails);

      return {
        code: HttpStatus.CREATED,
        data: data,
        message: "Created user successfully"
      };
    } else {
      return {
        code: HttpStatus.BAD_REQUEST,
        data: [],
        message: "details unavailable"
      };
    }

  } catch (error) {
    console.log(error);
    return {
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      data: [],
      message: "Something went wrong"
    };
  }
}

export const signIn = async (userDetails) => {
  // console.log("--> user details", userDetails);
  try {
    if (!userDetails.email || !userDetails.password) {
      return {
        code: HttpStatus.BAD_REQUEST,
        data: [],
        message: "Email and password are required"
      };
    }

    const user = await User.findOne({ where: { email: userDetails.email } });

    if (!user) {
      return {
        code: HttpStatus.UNAUTHORIZED,
        data: [],
        message: "Invalid email or password"
      };
    }

    const validPassword = await bcrypt.compare(userDetails.password, user.password);

    if (!validPassword) {
      return {
        code: HttpStatus.UNAUTHORIZED,
        data: [],
        message: "Invalid email or password"
      };
    }

    // generate JWT token
    const token = jwt.sign({ userId: user.id, email: user.email }, secretKey, { expiresIn: '1h' });

    return {
      code: HttpStatus.OK,
      data: { token },
      message: "Login successful"
    };
  } catch (error) {
    return {
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      data: [],
      message: "Something went wrong"
    };
  }

}