const express = require('express');
const app = express();
app.get('/', function (req, res) {
  res
    .status(200)
    .json({ message: 'Hello from the server side!', app: 'SafarSathi' });
});

const port = 3000;
app.listen(port, function () {
  console.log(`App running on port ${port}...`);
});
