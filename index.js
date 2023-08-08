const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');

const tourRouter = require('./Routes/tours.routes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./Controllers/errorController');

dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE;
const port = process.env.PORT;
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

console.log('Wait for the DB Connection...');
mongoose.connect(DB).then(function () {
    console.log('DB conndection successful.');
    app.listen(port, function () {
        console.log(`Server URL: http://127.0.0.1:${port}/api/v1/`);
    });
});
