const express = require('express');
const reviewController = require('../Controllers/reviewController');
const authController = require('../Controllers/authController');

const reviewRouter = express.Router({ mergeParams: true });

reviewRouter
    .route('/')
    .get(reviewController.getAllAllReviews)
    .post(
        authController.protect,
        authController.restrictTo('user'),
        reviewController.createReview,
    );

module.exports = { reviewRouter };
