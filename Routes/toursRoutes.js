const express = require('express');
const tourController = require('../Controllers/tourController');
const authController = require('../Controllers/authController');
const { reviewRouter } = require('./reviewRoute');

const tourRouter = express.Router();

tourRouter
    .route('/top-5-cheap')
    .get(tourController.aliasTopTours, tourController.getAllTours);

tourRouter.route('/stats').get(tourController.getTourStats);
tourRouter
    .route('/monthly-plan/:year')
    .get(
        authController.protect,
        authController.restrictTo('admin', 'lead-guide', 'guide'),
        tourController.getMonthlyPlan,
    );

tourRouter
    .route('/')
    .get(tourController.getAllTours)
    .post(
        authController.protect,
        authController.restrictTo('admin', 'lead-guide'),
        tourController.createTour,
    );

tourRouter
    .route('/:id')
    .get(tourController.getTour)
    .patch(
        authController.protect,
        authController.restrictTo('admin', 'lead-guide'),
        tourController.updateTour,
    )
    .delete(
        authController.protect,
        authController.restrictTo('admin', 'lead-guide'),
        tourController.deleteTour,
    );

tourRouter.use('/:tourId/reviews', reviewRouter);

module.exports = { tourRouter };
