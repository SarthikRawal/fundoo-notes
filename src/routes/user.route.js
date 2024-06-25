import express from 'express';
import * as userController from '../controllers/user.controller';
import { newUserValidator } from '../validators/user.validator';
// import { userAuth } from '../middlewares/auth.middleware';

const router = express.Router();

// User sign up
router.post('/signup', newUserValidator, userController.signUp);

// User sign in
router.post('/signin', userController.signIn);

export default router;