'use strict';

const expect = require('chai').expect;
const middleware = require('../middleware');
const api = middleware.api;

describe('API middleware tests', function () {
  let req, res, next;
  beforeEach(function () {
    req = {};
    res = {};
    next = function () { };
  });

  describe('checkAddress', function () {
    it('return 400 error if address is not on req.body', function () {
      req.body = { noAddress: '', };
      res = {
        send: function() { },
        status: function(responseStatus) {
          expect(responseStatus).to.be.equal(400);
          return this;
        },
      };
      api.checkAddress(req, res, next);
    });
  });

  describe('getTranscation')
});