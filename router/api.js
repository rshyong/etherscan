'use strict';

const api = require('express').Router();
const apiMiddleware = require('../middleware/api');

api.post('/',
  apiMiddleware.getTransactionList,
  apiMiddleware.getAddressBalance,
  apiMiddleware.sendResponse);

module.exports = api;