const { User } = require('../Models/userModel');
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');
const factory = require('./handleFactory');

const filterObj = function (obj, ...allowedFields) {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};

const updateMe = catchAsync(async function (req, res, next) {
    // Create Error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
        return next(AppError('This route is not for password Updates.', 400));
    }

    // Update User Document
    const filteredBody = filterObj(req.body, 'name', 'email');

    const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        filteredBody,
        {
            new: true,
            runValidators: true,
        },
    );

    return res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser,
        },
    });
});

const deleteMe = async function (req, res, next) {
    await User.findByIdAndUpdate(req.user.id, { active: false });
    return res.status(204).json({
        status: 'success',
        data: null,
    });
};

const getAllUsers = factory.getAll(User);
const deleteUser = factory.deleteOne(User);
const updateUser = factory.updateOne(User);
const getUser = factory.getOne(User);

module.exports = {
    updateMe,
    deleteMe,
    getAllUsers,
    deleteUser,
    updateUser,
    getUser,
};
