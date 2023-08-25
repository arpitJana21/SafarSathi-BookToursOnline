const { Review } = require('../Models/reviewModel');
const { catchAsync } = require('../utils/catchAsync');

const getAllAllReviews = catchAsync(async function (req, res, next) {
    const reviews = await Review.find();

    res.status(200).json({
        status: 'success',
        results: reviews.length,
        data: {
            reviews,
        },
    });
});

const createReview = catchAsync(async function (req, res, next) {
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;
    const newReview = await Review.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            review: newReview,
        },
    });
});

module.exports = { getAllAllReviews, createReview };
