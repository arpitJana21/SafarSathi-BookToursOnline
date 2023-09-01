const express = require('express');
const viewController = require('../Controllers/viewsController');
const authController = require('../Controllers/authController');
const bookingController = require('../Controllers/bookingController');

const viewRouter = express.Router();

const setCSPHeaders = (req, res, next) => {
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'self' https://*.mapbox.com https://*.stripe.com; " +
            "base-uri 'self'; block-all-mixed-content; font-src 'self' https: data:; " +
            "frame-ancestors 'self'; img-src 'self' data:; object-src 'none'; " +
            "script-src 'self' https://cdn.jsdelivr.net/npm/axios@1.5.0/dist/axios.min.js https://cdnjs.cloudflare.com https://api.mapbox.com https://js.stripe.com/v3/ 'unsafe-inline' 'unsafe-eval' blob:; " +
            "script-src-attr 'none'; style-src 'self' https: 'unsafe-inline'; upgrade-insecure-requests;",
        // Add other CSP directives as needed
    );
    next();
};

viewRouter.use(setCSPHeaders);

viewRouter.get(
    '/',
    bookingController.createBookingCheckout,
    authController.isLoggedIn,
    viewController.getOverview,
);
viewRouter.get(
    '/tour/:slug',
    authController.isLoggedIn,
    viewController.getTour,
);
viewRouter.get(
    '/login',
    authController.isLoggedIn,
    viewController.getLoginForm,
);
viewRouter.get('/me', authController.protect, viewController.getAccount);
viewRouter.post(
    '/submit-user-data',
    authController.protect,
    viewController.updateUserData,
);

module.exports = { viewRouter };
