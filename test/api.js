'use strict';

const expect = require('chai').expect;
const middleware = require('../middleware');
const api = middleware.api;

describe('API middleware tests', function () {
  let req, res, next;

  beforeEach(function () {
    req = {};
    res = {};
    next = function () {
      return req.data
    };
  });

  describe('checkAddress', function () {
    it('return 400 error if address is not on req.body', function () {
      req.body = { noAddress: '', };
      res = {
        send: function(error) { return error },
        status: function(responseStatus) {
          expect(responseStatus).to.be.equal(400);
          return this;
        },
      };
      let response = api.checkAddress(req, res, next);
      expect(response).to.be.equal('Please provide an ethereum address');
    });
  });

  describe('formatTransactions', function () {
    it('removes all duplicate addresses and combines all transactions into single array', function () {
      req.data = {
        transactions: [{
          address: '0x1',
          transactions: [{
            blockNumber: 1,
          }, {
            blockNumber: 2,
          }
          ],
        }, {
            address: '0x1',
            transactions: [{
              blockNumber: 1,
            }, {
              blockNumber: 2,
            }, {
              blockNumber: 3,
            }
            ],
          }, {
            address: '0x2',
            transactions: [{
              blockNumber: 14,
            },
            ],
        }
        ],
      };
      let expectedResult = [
        { blockNumber: 1 },
        { blockNumber: 2 },
        { blockNumber: 3 },
        { blockNumber: 14 }
      ];
      let result = api.formatTransactions(req, res, next);
      expect(result.transactions).to.be.deep.equal(expectedResult);
    });
  });

  describe('queryTransactions', function () {
    it('queries for transactions based on provided parameters', function () {
      req.data = {
        transactions: [
          { blockNumber: 1, timeStamp: 2, isError: 0, },
          { blockNumber: 2, timeStamp: 3, isError: 1, },
          { blockNumber: 3, timeStamp: 4, isError: 0, },
          { blockNumber: 14 }
        ],
      };
      req.body = { minTime: 0, maxTime: 3000, isError: 0, };
      let result = api.queryTransactions(req, res, next);
      let expectedResult = [
        { blockNumber: 1, timeStamp: 2, isError: 0 },
      ];
      expect(result.transactions).to.be.deep.equal(expectedResult);
    });
  });

  describe('formatAddressBalances', function () {
    it('returns address balance, date and numTransactions', function () {
      req.data = {
        addresses: [{
          address: '0x1',
          balance: 5,
          date:  new Date('August 25 2018 9:00'),
          transactions: [{
            blockNumber: 1,
          }, {
            blockNumber: 2,
          }
          ],
        }, {
            address: '0x1',
            balance: 4,
            date: new Date('August 28 2018 9:00'),
            transactions: [{
              blockNumber: 1,
            }, {
              blockNumber: 2,
            }, {
              blockNumber: 3,
            }
            ],
          }, {
            address: '0x2',
            balance: 10,
            date:  new Date('October 25 2018 9:00'),
            transactions: [{
              blockNumber: 14,
            },
            ],
        }
        ],
      };
      let result = api.formatAddressBalances(req, res, next);
      let expectedResult = {
        '0x1': {
          balance: 4,
          date: new Date('2018-08-28T13:00:00.000Z'),
          numTransactions: 3
        },
        '0x2': {
          balance: 10,
          date: new Date('2018-10-25T13:00:00.000Z'),
          numTransactions: 1
        }
      };
      expect(result.addressBalances).to.be.deep.equal(expectedResult);
    });
  });
});