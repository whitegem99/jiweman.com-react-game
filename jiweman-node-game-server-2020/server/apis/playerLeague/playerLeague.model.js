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
 * Define league playerLeague
 * ---------------------------------------------------------------------------
 */
var playerLeagueSchema = new Schema(
  {
    leagueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'League',
      require: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    ticket: { type: String, require: true, unique: true },
    ticketFlag: { type: Boolean, default: false },
    // collectionId:{type:Number},
    wallet_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Wallet',
      require: true,
    },
    totalAllowed: { type: Number },
    remaining: { type: Number },
    jiwemanCommision:{type:Number},
    bettingCompanyId: { type: Schema.Types.ObjectId},
  },
  { timestamps: true }
);

/*
 * --------------------------------------------------------------------------
 * Export the League model
 * ---------------------------------------------------------------------------
 */
let playerLeague = mongoose.model('playerleague', playerLeagueSchema);
module.exports = {
  playerLeague: playerLeague,
};
