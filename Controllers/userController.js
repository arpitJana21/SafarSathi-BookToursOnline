const multer = require('multer');
const sharp = require('sharp');
const { User } = require('../Models/userModel');
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');
const factory = require('./handleFactory');

// Image Upload
// const multerStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'public/img/users');
//     },
//     filename: (req, file, cb) => {
//         const ext = file.mimetype.split('/')[1];
//         cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//     },
// });

const multerStorage = multer.memoryStorage();

const multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(
            new AppError('Not an Images please upload only Images.', 400),
            false,
        );
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
});

const uploadUserPhoto = upload.single('photo');
const resizeUserPhoto = catchAsync(async function (req, res, next) {
    if (!req.file) return next();
    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/users/${req.file.filename}`);

    next();
});

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
    if (req.file) {
        filteredBody.photo = req.file.filename;
    }

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

const getMe = function (req, res, next) {
    req.params.id = req.user.id;
    next();
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
    getMe,
    uploadUserPhoto,
    resizeUserPhoto,
};
