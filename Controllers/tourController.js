const { Tour } = require('../Models/tourModel');

const aliasTopTours = async function (req, res, next) {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summery,difficulty';
    next();
};
const getAllTours = async function (req, res) {
    try {
        // BUILD QUERY

        // 1) FILTERING
        let queryObj = { ...req.query };
        const excludeFields = ['page', 'sort', 'limit', 'fields'];
        excludeFields.forEach(function (ele) {
            delete queryObj[ele];
        });

        // 2) ADV. FILTERING
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/(gte|gt|lte|lt)\b/g, function (match) {
            return `$${match}`;
        });
        queryObj = JSON.parse(queryStr);

        let query = Tour.find(queryObj);

        // 3) SORTING
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }

        // 4) FIELD LIMITING
        if (req.query.finds) {
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        } else {
            query = query.select('-__v');
        }

        // 5) PAGINATION
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 100;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);

        if (req.query.page) {
            const numTours = await Tour.countDocuments();
            if (skip >= numTours) throw new Error('Page Does not Exist');
        }

        // 5) EXECUTE QUERY
        const tours = await query;

        // 6) SEND RESPONSE
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

module.exports = {
    getAllTours,
    createTour,
    getTour,
    updateTour,
    deleteTour,
    aliasTopTours,
};
