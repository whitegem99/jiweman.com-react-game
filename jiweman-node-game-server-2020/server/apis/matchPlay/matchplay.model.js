/*
* --------------------------------------------------------------------------
* Created by Barquecon Technologies on 12/03/2019 by Dipak Adsul
* ---------------------------------------------------------------------------
*/

'use strict';

/*
* --------------------------------------------------------------------------
* Include required modules
* ---------------------------------------------------------------------------
*/

let mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  mongoosePaginate = require('mongoose-paginate');

/*
* --------------------------------------------------------------------------
* Define Formations collection
* ---------------------------------------------------------------------------
*/
var matchPlaySchema = new Schema({
  playerId: { type: String, required: true },
  diskId: { type: String, required: true },
  force: { type: Number, required: true },
  aim: { type: Number, required: true },
  time: { type: Number, required: true },
  stamina: { type: Number, required: true }
}, { timestamps: true }, { read: 'secondaryPreferred' });



var matchSchema = new Schema({
  playerOneUserName: { type: String, required: true },
  playerTwoUserName: { type: String, required: true },
  secretID: { type: String, required: false },
  senderId: { type: String, required: false },
  roomName: { type: String, required: true },
  matchStatus: { type: String, required: false, default: 'active' },
  matchType: { type: String, required: true },
  winnerName: { type: String, required: false, default: ''},
  playerOneGoal: { type: String, required: false, default: '0'},
  playerTwoGoal: { type: String, required: false, default: '0'},
  isRematch: { type: Boolean, required: false},
  leagueId: { type: String, required: false},
  oneonone: {type:String,required:false },
  bettingCompanyId: { type: Schema.Types.ObjectId, required: true },
  playerOneMatchDuration: { type: Number, required: false, default: 0 },
  playerTwoMatchDuration: { type: Number, required: false, default: 0 },
  matchDuration:  { type: Number, required: false, default: 0 },
  updatedBysenderId:  { type: String, required: false},
  playerOneAmount:  { type: Number, required: false},
  playerTwoAmount:  { type: Number, required: false},
  // isGameValid: { type: Boolean, required: false }
}, { timestamps: true }, { read: 'secondaryPreferred' });


var matchSchemaCopy = new Schema({
  playerOneUserName: { type: String, required: false },
  playerTwoUserName: { type: String, required: false },
  secretID: { type: String, required: false },
  senderId: { type: String, required: false },
  roomName: { type: String, required: false },
  matchStatus: { type: String, required: false},
  matchType: { type: String, required: false },
  winnerName: { type: String, required: false},
  playerOneGoal: { type: String, required: false},
  playerTwoGoal: { type: String, required: false},
  isRematch: { type: Boolean, required: false},
  leagueId: { type: String, required: false},
  oneonone: {type:String,required:false },
  bettingCompanyId: { type: Schema.Types.ObjectId, required: false },
  playerOneMatchDuration: { type: Number, required: false},
  playerTwoMatchDuration: { type: Number, required: false},
  matchDuration:  { type: Number, required: false},
  updatedBysenderId:  { type: String, required: false},
  // isGameValid: { type: Boolean, required: false }
}, { timestamps: true }, { read: 'secondaryPreferred' });
/* --------------------------------------------------------------------------
* Paginate the results
* ---------------------------------------------------------------------------
*/
matchPlaySchema.plugin(mongoosePaginate);
/*
* --------------------------------------------------------------------------
* Export the MatchPlay model
* ---------------------------------------------------------------------------
*/
let MatchPlay = mongoose.model('MatchPlay', matchPlaySchema);
let Match = mongoose.model('Match', matchSchema);
let MatchDataCopy = mongoose.model('MatchDataCopy',matchSchemaCopy);

module.exports = {
  MatchDataCopy: MatchDataCopy,
  MatchPlay: MatchPlay,
  Match: Match,
}