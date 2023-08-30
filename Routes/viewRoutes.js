const express = require('express');
const viewController = require('../Controllers/viewsController');
const authController = require('../Controllers/authController');

const viewRouter = express.Router();

viewRouter.get('/', authController.isLoggedIn, viewController.getOverview);
viewRouter.get(
    '/tour/:slug',
    authController.isLoggedIn,
    viewController.getTour,
);
viewRouter.get(
    '/login',
    authController.isLoggedIn,
    viewController.getLoginForm,
);
viewRouter.get('/me', authController.protect, viewController.getAccount);
viewRouter.post(
    '/submit-user-data',
    authController.protect,
    viewController.updateUserData,
);

module.exports = { viewRouter };
