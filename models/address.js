'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const schema = new mongoose.Schema({
  id: ObjectId,
  date: Date,
  address: String,
  transactions: [Schema.Types.Mixed, ],
  balance: Number,
});
 
module.exports = schema;