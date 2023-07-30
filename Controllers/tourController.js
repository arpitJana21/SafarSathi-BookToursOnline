const { Tour } = require('../Models/tourModel');

const getAllTours = async function (req, res) {
    try {
        const tours = await Tour.find();

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

        return res.status(201).json({
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
        return res.status(201).json({
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
        return res.status(201).json({
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
        return res.status(201).json({
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

module.exports = { getAllTours, createTour, getTour, updateTour, deleteTour };
