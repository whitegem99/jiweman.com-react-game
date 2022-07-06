'use strict';

/*
 * --------------------------------------------------------------------------
 * Include required modules
 * ---------------------------------------------------------------------------
 */
let mongoose = require('mongoose'),
  Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

/*
 * --------------------------------------------------------------------------
 * Define collections collection
 * ---------------------------------------------------------------------------
 */
var collectionSchema = new Schema(
  {
    leagueId: { type: Schema.Types.ObjectId, ref: 'League' },
    walletId: {
      type: Schema.Types.ObjectId,
      ref: 'Wallet',
    },
    collectionType: {
      type: Schema.Types.String,
      enum: ['PAY_LEAGUE_VIA_WALLET_ADD', 'ADD_TO_WALLET'],
    },
    bettingCompanyId: { type: Schema.Types.ObjectId, required: true },
    apiResponse: { type: Object },
    status: { type: String },
    amount: { type: String },
    currency: { type: String },
    phoneNumber: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    collectionId: { type: Number },
  },
  { timestamps: true }
);

/*
 * --------------------------------------------------------------------------
 * Export the collection model
 * ---------------------------------------------------------------------------
 */
collectionSchema.plugin(mongoosePaginate);

let Collection = mongoose.model('collection_data', collectionSchema);
console.log(Collection);
module.exports = {
  Collection: Collection,
};
