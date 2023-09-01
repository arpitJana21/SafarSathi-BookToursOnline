const { Tour } = require('../Models/tourModel');
const { AppError } = require('../utils/appError');
const { catchAsync } = require('../utils/catchAsync');
const { User } = require('../Models/userModel');

const getOverview = catchAsync(async function (req, res) {
    const tours = await Tour.find();
    res.status(200).render('overview', {
        title: 'All Tours',
        tours: tours,
    });
});

const getTour = catchAsync(async function (req, res, next) {
    // Get the data, for the requested tour ( including reviews and guides )
    const tour = await Tour.findOne({ slug: req.params.slug }).populate({
        path: 'reviews',
        fields: 'review rating user',
    });

    if (!tour) {
        return next(new AppError('There is not Tour with this name', 404));
    }
    res.status(200).render('tour', {
        title: `${tour.name} Tour`,
        tour: tour,
    });
});

const getLoginForm = function (req, res, next) {
    res.status(200).render('login', {
        title: 'Log into your account',
    });
};

const getAccount = function (req, res, next) {
    res.status(200).render('account', {
        title: 'Your Account',
        user: req.user,
    });
};

const updateUserData = catchAsync(async function (req, res, next) {
    const user = await User.findByIdAndUpdate(
        req.user.id,
        {
            name: req.body.name,
            email: req.body.email,
        },
        {
            new: true,
            runValidators: true,
        },
    );

    res.status(200).render('account', {
        title: 'Your Account',
        user: user,
    });
});

module.exports = {
    getOverview,
    getTour,
    getLoginForm,
    getAccount,
    updateUserData,
};
