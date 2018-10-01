'use strict';

require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const router = require('./router');
const api = router.api;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api', api);

app.get('/', function (req, res) {
  res.send('<h1>Hello World!</h1>');
});

// send 404 if no routes matched
app.use((req, res) => {
  res.status(404).end();
});

app.listen(3000, () => {
  console.log(`Server listening on port 3000!`);
});