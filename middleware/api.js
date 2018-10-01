'use strict';

const fetch = require('node-fetch');
const logger = require('../startup/logger.js');

async function getTransactionList(req, res, next) {
  req.data = req.data || {};
  try {
    if (req.body && !req.body.address) return res.status(400).send('Please provide an ethereum address');
    let { address, startblock, endblock, } = req.body;
    let api_key = process.env.API_KEY;
    if (!startblock) startblock = 0;
    if (!endblock) endblock = 99999999;
    let url = `http://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=${startblock}&endblock=${endblock}&sort=asc&apikey=${api_key}`;
    let response = await fetch(url);
    response = await response.json();
    req.data.txlist = response.result;
    return next();
  } catch (err) {
    err = err.toString ? err.toString() : err;
    let message = `Unable to get transactions list: ${err}`;
    logger.error(message);
    return next(err);
  }
}

async function getAddressBalance(req, res, next) {
  req.data = req.data || {};
  try {
    if (req.body && !req.body.address) return res.status(400).send('Please provide an ethereum address');
    let { address, } = req.body;
    let api_key = process.env.API_KEY;
    let url = `https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${api_key}`;
    let response = await fetch(url);
    response = await response.json();
    req.data.balance = response.result;
    return next();
  } catch (err) {
    err = err.toString ? err.toString() : err;
    let message = `Unable to get address balance: ${err}`;
    logger.error(message);
    return next(err);
  }
}

function sendResponse(req, res) {
  req.data = req.data || {};
  res.status(200).send(req.data);
}

module.exports = {
  getTransactionList,
  getAddressBalance,
  sendResponse,
}