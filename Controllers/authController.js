const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const { User } = require('../Models/userModel');
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');

const signToken = function (id) {
    const secKey = process.env.JWT_SECRET;
    const expTime = process.env.JWT_EXPIRES_IN;
    return jwt.sign({ id: id }, secKey, { expiresIn: expTime });
};

const signup = catchAsync(async function (req, res, next) {
    // const newUser = await User.create({
    //     name: req.body.name,
    //     email: req.body.email,
    //     password: req.body.password,
    //     passwordConfirm: req.body.passwordConfirm,
    // });
    const newUser = await User.create(req.body);

    const token = signToken(newUser._id);

    res.status(201).json({
        status: 'success',
        data: {
            token: token,
            user: newUser,
        },
    });
});

const login = async function (req, res, next) {
    const { email, password } = req.body;

    // Check Email and Password Exist
    if (!email || !password) {
        const error = new AppError('Please Provide Email and Password !', 400);
        return next(error);
    }

    // Chect User Exist & Password is CORRECT
    const user = await User.findOne({ email: email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
        const error = new AppError('Incorrect Email or Password', 401);
        return next(error);
    }

    const token = signToken(user._id);

    res.status(200).json({
        status: 'success',
        token: token,
    });
};

const protect = catchAsync(async function (req, res, next) {
    // Getting token and check of it's there
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        const error = new AppError(
            'You are not logged in! Please log in to get access.',
        );
        return next(error, 401);
    }

    // Verification token
    const secKey = process.env.JWT_SECRET;

    // const decoded = jwt.verify(token, secKey);
    const decoded = await promisify(jwt.verify)(token, secKey);

    // Check if user still exist
    const freshUser = await User.findById(decoded.id);
    if (!freshUser) {
        const error = new AppError(
            'The User belonging to the token is no longer Exist.',
        );
        return next(error);
    }

    // Check if user changed password after the token was issued
    if (freshUser.changedPasswordAfter(decoded.iat)) {
        const error = new AppError(
            'User recently changed password! Please log in again.',
            401,
        );
        next(error);
    }

    // Access to Protected Route
    next();
});

module.exports = { signup, login, protect };
