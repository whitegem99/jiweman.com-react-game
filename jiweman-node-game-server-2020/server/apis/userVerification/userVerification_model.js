'use strict';
let mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  mongoosePaginate = require('mongoose-paginate');

/*
* --------------------------------------------------------------------------
* Define Stadium collection
* ---------------------------------------------------------------------------
*/
var userVerificationSchema = new Schema([{
  id_type :{type:String},
  id_number:{type:String},
  id_photo:{type:String},
  selfie: {type: String},
  status:{type:String},
  bettingCompanyId: { type: Schema.Types.ObjectId, required: true },
}], { timestamps: true }, { read: 'secondaryPreferred' });



/*
* --------------------------------------------------------------------------
* Paginate the results
* ---------------------------------------------------------------------------
*/

userVerificationSchema.plugin(mongoosePaginate);


let userVerification = mongoose.model('userverification',userVerificationSchema );


module.exports = {
  
  UserVerification: userVerification,
}
