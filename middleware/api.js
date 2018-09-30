'use strict';

function test(req, res, next) {
  console.log('you are in api test');
  return next();
}

function sendResponse(req, res) {
  res.status(200).send({});
}

module.exports = {
  test,
  sendResponse,
}