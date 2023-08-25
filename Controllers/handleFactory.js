const { AppError } = require('../utils/appError');
const { catchAsync } = require('../utils/catchAsync');
const { APIFeatures } = require('../utils/apiFeatures');

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

const getOne = function (Model, populateOptions) {
    return catchAsync(async function (req, res, next) {
        const query = Model.findById(req.params.id);
        if (populateOptions) query.populate(populateOptions);
        const doc = await query;

        if (!doc) {
            return next(new AppError('No document found with that ID', 404));
        }
        return res.status(200).json({
            status: 'success',
            data: { data: doc },
        });
    });
};

const getAll = function (Model) {
    return catchAsync(async function (req, res, next) {
        // To allow nested GET reviews on tour (Hack)
        let filter = {};
        if (req.params.tourId) filter = { tour: req.params.tourId };

        // EXECUTE QUERY
        let features = new APIFeatures(Model.find(filter), req.query);
        features = features.filter().sort().limitFields().paginate();
        const docs = await features.query;

        // SEND RESPONSE
        return res.status(200).json({
            status: 'success',
            results: docs.length,
            data: { data: docs },
        });
    });
};

module.exports = { deleteOne, updateOne, createOne, getOne, getAll };
