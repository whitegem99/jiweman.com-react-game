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
 * Define playerBet
 * ---------------------------------------------------------------------------
 */
var playerBetSchema = new Schema(
  {
    gameId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'oneonone',
      require: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
 //   ticket: { type: String, require: true, unique: true },
    ticketFlag: { type: Boolean, default: false },
    // collectionId:{type:Number},
    wallet_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Wallet',
      require: true,
    },
    totalAllowed: { type: Number },
    remaining: { type: Number },
    win:{type:Number,default:0},
    loss:{type:Number,default:0},
    jiwemanCommision:{type:Number},
    bettingCompanyId: { type: Schema.Types.ObjectId},
    freeBets: { type: Number, default: 0 }
  },
  { timestamps: true }
);

/*
 * --------------------------------------------------------------------------
 * Export the model
 * ---------------------------------------------------------------------------
 */
let playerBet = mongoose.model('playerBet', playerBetSchema);
module.exports = {
    playerBet: playerBet,
};
