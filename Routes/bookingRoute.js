const express = require('express');
const authController = require('../Controllers/authController');
const bookingController = require('../Controllers/bookingController');

const bookingRouter = express.Router();

bookingRouter.use(authController.protect);
bookingRouter
    .route('/checkout-session/:tourID')
    .get(
        authController.restrictTo('user'),
        bookingController.getCheckoutSession,
    );

bookingRouter.use(authController.restrictTo('admin', 'lead-guide'));
bookingRouter
    .route('/')
    .get(bookingController.getAllBookings)
    .post(bookingController.createBooking);

bookingRouter
    .route('/:id')
    .get(bookingController.getBooking)
    .patch(bookingController.updateBooking)
    .delete(bookingController.deleteBooking);

module.exports = { bookingRouter };
