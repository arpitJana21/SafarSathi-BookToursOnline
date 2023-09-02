const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Tour } = require('../Models/tourModel');
const { Booking } = require('../Models/bookingModel');
const { catchAsync } = require('../utils/catchAsync');
const factory = require('./handleFactory');

const getCheckoutSession = catchAsync(async function (req, res, next) {
    // Get Currently Booked Tour
    const tour = await Tour.findById(req.params.tourID);

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: `${req.protocol}://${req.get('host')}/?tour=${
            req.params.tourID
        }&user=${req.user.id}&price=${tour.price}`,
        cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.tourID,
        line_items: [
            {
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: `${tour.name} Tour`,
                        description: tour.summary,
                        images: [
                            'https://images.unsplash.com/photo-1500622944204-b135684e99fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bmF0dXJhbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
                        ],
                    },
                    unit_amount: tour.price * 100 * 60,
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
    });

    // Create session as response
    res.status(200).json({
        status: 'success',
        session: session,
    });
});

const createBookingCheckout = async function (req, res, next) {
    const { tour, user, price } = req.query;

    if (!tour && !user && !price) {
        return next();
    }
    await Booking.create({ tour, user, price });
    res.redirect(req.originalUrl.split('?')[0]);
    next();
};

const createBooking = factory.createOne(Booking);
const getBooking = factory.getOne(Booking);
const getAllBookings = factory.getAll(Booking);
const updateBooking = factory.updateOne(Booking);
const deleteBooking = factory.deleteOne(Booking);

module.exports = {
    getCheckoutSession,
    createBookingCheckout,
    createBooking,
    getBooking,
    getAllBookings,
    updateBooking,
    deleteBooking,
};
