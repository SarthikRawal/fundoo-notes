// import HttpStatus from 'http-status-codes';
// import { response } from 'express';
import * as UserService from '../services/user.service';

export const signUp = async (req, res) => {
  const data = await UserService.signUp(req.body);
  res.status(data.code).json({
    code: data.code,
    data: data.data,
    message: data.message
  })
}

export const signIn = async (req, res) => {
  try {
    const data = await UserService.signIn(req.body);
    console.log("controller", data);
    res.status(data.code).json(data);

  } catch (error) {
    console.log(error);
    // throw error;
  }

}

export const signOut = async (req, res) => {

}