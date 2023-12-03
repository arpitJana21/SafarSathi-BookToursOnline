const path = require('path');
const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const { tourRouter } = require('./Routes/toursRoutes');
const { userRouter } = require('./Routes/userRoutes');
const { reviewRouter } = require('./Routes/reviewRoute');
const { bookingRouter } = require('./Routes/bookingRoute');

const { AppError } = require('./utils/appError');
const { globalErrorHandler } = require('./Controllers/errorController');

const app = express();

// Setting The Pug Template
// app.set('view engine', 'pug');
// app.set('views', path.join(__dirname, 'views'));

// Global Middleware

// Serving Static Files
app.use(express.static(path.join(__dirname, 'public')));

app.use(morgan('dev'));

// Set Security HTTP Headers
const cspConfig = helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
            "'self'",
            'https://cdnjs.cloudflare.com',
            'https://api.mapbox.com',
            'https://js.stripe.com/v3/',
            'https://cdn.jsdelivr.net/npm/axios@1.5.0/dist/axios.min.js', // Add domains for specific JS files here
        ],
        // Include other CSP directives as needed for other resource types
    },
});

app.use(cspConfig);

// Set Rate Limit
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, Please try again in an hour!',
});

app.use('/api', limiter);

// Body parser
// Receive JSON Data from Req.body
app.use(express.json({ limit: '10kb' }));
// Receive Cookie from Browser
app.use(cookieParser());
// Receive From Data
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Data Sanitization against NO-SQL query injection
app.use(mongoSanitize());

// Data Sanitization against XSS
app.use(xss());

// Prevent Parameter Polution
app.use(
    hpp({
        whitelist: [
            'duration',
            'ratingsQuantity',
            'ratingsAverage',
            'maxGroupSize',
            'price',
        ],
    }),
);

// Compress Responces
app.use(compression());

// Test Middleware
app.use(function (req, res, next) {
    // console.log(req.cookies);
    next();
});

// Routes Middlewares
// app.use('/', viewRouter);

app.get('/', function (req, res) {
    res.redirect('https://documenter.getpostman.com/view/25970142/2s9Y5YRN2L');
});

app.use('/api/v1/tours/', tourRouter);
app.use('/api/v1/users/', userRouter);
app.use('/api/v1/reviews/', reviewRouter);
app.use('/api/v1/bookings/', bookingRouter);

// Handle Unhandled Routes
app.all('*', function (req, res, next) {
    const message = `Can't find ${req.originalUrl} on this Server!`;
    const err = new AppError(message, 404);
    next(err);
});

app.use(globalErrorHandler);

module.exports = { app };
