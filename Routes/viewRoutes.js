const express = require('express');
const viewController = require('../Controllers/viewsController');
const authController = require('../Controllers/authController');

const viewRouter = express.Router();

viewRouter.use(authController.isLoggedIn);

viewRouter.get('/', viewController.getOverview);
viewRouter.get('/tour/:slug', viewController.getTour);
viewRouter.get('/login', viewController.getLoginForm);

module.exports = { viewRouter };
