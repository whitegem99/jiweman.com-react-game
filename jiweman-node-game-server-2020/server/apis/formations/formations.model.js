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
var formationsSchema = new Schema({
    formationName: { type: String, required: true },
    formationType: { type: String, required: true },
    indexNumber: { type: Number, required: true },
    points: { type: Number, required: true },
    disks: [{ diskName: String, X: String, Y: String, Z: String }],
    uiDisks: [{ uidiskName: String, X: String, Y: String, Z: String }]
}, { timestamps: true }, { read: 'secondaryPreferred' });



/*
 * --------------------------------------------------------------------------
 * Define Player Selected Formations collection
 * ---------------------------------------------------------------------------
 */

var playerformationsSchema = new Schema({
    playerId: { type: String },
    formationId: { type: String },
}, { timestamps: true }, { read: 'secondaryPreferred' });


/*
 * --------------------------------------------------------------------------
 * Paginate the results
 * ---------------------------------------------------------------------------
 */

formationsSchema.plugin(mongoosePaginate);
playerformationsSchema.plugin(mongoosePaginate);

/*
 * --------------------------------------------------------------------------
 * Export the Fromation model
 * ---------------------------------------------------------------------------
 */

let Formation = mongoose.model('Formation', formationsSchema);
let PlayerFormation = mongoose.model('playerformation', playerformationsSchema);

module.exports = {
    Formation: Formation,
    PlayerFormation: PlayerFormation
}