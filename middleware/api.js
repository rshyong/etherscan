'use strict';

const fetch = require('node-fetch');
const logger = require('../startup/logger.js');
const mongoose = require('../startup/mongoose.js');

/**
 * Check to see if address was provided in req.body
 * 
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @param {Function} next Express next function
 * 
 */
function checkAddress(req, res, next) {
  if (req.body && !req.body.address) return res.status(400).send('Please provide an ethereum address');
  else return next();
}

/**
 * Queries etherscan for list of transactions for provided address
 * 
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @param {Function} next Express next function
 * 
 */
async function queryForTransactionList(req, res, next) {
  req.data = req.data || {};
  try {
    let { address, startblock, endblock, } = req.body;
    let api_key = process.env.API_KEY;
    if (!startblock) startblock = 0;
    if (!endblock) endblock = 99999999;
    let url = `http://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=${startblock}&endblock=${endblock}&sort=asc&apikey=${api_key}`;
    let response = await fetch(url);
    response = await response.json();
    if (response.message !== 'OK') throw new Error(response.message);
    req.data.txlist = response.result;
    return next();
  } catch (err) {
    err = err.toString ? err.toString() : err;
    let message = `Unable to query for transactions list: ${err}`;
    logger.error(message);
    return next(err);
  }
}

/**
 * Queries etherscan for address balance
 * 
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @param {Function} next Express next function
 * 
 */
async function queryForAddressBalance(req, res, next) {
  req.data = req.data || {};
  try {
    let { address, } = req.body;
    let api_key = process.env.API_KEY;
    let url = `https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${api_key}`;
    let response = await fetch(url);
    response = await response.json();
    if (response.message !== 'OK') throw new Error(response.message);
    req.data.balance = Number(response.result) / Math.pow(10, 18);
    return next();
  } catch (err) {
    err = err.toString ? err.toString() : err;
    let message = `Unable to query for address balance: ${err}`;
    logger.error(message);
    return next(err);
  }
}

/**
 * Saves queried address and balance to mongodb
 * 
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @param {Function} next Express next function
 * 
 */
async function saveAddress(req, res, next) {
  req.data = req.data || {};
  try {
    let Address = mongoose.Address;
    await Address.create({ address: req.body.address, date: Date.now(), transactions: req.data.txlist, balance: req.data.balance, });
    return next();
  } catch (err) {
    err = err.toString ? err.toString() : err;
    let message = `Unable to save address info to mongodb: ${err}`;
    logger.error(message);
    return next(err);
  }
}

/**
 * Get list of all transactions from db
 * 
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @param {Function} next Express next function
 * 
 */
async function getTransactions(req, res, next) {
  req.data = req.data || {};
  try {
    let Address = mongoose.Address;
    let data = await Address.find({}).sort({ date: 1 });
    req.data.transactions = data;
    return next();
  } catch (err) {
    err = err.toString ? err.toString() : err;
    let message = `Unable to get address info: ${err}`;
    logger.error(message);
    return next(err);
  }
}

/**
 * Format list of all transactions. Get rid of all duplicates and combine all address transactions into single array.
 * 
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @param {Function} next Express next function
 * 
 */
function formatTransactions(req, res, next) {
  req.data = req.data || {};
  // get latest transactions for each address (no duplicates)
  let latestTransactions = req.data.transactions.reduce((acc, curr) => {
    acc[ curr.address ] = curr.transactions;
    return acc;
  }, {});
  // combine all transactions into single array
  req.data.transactions = Object.keys(latestTransactions).reduce((acc, curr) => {
    acc = acc.concat(latestTransactions[ curr ]);
    return acc;
  }, []);
  return next();
}

/**
 * Filter transactions based on provided query. Can combine queries
 * 
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @param {Function} next Express next function
 * 
 */
function queryTransactions(req, res, next) {
  req.data = req.data || {};
  req.body = req.body || {};
  req.data.transactions = req.data.transactions.filter(i => {
    let bool = true;
    if (req.body.minTime !== undefined && req.body.maxTime !== undefined) { // check for transaction done between certain dates
      let minTime = new Date(req.body.minTime).getTime() / 1000; // in seconds since block timestamps are in seconds
      let maxTime = new Date(req.body.maxTime).getTime() / 1000; // in seconds since block timestamps are in seconds
      bool = bool && i.timeStamp >= minTime && i.timeStamp <= maxTime;
    }
    if (req.body.minGasPrice !== undefined && req.body.maxGasPrice !== undefined) { // when combined with minTime and maxTime, can check to see how gasPrices fluctuate
      bool = bool && i.gasPrice >= req.body.minGasPrice && i.gasPrice <= req.body.maxGasPrice;
    }
    if (req.body.from !== undefined) { // in case you want to see all transactions originating from a given address
      bool = bool && i.from === req.body.from;
    }
    if (req.body.to !== undefined) { // in case you want to see all transactions going to a given address
      bool = bool && i.to === req.body.to;
    }
    if (req.body.isError !== undefined) { //0 is Pass and 1 is Error; Can see which transactions failed
      bool = bool && i.isError === req.body.isError;
    }
    return bool;
  });
  return next();
}

/**
 * Get all addresses from db.
 * 
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @param {Function} next Express next function
 * 
 */
async function getAllAddresses(req, res, next) {
  req.data = req.data || {};
  try {
    let Address = mongoose.Address;
    let data = await Address.find({});
    req.data.addresses = data;
    return next();
  } catch (err) {
    err = err.toString ? err.toString() : err;
    let message = `Unable to get all transactions: ${err}`;
    logger.error(message);
    return next(err);
  }
}

/**
 * Return balance by ETH address
 * 
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @param {Function} next Express next function
 * 
 */
function formatAddressBalances(req, res, next) {
  req.data = req.data || {};
  req.data.addressBalances = req.data.addresses.reduce((acc, curr) => {
    if (acc[ curr.address ] && acc[ curr.address ].date.getTime() > curr.date.getTime()) {
      return acc;
    } else {
      acc[ curr.address ] = {
        balance: curr.balance,
        date: curr.date,
        numTransactions: curr.transactions.length,
      };
      return acc;
    }
  }, {});
  delete req.data.addresses;
  return next();
}

/**
 * Send 200 status and req.data in response
 * 
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @param {Function} next Express next function
 * 
 */
function sendResponse(req, res) {
  req.data = req.data || {};
  res.status(200).send(req.data);
}

module.exports = {
  checkAddress,
  queryForTransactionList,
  queryForAddressBalance,
  saveAddress,
  getTransactions,
  formatTransactions,
  queryTransactions,
  getAllAddresses,
  formatAddressBalances,
  sendResponse,
}