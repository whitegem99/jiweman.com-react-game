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
 * Define leaderBoard collection
 * ---------------------------------------------------------------------------
 */
var leaderBoardSchema = new Schema({
  leagueId: { type: String, required: false },
  ticket: { type: String, require: false },
  gameId:{type:String,require:false},
  matchId:{type:String,require:false},
  leagueRound: { type: Number, required: false },
  gameType: { type: String, required: true },
  playerName: { type: String, required: true },
  matchesPlayed: { type: Number, required: true },
  win: { type: Number, required: true },
  loss: { type: Number, required: true },
  goalFor: { type: Number, required: true, default: '0' },
  goalAgainst: { type: Number, required: true, default: '0' },
  goalDiff: { type: Number, required: true, default: '0' },
  cleanSheet: { type: Number, required: true },
  winPoints: { type: Number, required: true, default: '0' },
  lossPoints: { type: Number, required: true, default: '0' },
  cSpoints: { type: Number, required: true, default: '0' },
  GFpts: { type: Number, required: true, default: '0' },
  GApts: { type: Number, required: true, default: '0' },
  GPpts: { type: Number, required: true, default: '0' },
  GDpts: { type: Number, required: true, default: '0' },
  points: { type: Number, required: false, default: '0' },
  currentWinStreak: { type: Number, required: false, default: '0' },
  highestWinStreak: { type: Number, required: false, default: '0' },
  prize: [{ type: String, required: false, default: '0' }],
  prizeStatus: { type: String, default: 'notpaid', required: false },
  // durationInSeconds : { type: Number, required: false, default: '0' },
  pointsPerMinute: { type: Number, required: false, default: '0' },
  avgPointsPerMinute:{ type: Number, required: false, default: '0' },
  bettingCompanyId: { type: Schema.Types.ObjectId, required: false },
  secretID: { type: String, required: false },
  senderId: { type: String, required: false }
}, { timestamps: true });

/*
 * --------------------------------------------------------------------------
 * Export the leaderBoard model
 * ---------------------------------------------------------------------------
 */
let LeaderBoard = mongoose.model('LeaderBoard', leaderBoardSchema);
module.exports = {
  LeaderBoard: LeaderBoard,
};
