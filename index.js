const fs = require('fs');
const express = require('express');
const app = express();
app.use(express.json());

const port = 3000;

app.listen(port, function () {
    console.log(`App running on port ${port}...`);
});
