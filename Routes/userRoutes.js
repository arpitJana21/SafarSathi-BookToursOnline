const express = require('express');
const authController = require('../Controllers/authController');
const userController = require('../Controllers/userController');

const userRouter = express.Router();

userRouter.post('/signup', authController.signup);
userRouter.post('/login', authController.login);

userRouter.post('/forgotPassword', authController.forgotPassword);
userRouter.patch('/resetPassword/:token', authController.resetPassword);
userRouter.patch(
    '/updateMyPassword',
    authController.protect,
    authController.updatePassword,
);

userRouter.patch('/updateMe', authController.protect, userController.updateMe);
userRouter.delete('/deleteMe', authController.protect, userController.deleteMe);

module.exports = { userRouter };
