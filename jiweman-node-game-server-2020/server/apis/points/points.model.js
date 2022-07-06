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
* Define points collection
* ---------------------------------------------------------------------------
*/
var pointsSchema = new Schema({
    played: {type:Number},
    win:{type:Number},
    loss:{type:Number},
    goalFor:{type:Number},
    goalAgainst:{type:Number},
    cleanSheet:{type:Number},
    goalDifference:{type:Number}
})

/*
* --------------------------------------------------------------------------
* Export the Point model
* ---------------------------------------------------------------------------
*/
let Point = mongoose.model('Point',pointsSchema);
module.exports = {
    Point:Point
}

