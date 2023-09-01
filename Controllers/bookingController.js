const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Tour } = require('../Models/tourModel');
const { catchAsync } = require('../utils/catchAsync');

const getCheckoutSession = catchAsync(async function (req, res, next) {
    // Get Currently Booked Tour
    const tour = await Tour.findById(req.params.tourID);

    console.log(tour.slug);

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: `${req.protocol}://${req.get('host')}/`,
        cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.tourID,
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `${tour.name} Tour`,
                        description: tour.summary,
                        images: [
                            'https://images.unsplash.com/photo-1500622944204-b135684e99fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bmF0dXJhbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
                        ],
                    },
                    unit_amount: tour.price * 100,
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

module.exports = { getCheckoutSession };
