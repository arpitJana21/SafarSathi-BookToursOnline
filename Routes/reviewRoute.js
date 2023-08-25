const express = require('express');
const reviewController = require('../Controllers/reviewController');
const authController = require('../Controllers/authController');

const reviewRouter = express.Router({ mergeParams: true });

reviewRouter.use(authController.protect);

reviewRouter
    .route('/')
    .get(reviewController.getAllReviews)
    .post(
        authController.protect,
        authController.restrictTo('user'),
        reviewController.setTourUserIds,
        reviewController.createReview,
    );

reviewRouter
    .route('/:id')
    .get(reviewController.getReview)
    .delete(
        authController.restrictTo('user', 'admin'),
        reviewController.deleteReview,
    )
    .patch(
        authController.restrictTo('user', 'admin'),
        reviewController.updateReview,
    );

module.exports = { reviewRouter };
