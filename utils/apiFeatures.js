class APIFeatures {
    constructor(query, reqQuery) {
        this.query = query;
        this.reqQuery = reqQuery;
        console.log('API Features');
    }

    filter() {
        // 1) FILTERING
        let queryObj = { ...this.reqQuery };
        const excludeFields = ['page', 'sort', 'limit', 'fields'];
        excludeFields.forEach(function (ele) {
            delete queryObj[ele];
        });

        // 2) ADV. FILTERING
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/(gte|gt|lte|lt)\b/g, function (match) {
            return `$${match}`;
        });
        queryObj = JSON.parse(queryStr);

        console.log(queryObj);

        this.query = this.query.find(queryObj);
        return this;
    }

    sort() {
        // 3) SORTING
        if (this.reqQuery.sort) {
            const sortBy = this.reqQuery.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-createdAt');
        }
        return this;
    }

    limitFields() {
        // 4) FIELD LIMITING
        if (this.reqQuery.fields) {
            const fields = this.reqQuery.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v');
        }
        return this;
    }

    paginate() {
        // 5) PAGINATION
        const page = this.reqQuery.page * 1 || 1;
        const limit = this.reqQuery.limit * 1 || 100;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}

module.exports = { APIFeatures };
