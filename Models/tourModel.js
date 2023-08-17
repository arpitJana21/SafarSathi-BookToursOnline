const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'A tour must have a name'],
            unique: true,
            trim: true,
            maxlength: [
                40,
                'A tour name must have less or equel to 40 characters',
            ],
            minlength: [
                10,
                'A tour name must have more or equel to 10 characters',
            ],
        },
        slug: String,
        duration: {
            type: Number,
            required: [true, 'A tour must have a duration'],
        },
        maxGroupSize: {
            type: Number,
            required: [true, 'A tour must have a group size'],
        },
        ratingsAverage: {
            type: Number,
            default: 4.5,
            min: [1, 'Rating must be greater or equal to 1.0'],
            max: [5, 'Rating must be lesser or equel to 5.0'],
        },
        ratingsQuantity: {
            type: Number,
            default: 0,
        },
        difficulty: {
            type: String,
            required: [true, 'A tour must have difficulty'],
            enum: {
                values: ['easy', 'medium', 'difficult'],
                message: 'Difficulty can be either easy, medium or difficult',
            },
        },
        price: {
            type: Number,
            required: [true, 'A tour must have a price'],
        },
        priceDiscount: {
            type: Number,
            validate: {
                validator: function (val) {
                    // This only points to current DOC or NEW DOC
                    return val < this.price;
                },
                message:
                    'Discount Price ({VALUE}) Should be below regular price',
            },
        },
        summary: {
            type: String,
            trim: true,
            required: [true, 'A tour must have a summery'],
        },
        description: {
            type: String,
            trim: true,
        },
        imageCover: {
            type: String,
            require: [true, 'A tour must have a cover image'],
        },
        images: [String],
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false,
        },
        startDates: [Date],
        secretTour: {
            type: Boolean,
            default: false,
            // select: false,
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    },
);

// Virtual Fields
tourSchema.virtual('durationWeeks').get(function () {
    if (this.duration) return this.duration / 7;
});

// DOCUMENT MIDDLEWARE :
// runs before save(); create();
tourSchema.pre('save', function (next) {
    this.slug = this.name.toLowerCase();
    next();
});

// QUERY MIDDLEWARE :
// runs before find(); findOne(); findOneAndDelete(); findOneAndRemove(); findOneAndUpdate();
tourSchema.pre(/^find/, function (next) {
    this.find({ secretTour: { $ne: true } });
    this.start = Date.now();
    next();
});

tourSchema.post(/^find/, function (docs, next) {
    console.dir(`Query Took ${Date.now() - this.start} millisecods !`);
    next();
});

// AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
    next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = { Tour };
