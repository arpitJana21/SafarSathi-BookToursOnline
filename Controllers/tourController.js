const multer = require('multer');
const sharp = require('sharp');
const { Tour } = require('../Models/tourModel');
const { catchAsync } = require('../utils/catchAsync');
const factory = require('./handleFactory');
const { AppError } = require('../utils/appError');

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

const uploadTourImages = upload.fields([
    { name: 'imageCover', maxCount: 1 },
    { name: 'images', maxCount: 3 },
]);

const resizeTourImages = catchAsync(async function (req, res, next) {
    if (!req.files.imageCover || !req.files.images) return next();

    // Cover Image
    req.body.imageCover = `tour-${req.params.id}=${Date.now()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${req.body.imageCover}`);

    // Images
    req.body.images = [];
    await Promise.all(
        req.files.images.map(async function (file, i) {
            const filename = `tour-${req.params.id}=${Date.now()}-${
                i + 1
            }-cover.jpeg`;
            await sharp(file.buffer)
                .resize(2000, 1333)
                .toFormat('jpeg')
                .jpeg({ quality: 90 })
                .toFile(`public/img/tours/${filename}`);
            req.body.images.push(filename);
        }),
    );

    next();
});

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
        // {
        //     $set: {
        //         startDates: {
        //             $dateFromString: { dateString: '$startDates' },
        //         },
        //     },
        // },
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

const getDiatances = catchAsync(async function (req, res, next) {
    const { latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');

    const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

    if (!lat || !lng) {
        next(
            new AppError(
                'Please provide latitute in the fromat lat, lng.',
                400,
            ),
        );
    }

    const distances = await Tour.aggregate([
        {
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: [lng * 1, lat * 1],
                },
                distanceField: 'distance',
                distanceMultiplier: multiplier,
            },
        },
        {
            $project: {
                distance: 1,
                name: 1,
            },
        },
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            data: distances,
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
    getDiatances,
    uploadTourImages,
    resizeTourImages,
};
