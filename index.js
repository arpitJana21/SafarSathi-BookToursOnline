const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const { tourRouter } = require('./Routes/tours.routes');

dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE;
const port = process.env.PORT;

const app = express();
app.use(express.json());

app.use('/api/v1/tours/', tourRouter);

console.log('Wait for the DB Connection...');
mongoose.connect(DB).then(function () {
    console.log('DB conndection successful.');
    app.listen(port, function () {
        console.log(`Server URL: http://127.0.0.1:${port}/api/v1/`);
    });
});
