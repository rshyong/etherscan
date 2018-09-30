'use strict';

const fetch = require('node-fetch');

async function queryEtherscan(req, res, next) {
  if (req.body && !req.body.address) return res.status(400).send('Please provide an ethereum address');
  let address = req.body.address;
  let url = `https://api.etherscan.io/api?module=proxy&action=eth_getTransactionCount&address=${address}&tag=latest&apikey=IQASWFG9IUX42KGWIYYKCQP68S36EVRXQ1`;
  let response = await fetch(url);
  response = await response.json();
  return next();
}

function sendResponse(req, res) {
  res.status(200).send({});
}

module.exports = {
  queryEtherscan,
  sendResponse,
}