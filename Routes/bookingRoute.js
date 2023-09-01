const express = require('express');
const authController = require('../Controllers/authController');
const bookingController = require('../Controllers/bookingController');

const bookingRouter = express.Router();

bookingRouter
    .route('/checkout-session/:tourID')
    .get(
        authController.protect,
        authController.restrictTo('user'),
        bookingController.getCheckoutSession,
    );

module.exports = { bookingRouter };
