/*
* --------------------------------------------------------------------------
* Created by Barquecon Technologies on 26/04/2019 by Dipak Adsul
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
* Define Stadium collection
* ---------------------------------------------------------------------------
*/
var stadiumDocSchema = new Schema([{
  name: { type: String, required: true },
  isActive: {type: Boolean, required: true},
  stadiumLocation:{type: String, required: true},
  status:{type: String, required: true},
  stadiumRentPrize:{type: Number, required: true},
  stadiumRentTime:{type: Number, required: true},
  stadiumDetails:{type: String, required: true}
}], { timestamps: true }, { read: 'secondaryPreferred' });




/*
* --------------------------------------------------------------------------
* Define Player Selected Stadium collection
* ---------------------------------------------------------------------------
*/

var playerStadiumsSchema = new Schema({
  playerId: { type: String },
  stadiumsId: { type: String },
}, { timestamps: true }, { read: 'secondaryPreferred' });


/*
* --------------------------------------------------------------------------
* Paginate the results
* ---------------------------------------------------------------------------
*/

stadiumDocSchema.plugin(mongoosePaginate);
playerStadiumsSchema.plugin(mongoosePaginate);

/*
* --------------------------------------------------------------------------
* Export the Stadium model
* ---------------------------------------------------------------------------
*/

let Gamestadium = mongoose.model('Stadiums', stadiumDocSchema);
let PlayerStadiums = mongoose.model('PlayerStadiums', playerStadiumsSchema)


module.exports = {
  Gamestadium: Gamestadium,
  PlayerStadiums: PlayerStadiums,
}
