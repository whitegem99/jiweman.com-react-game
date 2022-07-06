'use strict';

/*
 * --------------------------------------------------------------------------
 * Include required modules
 * ---------------------------------------------------------------------------
 */
const mongoosePaginate = require('mongoose-paginate');
let mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var OneOnOneSchema = new Schema(
  {
    gameName: { type: String, required: true },
    brandId: { type: String, required: false },
    gameInfo: [{ type: String, required: false }],
    status: {
      type: String,
      required: false,
      enum: ['active', 'ended'],
    },
    betType: {
      type: String,
      required: false,
      enum: ['1vs1', 'pwf'],
    },
    startDate: { type: Date, required: false },
    endDate: { type: Date, required: false },
    jiwemanCommision:{type:Number},
    bettingCompanyCommission:{type:Number},
    // bettingCurrency:{type:String,required:false},
    jiwemanCommisionPercentage: { type: Number },
    bettingCompanyCommisionPercentage: { type: Number },
    stakeAmount:{ type: Number, required: true },
    salesTax: { type: Number },
    winningTax: { type: Number },
    taxOnStakeOfBet: { type: Number },
    entryFee: { type: Number, required: true },
    origianlEntryFee: { type: Number },
    taxOnGrossSale: { type: Number },
    taxOnBettingStake: { type: Number },
    gameplayWinningsAmountToBeWonPerBet: { type: Number },
    numberOfGoalsToWin: { type: Number, required: false },
    gameCount: { type: Number, required: true },
    winningAmountToBePaid: { type: Number },
    currencyConversionRisk: { type: Number, default: 0 },
    cardImage:{type:String,required:true},
    allowedCountries: [{ type: String }],
    prize: [],
    gameRegionType: {
      type: String,
      enum: ['local', 'international'],
    },
    gameCurrency: { type: String },
    type_of_business:{
      type:String,
      enum:['business_first','customer_first']
    },
    bettingCompanyId: { type: Schema.Types.ObjectId, required: true }
  },
  { timestamps: true }
);

OneOnOneSchema.plugin(mongoosePaginate);

let OneOnOne = mongoose.model('oneonone', OneOnOneSchema);

var OneOnOneDataSchema = new Schema(
  {
    winnerName: { type: String},
    playerOneGoal: { type: String},
    playerTwoGoal: { type: String},
    roomName: { type: String},
    playerOneUserName: { type: String},
    playerTwoUserName: { type: String},
    matchType: { type: String},
    playerOneMatchDuration: { type: Number},
    playerTwoMatchDuration: { type: Number},
    matchDuration: { type: Number},
    matchId: { type: String},
    oneonone: { type: String},
    isGameValid: { type: Boolean},
    senderId: { type: String},
    secretID: { type: String},
    matchStatus: { type: String }
  },
  { timestamps: true }
);

let OneOnOneData = mongoose.model('oneononedata', OneOnOneDataSchema);

module.exports = {
  OneOnOne: OneOnOne,
  OneOnOneData: OneOnOneData,
};