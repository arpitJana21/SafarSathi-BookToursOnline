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
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
    });

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

module.exports = { signup, login };
