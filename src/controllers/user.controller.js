// import HttpStatus from 'http-status-codes';
// import { response } from 'express';
import * as UserService from '../services/user.service';

export const signUp = async (req, res) => {
  const data = await UserService.signUp(req.body);
  res.status(data.code).json({
    code: data.code,
    data: data.data,
    message: data.message
  });
};

export const signIn = async (req, res) => {
  const data = await UserService.signIn(req.body);
  res.status(data.code).json(data);
};

export const forgetPassword = async (req, res) => {
  const { email } = req.body;

  console.log("user-email", email);
  if (!email) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      message: 'Email is required'
    });
  }

  try {
    const data = await UserService.forgetPassword(email);
    res.status(data.code).json(data);
  } catch (error) {
    console.error('Error in forgetPass controller:', error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Internal server error'
    });
  }
}

export const resetPassword = async (req, res) => {
  console.log("-->", res.locals.token);
  const { password } = req.body;
  const userId = req.body.userId;
  const data = await UserService.resetPassword(password, userId);
  res.status(data.code).json(data);
}