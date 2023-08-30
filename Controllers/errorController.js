const { AppError } = require('../utils/appError');

const handleCastErrorDB = function (error) {
    const message = `Invalid ${error.path}: ${error.value}`;
    return new AppError(message, 400);
};

const handleDuplicateDB = function (error) {
    const value = error.keyValue.name;
    const message = `Duplicate field value: "${value}". Please use another value.`;
    return new AppError(message, 400);
};

const handleValidationError = function (error) {
    const errors = Object.values(error.errors).map(function (el) {
        return el.message;
    });
    const message = `Invalid Input Data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};

const handleJWTError = function () {
    const message = 'Invalid token. Please log in again';
    return new AppError(message, 401);
};

const handleJWTExpireError = function () {
    const message = 'Your Token has been Expired. Please log in again';
    return new AppError(message, 401);
};

const sendErrorDev = function (req, err, res) {
    // API
    if (req.originalUrl.startsWith('/api')) {
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack,
        });
    } else {
        // Rendered Website
        res.status(err.statusCode).render('error', {
            title: 'Something went worng',
            msg: err.message,
        });
    }
};

const sendErrorProd = function (req, err, res) {
    // A) API
    if (req.originalUrl.startsWith('/api')) {
        // A) Operational, trusted error: send message to client
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
            });
        }
        // B) Programming or other unknown error: don't leak error details
        // 1) Log error
        console.error('ERROR 💥', err);
        // 2) Send generic message
        return res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!',
        });
    }

    // B) RENDERED WEBSITE
    // A) Operational, trusted error: send message to client
    if (err.isOperational) {
        console.log(err);
        return res.status(err.statusCode).render('error', {
            title: 'Something went wrong!',
            msg: err.message,
        });
    }
    // B) Programming or other unknown error: don't leak error details
    // 1) Log error
    console.error('ERROR 💥', err);
    // 2) Send generic message
    return res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: 'Please try again later.',
    });
};

const globalErrorHandler = function (err, req, res, next) {
    // console.log(err.stack);
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(req, err, res);
    }

    if (process.env.NODE_ENV === 'production') {
        let error = { ...err };
        error.message = err.message;

        // Trying to access Item with Invalid ID Value
        if (err.name === 'CastError') {
            error = handleCastErrorDB(error);
        }

        // Trying to Create Item with Duplicate Value
        if (err.code === 11000) {
            error = handleDuplicateDB(error);
        }

        // Handle Validation Error
        if (err.name === 'ValidationError') {
            error = handleValidationError(error);
        }

        // JsonWebTokenError
        if (err.name === 'JsonWebTokenError') {
            error = handleJWTError();
        }

        if (err.name === 'TokenExpiredError') {
            error = handleJWTExpireError();
        }
        sendErrorProd(req, error, res);
    }
};

module.exports = { globalErrorHandler };
