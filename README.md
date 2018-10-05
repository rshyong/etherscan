# Etherscan

## Overview

This app creates a server that stands up 3 different endpoints:

### /api/queryEtherscan
Makes a request to the Etherscan api with an Ethereum address as an input and stores the associated transactions and balance in mongodb.

### /api/getTransactions
Returns a list of transactions that matches provided parameters on req.body. Accepted parameters include:

  - minTime and maxTime: Returns transactions with dates that fall within the provided timestamp (in milliseconds).
  - minGasPrice and maxGasPrice: Returns transactions with gas prices that fall within the provided range.
  - from: Returns transactions originating from provided address.
  - to: Returns transactions going to provided address.
  - isError: Returns transactions that are Pass/Error. Input '0' for Pass, '1' for Error.

### /api/getAddressBalances
Returns stored address balances by ETH address. Also includes date pulled from Etherscan as well as numTransactions.

## JSDocs
[Link to JSDocs](https://rshyong.github.io/etherscan/)

## Usage

To start the app, make sure an instance of mongodb is running, and then run:

```npm start```

## Curl Examples

To make a curl request to /api/queryEtherscan:

```curl -i -H "Content-Type: application/json" -X POST -d '{"address":"0xB8196f7A39D4886321082BbB113be23D8a0eE9c8"}' http://localhost:3000/api/queryEtherscan```

To make a curl request to /api/getTransactions with search parameters:

```curl -i -H "Content-Type: application/json" -X POST -d '{"minGasPrice":"4000000000", "maxGasPrice":"5000000000"}' http://localhost:3000/api/getTransactions```

To make a curl request to /api/getAddressBalances:

```curl -i -X POST  http://localhost:3000/api/getAddressBalances```

## Testing the App

To test the app, run:

```npm test```

#### Powered by Etherscan.io APIs