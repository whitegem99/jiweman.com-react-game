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
 * Define matchStates collection
 * ---------------------------------------------------------------------------
 */

var matchStatesSchema = new Schema(
    {
        matchId: {
            type: Schema.Types.ObjectId,
            ref: 'Match',
            required: true
        },
        senderId: { type: String, required: true },
        p1Goal: { type: Number, required: true },
        p2Goal: { type: Number, required: true },
        matchDuration: { type: Number, required: true },
        p1Duration: { type: Number, required: true },
        p2Duration: { type: Number, required: true },
        turn: { type: Number, required: true },
        state: { type: Number, required: true }
    }, { timestamps: true }, { read: 'secondaryPreferred' }
)

/*
 * --------------------------------------------------------------------------
 * Export the MatchState model
 * ---------------------------------------------------------------------------
 */

let MatchState = mongoose.model('MatchState', matchStatesSchema);

module.exports = {
    MatchState: MatchState
};

