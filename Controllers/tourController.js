const { Tour } = require('../Models/tourModel');
const { catchAsync } = require('../utils/catchAsync');
const factory = require('./handleFactory');
const { AppError } = require('../utils/appError');

const aliasTopTours = async function (req, res, next) {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summery,difficulty';
    next();
};

const getTourStats = catchAsync(async function (req, res, next) {
    const stats = await Tour.aggregate([
        {
            $match: { ratingsAverage: { $gte: -1.0 } },
        },
        {
            $group: {
                // _id: null,
                // _id: '$difficulty',
                _id: { $toUpper: '$difficulty' },
                numTours: { $sum: 1 },
                numRatings: { $sum: '$ratingsQuantity' },
                avgRating: { $avg: '$ratingsAverage' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
            },
        },
        {
            $sort: { avgPrice: 1 },
        },
    ]);

    return res.status(200).json({
        status: 'success',
        data: { stats },
    });
});

const getMonthlyPlan = catchAsync(async function (req, res, next) {
    const year = req.params.year * 1;

    const plan = await Tour.aggregate([
        {
            $unwind: '$startDates',
        },
        {
            $set: {
                startDates: {
                    $dateFromString: { dateString: '$startDates' },
                },
            },
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`),
                },
            },
        },
        {
            $group: {
                _id: { $month: '$startDates' },
                numTourStart: { $sum: 1 },
                tours: { $push: '$name' },
            },
        },

        {
            $addFields: {
                month: '$_id',
            },
        },

        {
            $project: {
                _id: 0,
            },
        },

        {
            $sort: {
                numTourStart: -1,
            },
        },
    ]);

    return res.status(200).json({
        status: 'success',
        data: { plan },
    });
});

/*
const getAllTours = catchAsync(async function (req, res, next) {
    // EXECUTE QUERY
    let features = new APIFeatures(Tour.find(), req.query);
    console.log(req.query);
    features = features.filter().sort().limitFields().paginate();
    const tours = await features.query;

    // SEND RESPONSE
    return res.status(200).json({
        status: 'success',
        results: tours.length,
        data: { tours },
    });
});

const getTour = catchAsync(async function (req, res, next) {
    const tour = await Tour.findById(req.params.id).populate({
        path: 'reviews',
    });
    if (!tour) {
        return next(new AppError('No tour found with that ID', 404));
    }
    return res.status(200).json({
        status: 'success',
        data: { tour },
    });
});

const createTour = catchAsync(async function (req, res, next) {
    // const newTour = new Tour({});
    // newTour.save();
    const tour = await Tour.create(req.body);

    return res.status(201).json({
        status: 'success',
        data: { tour },
    });
});

const updateTour = catchAsync(async function (req, res, next) {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!tour) {
        return next(new AppError('No tour found with that ID', 404));
    }
    return res.status(200).json({
        status: 'success',
        data: { tour },
    });
});

const deleteTour = catchAsync(async function (req, res, next) {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    if (!tour) {
        return next(new AppError('No tour found with that ID', 404));
    }
    return res.status(204).json({
        status: 'success',
        data: null,
    });
});
*/

const getToursWithin = catchAsync(async function (req, res, next) {
    const { distance, latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');
    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
    if (!lat || !lng) {
        next(
            new AppError(
                'Please provide latitute in the fromat lat, lng.',
                400,
            ),
        );
    }

    const tours = await Tour.find({
        startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
    });

    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            data: tours,
        },
    });
});

const getAllTours = factory.getAll(Tour);
const createTour = factory.createOne(Tour);
const updateTour = factory.updateOne(Tour);
const deleteTour = factory.deleteOne(Tour);
const getTour = factory.getOne(Tour, { path: 'reviews' });

module.exports = {
    getAllTours,
    createTour,
    getTour,
    updateTour,
    deleteTour,
    aliasTopTours,
    getTourStats,
    getMonthlyPlan,
    getToursWithin,
};
