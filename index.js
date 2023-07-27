const dotenv = require('dotenv');
const express = require('express');

dotenv.config({ path: './config.env' });
const app = express();

app.use(express.json());

const port = process.env.PORT;

app.listen(port, function () {
    console.log(`App running on port ${port}...`);
});

let x = 5;
x = 9;

console.log(x);
