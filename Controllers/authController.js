const { User } = require('../Models/userModel');
const { catchAsync } = require('../utils/catchAsync');

const signup = catchAsync(async function (req, res, next) {
    const newUser = await User.create();
    res.status(201).json({
        status: 'success',
        data: {
            user: newUser,
        },
    });
});

module.exports = { signup };
