const express = require('express');

const { tourRouter } = require('./Routes/tours.routes');
const { AppError } = require('./utils/appError');
const { globalErrorHandler } = require('./Controllers/errorController');

// Identifing if The server is running on "Production" or on "Development"
if (process.env.npm_lifecycle_event === 'dev') {
    process.env.NODE_ENV = 'development';
    console.log('Server is Running on *DEVELOPMENT');
} else {
    process.env.NODE_ENV = 'production';
    console.log('Server is running on *PRODUCTION');
}

const app = express();

// JSON Middleware
app.use(express.json());

// Routes Middlewares
app.use('/api/v1/tours/', tourRouter);

// Handle Unhandled Routes
app.all('*', function (req, res, next) {
    const err = new AppError(
        `Can't find ${req.originalUrl} on this Server!`,
        404,
    );
    next(err);
});

app.use(globalErrorHandler);

module.exports = { app };
