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
* Define brand collection
* ---------------------------------------------------------------------------
*/
var brandSchema = new Schema({
    brandName:{type:String,required:true},
    leagueId:{type:String,required:true}

})

/*
* --------------------------------------------------------------------------
* Export the Brand model
* ---------------------------------------------------------------------------
*/
let Brand = mongoose.model('Brand',brandSchema);
module.exports = {
    Brand:Brand
}