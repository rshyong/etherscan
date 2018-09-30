'use strict';

const api = require('express').Router();
const apiMiddleware = require('../middleware/api');

api.post('/',
  apiMiddleware.queryEtherscan,
  apiMiddleware.sendResponse);

module.exports = api;