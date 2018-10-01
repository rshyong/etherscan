'use strict';

const api = require('express').Router();
const apiMiddleware = require('../middleware/api');

/* Query etherscan for transaction list and account balance */
api.post('/queryEtherscan',
  apiMiddleware.checkAddress,
  apiMiddleware.queryForTransactionList,
  apiMiddleware.queryForAddressBalance,
  apiMiddleware.saveAddress,
  apiMiddleware.sendResponse);

/* Return back selected transaction based on provided params */
api.post('/getTransactions',
  apiMiddleware.getTransactions,
  apiMiddleware.formatTransactions,
  apiMiddleware.queryTransactions,
  apiMiddleware.sendResponse);

/* Get address balances and other info */
api.post('/getAddressBalances',
  apiMiddleware.getAllAddresses,
  apiMiddleware.formatAddressBalances,
  apiMiddleware.sendResponse);

module.exports = api;