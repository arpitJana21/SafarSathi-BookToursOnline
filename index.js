const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');

const tourRouter = require('./Routes/tours.routes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./Controllers/errorController');

dotenv.config({ path: './config.env' });
const DB_URL = process.env.DATABASE;
const port = process.env.PORT;

// Identifing if The server is running on "Production" or on "Development"
if (process.env.npm_lifecycle_event === 'dev')
    process.env.NODE_ENV = 'development';
else process.env.NODE_ENV = 'production';

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

const server = app.listen(port, function () {
    console.log(`Server URL: http://127.0.0.1:${port}/api/v1/`);
    console.log('Connecting with DataBase...');
});

mongoose
    .connect(DB_URL)
    .then(function () {
        console.log('DB conndection successful.');
    })
    .catch(function (error) {
        console.log('\n⚠ ⚠ ## DATABASE CONNECTION ERROR ## ⚠ ⚠\n');
        console.log(error);
        console.log('SHUTTING DOWN THE SERVER...');
        server.close(function () {
            process.exit(1);
        });
    });

process.on('unhandledRejection', function (error) {
    console.log('\n⚠ ⚠ ## UNHUNDLED REJECTION ## ⚠ ⚠\n');
    console.log(error);
    console.log('SHUTTING DOWN THE SERVER...');
    server.close(function () {
        process.exit(1);
    });
});

process.on('uncaughtException', function (error) {
    console.log('\n⚠ ⚠ ## UNCAUGHT EXCEPTION ## ⚠ ⚠\n');
    console.log(error);
    console.log('SHUTTING DOWN THE SERVER...');
    server.close(function () {
        process.exit(1);
    });
});
