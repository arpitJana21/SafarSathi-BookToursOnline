const { Tour } = require('../Models/tourModel');
const { catchAsync } = require('../utils/catchAsync');

const getOverview = catchAsync(async function (req, res) {
    // Get Tour Data from collection
    const tours = await Tour.find();
    // Build template
    // Render that template using tour data from 1
    res.status(200).render('overview', {
        title: 'All Tours',
        tours: tours,
    });
});

const getTour = catchAsync(async function (req, res) {
    // Get the data, for the requested tour ( including reviews and guides )
    const tour = await Tour.findOne({ slug: req.params.slug }).populate({
        path: 'reviews',
        fields: 'review rating user',
    });
    console.log(tour.reviews);
    res.status(200).render('tour', {
        title: `${tour.name} Tour`,
        tour: tour,
    });
});

module.exports = { getOverview, getTour };
