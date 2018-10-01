'use strict';

const fetch = require('node-fetch');

async function queryEtherscan(req, res, next) {
  if (req.body && !req.body.address) return res.status(400).send('Please provide an ethereum address');
  let { address, startblock, endblock, } = req.body;
  let api_key = process.env.API_KEY;
  if (!startblock) startblock = 0;
  if (!endblock) endblock = 99999999;
  let url = `http://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=${startblock}&endblock=${endblock}&sort=asc&apikey=${api_key}`;
  let response = await fetch(url);
  response = await response.json();
  req.data = response.result;
  return next();
}

function sendResponse(req, res) {
  req.data = req.data || {};
  res.status(200).send(req.data);
}

module.exports = {
  queryEtherscan,
  sendResponse,
}