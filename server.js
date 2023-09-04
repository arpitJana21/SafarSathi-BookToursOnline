const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', function (error) {
    console.log('\n⚠ UNCAUGHT EXCEPTION ⚠\n');
    console.log(error);
    console.log('SHUTTING DOWN THE SERVER...');
    process.exit(1);
});

dotenv.config({ path: './config.env' });
const { app } = require('./app');

const DB_URL = process.env.DATABASE;
const PORT_NUM = process.env.PORT;

// Identifing if The server is running on "Production" or on "Development"

if (process.env.npm_lifecycle_event === 'dev') {
    process.env.NODE_ENV = 'development';
    console.log('Server is Running on *DEVELOPMENT');
} else {
    console.log('Server is running on *PRODUCTION');
}

const server = app.listen(PORT_NUM, function () {
    console.log('Connecting with DataBase...');
});

mongoose
    .connect(DB_URL)
    .then(function () {
        // const localWebUrl = `WEB URL: {{PROTOCOL}}://{{HOST}}:{{PORT}}/`;
        const loaclAPIUrl = `API URL: {{PROTOCOL}}://{{HOST}}:{{PORT}}/api/v1/`;
        console.log('DataBase Connection successful.');
        // console.log(localWebUrl);
        console.log(loaclAPIUrl);
    })
    .catch(function (error) {
        console.log('\n⚠ DATABASE CONNECTION ERROR ⚠\n');
        console.log(error);
        console.log('SHUTTING DOWN THE SERVER...');
        server.close(function () {
            process.exit(1);
        });
    });

process.on('unhandledRejection', function (error) {
    console.log('\n⚠ UNHUNDLED REJECTION ⚠\n');
    console.log(error);
    console.log('SHUTTING DOWN THE SERVER...');
    server.close(function () {
        process.exit(1);
    });
});
