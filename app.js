const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');

const { tourRouter } = require('./Routes/toursRoutes');
const { userRouter } = require('./Routes/userRoutes');
const { AppError } = require('./utils/appError');
const { globalErrorHandler } = require('./Controllers/errorController');

const app = express();

// Global Middleware

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

// Data Sanitization against NO-SQL query injection
app.use(mongoSanitize());

// Routes Middlewares
app.use('/api/v1/tours/', tourRouter);
app.use('/api/v1/users/', userRouter);

// Handle Unhandled Routes
app.all('*', function (req, res, next) {
    const message = `Can't find ${req.originalUrl} on this Server!`;
    const err = new AppError(message, 404);
    next(err);
});

app.use(globalErrorHandler);

module.exports = { app };
