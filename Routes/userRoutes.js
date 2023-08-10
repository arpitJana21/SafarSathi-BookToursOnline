const express = require('express');
const authController = require('../Controllers/authController');

const userRouter = express.Router();

userRouter.post('/signup', authController.signup);
userRouter.post('/login', authController.login);

module.exports = { userRouter };
