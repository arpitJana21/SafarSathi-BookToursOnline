const path = require('path');
const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const { tourRouter } = require('./Routes/toursRoutes');
const { userRouter } = require('./Routes/userRoutes');
const { reviewRouter } = require('./Routes/reviewRoute');
const { viewRouter } = require('./Routes/viewRoutes');

const { AppError } = require('./utils/appError');
const { globalErrorHandler } = require('./Controllers/errorController');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Global Middleware

// Serving Static Files
app.use(express.static(path.join(__dirname, 'public')));

app.use(morgan('dev'));

// Set Security HTTP Headers
app.use(helmet());

// Set Rate Limit
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, Please try again in an hour!',
});

app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

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

// Test Middleware
app.use(function (req, res, next) {
    console.log(req.cookies);
    next();
});

// Routes Middlewares
app.use('/', viewRouter);
app.use('/api/v1/tours/', tourRouter);
app.use('/api/v1/users/', userRouter);
app.use('/api/v1/reviews/', reviewRouter);

// Handle Unhandled Routes
app.all('*', function (req, res, next) {
    const message = `Can't find ${req.originalUrl} on this Server!`;
    const err = new AppError(message, 404);
    next(err);
});

app.use(globalErrorHandler);

module.exports = { app };
