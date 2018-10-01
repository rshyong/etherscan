'use strict';

const mongoose = require('mongoose');
const logger = require('./logger.js');
mongoose.connect('mongodb://127.0.0.1:27017/etherscan');
const db = mongoose.connection;
db.on('error', logger.error.bind(logger, 'Connection error'));
db.once('open', function() {
  logger.silly('Connected to mongoose db');
});
const models = require('../models');
let mongooseModel = {};
Object.keys(models).forEach(model => {
  let name = model[ 0 ].toUpperCase() + model.slice(1);
  mongooseModel[ name ] = mongoose.model(name, models[ model ]);
});

module.exports = mongooseModel;