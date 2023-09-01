const { Tour } = require('../Models/tourModel');
const { AppError } = require('../utils/appError');
const { catchAsync } = require('../utils/catchAsync');
const { User } = require('../Models/userModel');
const { Booking } = require('../Models/bookingModel');

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

const getMyTours = async function (req, res, next) {
    console.log(req.user);
    // Find All Bookings
    const bookings = await Booking.find({ user: req.user._id });

    // Find
    const tourIDs = bookings.map(function (el) {
        return el.tour;
    });

    const tours = await Tour.find({ _id: { $in: tourIDs } });

    res.status(200).render('overview', {
        title: 'My Tours',
        tours: tours,
        user: req.user,
    });
};

module.exports = {
    getOverview,
    getTour,
    getLoginForm,
    getAccount,
    updateUserData,
    getMyTours,
};
