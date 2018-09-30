'use strict';

const api = require('express').Router();
const apiMiddleware = require('../middleware/api');

api.get('/',
  apiMiddleware.test,
  apiMiddleware.sendResponse);

module.exports = api;