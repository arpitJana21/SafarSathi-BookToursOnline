const { AppError } = require('../utils/appError');
const { catchAsync } = require('../utils/catchAsync');

const deleteOne = function (Model) {
    return catchAsync(async function (req, res, next) {
        const doc = await Model.findByIdAndDelete(req.params.id);
        if (!doc) {
            return next(new AppError('No document found with that ID', 404));
        }
        return res.status(204).json({
            status: 'success',
            data: null,
        });
    });
};

const updateOne = function (Model) {
    return catchAsync(async function (req, res, next) {
        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!doc) {
            return next(new AppError('No document found with that ID', 404));
        }
        return res.status(200).json({
            status: 'success',
            data: { data: doc },
        });
    });
};

const createOne = function (Model) {
    return catchAsync(async function (req, res, next) {
        const newDoc = await Model.create(req.body);

        return res.status(201).json({
            status: 'success',
            data: { data: newDoc },
        });
    });
};

module.exports = { deleteOne, updateOne, createOne };
