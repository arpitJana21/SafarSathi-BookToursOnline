const { Tour } = require('../Models/tourModel');
const { AppError } = require('../utils/appError');
const { catchAsync } = require('../utils/catchAsync');
const { User } = require('../Models/userModel');

const getOverview = catchAsync(async function (req, res) {
    // Get Tour Data from collection
    const tours = await Tour.find();
    // Build template
    // Render that template using tour data from 1
    res.status(200)
        .set(
            'Content-Security-Policy',
            "script-src 'self' https://cdn.jsdelivr.net/npm/axios@1.5.0/dist/axios.min.js 'unsafe-inline' 'unsafe-eval';",
        )
        .render('overview', {
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

    res.status(200)
        .set(
            'Content-Security-Policy',
            "script-src 'self' https://cdn.jsdelivr.net/npm/axios@1.5.0/dist/axios.min.js 'unsafe-inline' 'unsafe-eval';",
        )
        .set(
            'Content-Security-Policy',
            "default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;",
        )
        .render('tour', {
            title: `${tour.name} Tour`,
            tour: tour,
        });
});

const getLoginForm = function (req, res, next) {
    res.status(200)
        .set(
            'Content-Security-Policy',
            "script-src 'self' https://cdn.jsdelivr.net/npm/axios@1.5.0/dist/axios.min.js 'unsafe-inline' 'unsafe-eval';",
        )
        .render('login', {
            title: 'Log into your account',
        });
};

const getAccount = function (req, res, next) {
    res.status(200)
        .set(
            'Content-Security-Policy',
            "script-src 'self' https://cdn.jsdelivr.net/npm/axios@1.5.0/dist/axios.min.js 'unsafe-inline' 'unsafe-eval';",
        )
        .render('account', {
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

    res.status(200)
        .set(
            'Content-Security-Policy',
            "script-src 'self' https://cdn.jsdelivr.net/npm/axios@1.5.0/dist/axios.min.js 'unsafe-inline' 'unsafe-eval';",
        )
        .render('account', {
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
