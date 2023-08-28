const express = require('express');
const viewController = require('../Controllers/viewsController');

const viewRouter = express.Router();

viewRouter.get('/', viewController.getOverview);
viewRouter.get('/tour/:slug', viewController.getTour);

module.exports = { viewRouter };
