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
 * Define the MongoDB for the Friends collection
 * ---------------------------------------------------------------------------
 */
var FriendsSchema = new mongoose.Schema({
    FriendUserName: { type: String, required: true},
    loggedInUserName: { type: String, required: true },
    email: { type: String, required: true },
    socialId: { type: String, required: false },
    userId: { type: String, required: false },
    deviceToken: { type: String, required: false },
    gender: { type: String, required: false },
    roleId: { type: Schema.Types.ObjectId, required: false },
    roleName: { type: String },
}, { timestamps: true }, { read: 'secondaryPreferred' });


/*
 * --------------------------------------------------------------------------
 * Temp Challenge Friends collection
 * ---------------------------------------------------------------------------
 */
var TempChallengeSchema = new mongoose.Schema({
    challengerUserName: { type: String, required: true},
    challengingUserName: { type: String, required: true },
    challengeStatus: { type: String, required: true }
}, { timestamps: true }, { read: 'secondaryPreferred' });

/*
 * --------------------------------------------------------------------------
 * Paginate the results
 * ---------------------------------------------------------------------------
 */

FriendsSchema.plugin(mongoosePaginate);


/*
 * --------------------------------------------------------------------------
 * Export the  model
 * ---------------------------------------------------------------------------
 */

let Friends = mongoose.model('Friends', FriendsSchema);
let Challenge = mongoose.model('TempChallenge', TempChallengeSchema);


module.exports = {
    Friends: Friends,
    Challenge: Challenge
}