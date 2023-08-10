const express = require('express');

const { tourRouter } = require('./Routes/toursRoutes');
const { userRouter } = require('./Routes/userRoutes');
const { AppError } = require('./utils/appError');
const { globalErrorHandler } = require('./Controllers/errorController');

const app = express();

// JSON Middleware
app.use(express.json());

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
