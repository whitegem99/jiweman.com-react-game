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
var companySchema = new Schema({
  name: { type: String, required: true },
  country: { type: String, required: true },
  apiToken: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: ['Initiated', 'Active', 'Inactive'],
  },
  referralSetting:[{type:Object}],
  lastTimeInvoiceGenerated: {type: Date, default: new Date()}

},
{ timestamps: true }
)

/*
* --------------------------------------------------------------------------
* Export the company model
* ---------------------------------------------------------------------------
*/
let bettingCompany = mongoose.model('bettingCompany', companySchema);
module.exports = {
  bettingCompany: bettingCompany
}