'use strict';

/*
 * --------------------------------------------------------------------------
 * Include required modules
 * ---------------------------------------------------------------------------
 */
const mongoosePaginate = require('mongoose-paginate');
let mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/*
 * --------------------------------------------------------------------------
 * Define league collection
 * ---------------------------------------------------------------------------
 */
var leagueSchema = new Schema(
  {
    leagueName: { type: String, required: true },
    brandId: { type: String, required: true },
    leagueType: { type: String, required: false },
    startDate: { type: Date, required: false },
    endDate: { type: Date, required: true },
    // startTime: { type: Date, required:false },
    // endTime: { type: Date, required:false },
    prize: [],
    numberOfPrizes: { type: Number, required: true },
    leagueCardImageUrl: { type: String, required: true },
    leagueInfo: [{ type: String, required: false }],
    leagueStatus: {
      type: String,
      required: false,
      enum: ['active', 'upcoming', 'closed', 'ended'],
    },
    gameCount: { type: Number, required: true },
    entryFee: { type: Number, required: true },
    numberOfGoalsToWin: { type: Number, required: false },
    startSaleDate: { type: Date },
    endSaleDate: { type: Date },
    // imageId: { type: String },
    leagueMessage: { type: String },
    // prizeCommissionPercentage: { type: Number, default: 30 },
    prizeDistributionType: {
      type: String,
      enum: ['fixed', 'variable', 'hybrid'],
    },
    type_of_business:{
      type:String,
      enum:['business_first','customer_first']
    },
    jiwemanCommisionPercentage: { type: Number },
    currencyConversionRisk: { type: Number, default: 0 },
    prizePoolPercentage: { type: Number },
    allowedCountries: [{ type: String }],
    sponsorPrizeAmount: { type: Number },
    // prizeDistributionPercentages: [],
    prizepoolAmount: { type: Number },
    lastPrizeEvaluated: { type: Boolean, default: false },
    gameRegionType: {
      type: String,
      enum: ['local', 'international'],
    },
    gameCurrency: { type: String },
    prizePercentage: { type: String },
    minimumReward: { type: Number },
    bettingCompanyId: { type: Schema.Types.ObjectId, required: true },
    //amountToBeInvolvedInGamePlay:{ type: Number, required: true },
    bettingCompanyCommisionPercentage: { type: Number },
    stakeAmount:{ type: Number, required: true },
    salesTax: { type: Number },
    winningTax: { type: Number },
    taxOnStakeOfBet: { type: Number },
    jiwemanCommision:{type:Number},
    bettingCompanyCommission:{type:Number},
    taxOnGrossSale:{type:Number},
    taxOnBettingStake:{type:Number},
    gameplayWinningsAmountToBeWonPerBet:{type:Number}
  },
  { timestamps: true }
);

/*
 * --------------------------------------------------------------------------
 * Define Processed League Winner Scema
 * ---------------------------------------------------------------------------
 */
var leagueWinnerSchema = new Schema(
  {
    leaderboard: {
      type: Schema.Types.ObjectId,
      ref: 'LeaderBoard',
      required: true,
    },
    league: { type: Schema.Types.ObjectId, ref: 'League', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    leagueWinnerPosition: { type: Number, required: true },
    amount: { type: Number, required: true },
    hasClaimed: { type: Boolean, default: false, required: true },
    state: { type: String, default: 'created', required: true },
    paymentResponse: { type: Object },
    bettingCompanyId: { type: Schema.Types.ObjectId, required: true },
    // More should come for the user to claim
  },
  { timestamps: true }
);

leagueWinnerSchema.plugin(mongoosePaginate);

/*
 * --------------------------------------------------------------------------
 * Export the League model
 * ---------------------------------------------------------------------------
 */

var prizePercentagesSchema = new Schema(
  {
    position: { type: Number, unique: true },
    allocation: [],
  },
  { timestamps: true }
);

var currencydataSchema = new Schema(
  {
    id: { type: Number, unique: true },
    name:{ type: String },
    code:{ type: String },
    country: { type: Object },
    usd_rate:{ type: Number },
  },
  { timestamps: false }
);

let League = mongoose.model('League', leagueSchema);
let LeagueWinners = mongoose.model('LeagueWinners', leagueWinnerSchema);
let prizePercentages = mongoose.model(
  'prizePercentages',
  prizePercentagesSchema
);
let currencydata = mongoose.model(
  'currencydata',
  currencydataSchema,
  'currencydata'
);

module.exports = {
  League: League,
  LeagueWinners: LeagueWinners,
  prizePercentages: prizePercentages,
  currencydata: currencydata,
};
