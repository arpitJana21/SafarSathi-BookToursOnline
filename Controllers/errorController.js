const AppError = require('../utils/appError');

const handleCastErrorDB = function (error) {
    const message = `Invalid ${error.path}: ${error.value}`;
    return new AppError(message, 400);
};

const handleDuplicateDB = function (error) {
    //  keyValue: { name: 'The Northern Lights' }
    const value = error.keyValue.name;
    const message = `Duplicate field value: "${value}". Please use another value.`;
    return new AppError(message, 400);
};

const sendErrorDev = function (err, res) {
    return res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};

const sendErrorProd = function (err, res) {
    // Operational Trusted error: Send to message to client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });

        // Programming or other unknown Error : don't leak the error details
    } else {
        // Log Error
        // console.error(err);

        // Send generic message
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!',
        });
    }
};

module.exports = function (err, req, res, next) {
    // console.log(err.stack);
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else {
        let error = { ...err };

        // Trying to access Item with Invalid ID Value
        if (err.name === 'CastError') {
            error = handleCastErrorDB(error);
        }

        // Trying to Create Item with Duplicate Value
        if (err.code === 11000) {
            error = handleDuplicateDB(error);
        }
        sendErrorProd(error, res);
    }
};
