'use strict';

require('dotenv').config();
// startup winston logger
require('./startup/logger.js');
// connect to mongodb and load schemas
require('./startup/mongoose.js');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const router = require('./router');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

Object.keys(router).forEach(route => {
  app.use(`/${route}`, router[ route ]);
});

// send 404 if no routes matched
app.use((req, res) => {
  res.status(404).send('Endpoint does not exist');
});

app.listen(3000, () => {
  console.log(`Server listening on port 3000!`);
});