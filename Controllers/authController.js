const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const { User } = require('../Models/userModel');
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');
const { Email } = require('../utils/email');

const signToken = function (id) {
    const secKey = process.env.JWT_SECRET;
    const expTime = process.env.JWT_EXPIRES_IN;
    return jwt.sign({ id: id }, secKey, { expiresIn: expTime });
};

const createSendToken = function (user, startsCode, res) {
    const token = signToken(user._id);
    // Send Token as Cookie
    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000,
        ),
        secure: true,
        httpOnly: true,
    };
    res.cookie('jwt', token, cookieOptions);
    user.password = undefined;
    return res.status(startsCode).json({
        status: 'success',
        data: {
            token: token,
            user: user,
        },
    });
};

const signup = catchAsync(async function (req, res, next) {
    // const newUser = await User.create(req.body);
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
    });
    const url = `http://www.example.com/`;
    await new Email(newUser, url).sendWelcome();
    createSendToken(newUser, 201, res);
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
    createSendToken(user, 200, res);
};

const protect = catchAsync(async function (req, res, next) {
    // Getting token and check of it's there
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
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
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        const error = new AppError(
            'The User belonging to the token is no longer Exist.',
        );
        return next(error);
    }

    // Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        const error = new AppError(
            'User recently changed password! Please log in again.',
            401,
        );
        next(error);
    }

    // Give User Obj Access to Protected Route
    req.user = currentUser;
    next();
});

// Only for Rendered Pages
const isLoggedIn = async function (req, res, next) {
    try {
        const secKey = process.env.JWT_SECRET;
        const token = req.cookies.jwt;
        if (!token) return next();

        // Verify token
        const decoded = await promisify(jwt.verify)(token, secKey);

        // Check if user still exist
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return next();
        }

        // Check if user changed password after the token was issued
        if (currentUser.changedPasswordAfter(decoded.iat)) {
            return next();
        }

        // There is a logged in User
        res.locals.user = currentUser;
        return next();
    } catch (error) {
        return next();
    }
};

const logout = function (req, res) {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });
    res.status(200).json({
        status: 'success',
    });
};

const restrictTo = function (...roles) {
    return function (req, res, next) {
        if (!roles.includes(req.user.role)) {
            const error = new AppError(
                'You do not have permission to perform this action',
                403,
            );
            next(error);
        }
        next();
    };
};

const forgotPassword = catchAsync(async function (req, res, next) {
    // Get User based on Email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        const error = new AppError('There is no user with email address.', 404);
        return next(error);
    }
    // Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // Send it to user's email

    try {
        const resetURL = `${req.protocol}://${req.get(
            'host',
        )}/api/v1/users/resetPassword/${resetToken}`;

        await new Email(user, resetURL, resetToken).sendPasswordReset();

        res.status(200).json({
            status: 'success',
            message: 'Token sent to email!',
        });
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
        const error = new AppError(
            'There was an error sending the email. Try again later',
        );
        next(error);
    }
});

const resetPassword = catchAsync(async function (req, res, next) {
    // Get User based on the token
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });

    // If Token is not expired, and there is user, set the new Password
    if (!user) {
        return next(new AppError('Token is invalid of has expired'));
    }

    // Update Changed Password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // Log the user In, send JWT
    createSendToken(user, 200, res);
});

const updatePassword = catchAsync(async function (req, res, next) {
    // Get user form collection
    const user = await User.findById(req.user.id).select('+password');

    // Check if POSTEed current password is correct
    if (
        !(await user.correctPassword(req.body.passwordCurrent, user.password))
    ) {
        return next(new AppError('Your current password is wrong.', 401));
    }

    // If so, update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    // Log the user In, send JWT
    createSendToken(user, 200, res);
});

module.exports = {
    signup,
    login,
    protect,
    restrictTo,
    forgotPassword,
    resetPassword,
    updatePassword,
    isLoggedIn,
    logout,
};
