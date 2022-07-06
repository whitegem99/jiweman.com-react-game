'use strict';

/*
* --------------------------------------------------------------------------
* Include required modules
* ---------------------------------------------------------------------------
*/
let mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/*
* --------------------------------------------------------------------------
* Define company collection
* ---------------------------------------------------------------------------
*/
var invoiceSchema = new Schema({
  bettingCompanyName: { type: String, required: true },
  oneOnOneAmount: { type: Number, required: true },
  leagueAmount: { type: Number, required: true },
  serverAmount: { type: Number, required: true },
  extraAmount: { type: Number },
  totalAmount: { type: Number },
  status: {
    type: String,
    required: true,
    enum: ['Generated', 'Active', 'Paid'],
  },
  bettingCompanyId:{type: Schema.Types.ObjectId, required: true },
  startTime: {type: Date, required: true },
  endTime: {type: Date, required: true },

})

/*
* --------------------------------------------------------------------------
* Export the company model
* ---------------------------------------------------------------------------
*/
let invoice = mongoose.model('invoice', invoiceSchema);
module.exports = {
    invoice: invoice
}