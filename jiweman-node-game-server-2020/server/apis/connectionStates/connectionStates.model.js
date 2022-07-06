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
 * Define connectionState collection
 * ---------------------------------------------------------------------------
 */

var conectionStatesSchema = new Schema(
    {
        matchId: {
            type: Schema.Types.ObjectId,
            ref: 'Match',
            required: true
        },
        senderId: { type: String, required: true },
        state: { type: Number, required: true },
    }, { timestamps: true }, { read: 'secondaryPreferred' }
)

/*
 * --------------------------------------------------------------------------
 * Export the connectionState model
 * ---------------------------------------------------------------------------
 */

let ConnectionState = mongoose.model('ConnectionState', conectionStatesSchema);

module.exports = {
    ConnectionState: ConnectionState
};

