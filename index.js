const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE;
console.log(DB);

mongoose.connect(DB).then(function () {
    console.log('DB conndection successful');
});

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true,
    },
    rating: {
        type: Number,
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price'],
    },
});

const Tour = mongoose.model('Tour', tourSchema);

const testTour = new Tour({
    name: 'The Park Camper',
    rating: 4.7,
    price: 497,
});

testTour
    .save()
    .then(function (doc) {
        console.log(doc);
    })
    .catch(function (err) {
        console.log(err);
    });

const app = express();

app.use(express.json());

const port = process.env.PORT;

app.listen(port, function () {
    console.log(`App running on port ${port}...`);
});
