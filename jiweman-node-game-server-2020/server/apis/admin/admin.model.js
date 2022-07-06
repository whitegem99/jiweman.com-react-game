'use strict';

/*
* --------------------------------------------------------------------------
* Include required modules
* ---------------------------------------------------------------------------
*/
let mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    // mongoosePaginate = require('mongoose-paginate'),
    bcrypt = require('bcryptjs');

/*
* --------------------------------------------------------------------------
* Define admin collection
* ---------------------------------------------------------------------------
*/
var adminSchema = new Schema({
    email: { type: String, required: true },
    userName:{type:String,required:true},
    password:{type:String,required:true, select: false},
    resetPassword: {
      initiated: { type: Boolean },
      token: { type: String },
      expiresOn: { type: Date }
  },
  roleName:{type:String},
  roleId: { type: Schema.Types.ObjectId, required: false },
  accountType: { type: String },
  countryId: { type: String, required: false },
  socialId: { type: String, required: false },
  deviceToken: { type: String, required: false },
  gender: { type: String, required: false },
  token:{type:String},
  isSuperAdmin: {type: Boolean, required: true},
  isActive: {type: Boolean, required:true},
  bettingCompanyId: { type: Schema.Types.ObjectId, required: true }

}, {timestamps:true})

/*
 * --------------------------------------------------------------------------
 * Encrypt and store the admin's password
 * ---------------------------------------------------------------------------
 */

adminSchema.pre('save', function(next) {
  let admin = this;
  if (!admin.isModified('password')) {
      return next();
  }
  bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(admin.password, salt, function(err, hash) {
          admin.password = hash;
          next();
      });
  });
});

/*
* --------------------------------------------------------------------------
* Confirm a admin's password against the stored password
* ---------------------------------------------------------------------------
*/

adminSchema.methods.comparePassword = function(password, done) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
      done(err, isMatch);
  });
};

/*
* --------------------------------------------------------------------------
* Export the Admin model
* ---------------------------------------------------------------------------
*/
let Admin = mongoose.model('Admin',adminSchema);
module.exports = {
    Admin:Admin
}
