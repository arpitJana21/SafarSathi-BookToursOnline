const { Review } = require('../Models/reviewModel');
const factory = require('./handleFactory');

// const getAllAllReviews = catchAsync(async function (req, res, next) {
//     let filter = {};
//     if (req.params.tourId) filter = { tour: req.params.tourId };
//     const reviews = await Review.find(filter);

//     res.status(200).json({
//         status: 'success',
//         results: reviews.length,
//         data: {
//             reviews,
//         },
//     });
// });

const setTourUserIds = function (req, res, next) {
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;
    next();
};

const createReview = factory.createOne(Review);
const deleteReview = factory.deleteOne(Review);
const updateReview = factory.updateOne(Review);
const getReview = factory.getOne(Review);
const getAllReviews = factory.getAll(Review);

module.exports = {
    getAllReviews,
    createReview,
    deleteReview,
    updateReview,
    setTourUserIds,
    getReview,
};
