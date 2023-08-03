const { Tour } = require('../Models/tourModel');
const { APIFeatures } = require('../utils/apiFeatures');

const aliasTopTours = async function (req, res, next) {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summery,difficulty';
    next();
};

const getAllTours = async function (req, res) {
    try {
        // EXECUTE QUERY
        let features = new APIFeatures(Tour.find(), req.query);
        features = features.filter().sort().limitFields().paginate();
        const tours = await features.query;

        // SEND RESPONSE
        return res.status(200).json({
            status: 'success',
            results: tours.length,
            data: { tours },
        });
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            error: error,
        });
    }
};

const createTour = async function (req, res) {
    // const newTour = new Tour({});
    // newTour.save();
    try {
        const tour = await Tour.create(req.body);

        return res.status(200).json({
            status: 'success',
            data: { tour },
        });
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            error: error,
        });
    }
};

const getTour = async function (req, res) {
    try {
        const tour = await Tour.findById(req.params.id);
        return res.status(200).json({
            status: 'success',
            data: { tour },
        });
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            error: error,
        });
    }
};

const updateTour = async function (req, res) {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        return res.status(200).json({
            status: 'success',
            data: { tour },
        });
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            error: error,
        });
    }
};

const deleteTour = async function (req, res) {
    try {
        await Tour.findByIdAndDelete(req.params.id);
        return res.status(200).json({
            status: 'success',
            data: null,
        });
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            error: error,
        });
    }
};

const getTourStats = async function (req, res) {
    try {
        const stats = await Tour.aggregate([
            {
                $match: { ratingsAverage: { $gte: -1.0 } },
            },
            {
                $group: {
                    // _id: null,
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
            // {
            //     $match: { _id: { $ne: 'EASY' } },
            // },
        ]);

        return res.status(200).json({
            status: 'success',
            data: { stats },
        });
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            error: error,
        });
    }
};

const getMonthlyPlan = async function (req, res) {
    try {
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
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            error: error,
        });
    }
};

module.exports = {
    getAllTours,
    createTour,
    getTour,
    updateTour,
    deleteTour,
    aliasTopTours,
    getTourStats,
    getMonthlyPlan,
};
