'use strict';

/*
 * --------------------------------------------------------------------------
 * Include required modules
 * ---------------------------------------------------------------------------
 */
let mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  // mongoosePaginate = require('mongoose-paginate'),
  bcrypt = require('bcryptjs');

/*
 * --------------------------------------------------------------------------
 * Define admin collection
 * ---------------------------------------------------------------------------
 */
var downloadSchema = new Schema(
  {
    totalDownload: { type: Number, required: true },
  },
  { timestamps: true }
);

var statisticsSchema = new Schema({},  { timestamps: true, strict: false });

/*
 * --------------------------------------------------------------------------
 * Export the Admin model
 * ---------------------------------------------------------------------------
 */
let Download = mongoose.model('Download', downloadSchema);
let Statistics = mongoose.model('Statistics', statisticsSchema);
module.exports = {
  Download: Download,
  Statistics,
};
