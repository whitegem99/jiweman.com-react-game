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
  mongoosePaginate = require('mongoose-paginate'),
  bcrypt = require('bcryptjs');

/*
* --------------------------------------------------------------------------
* Define Betting Company collection
* ---------------------------------------------------------------------------
*/
var bettingCompanySchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true,select:false },
  roleId: { type: Schema.Types.ObjectId, required: false},
  roleName: { type: String },
}, { timestamps: true }, { read: 'secondaryPreferred' });

/*
* --------------------------------------------------------------------------
* Paginate the results
* ---------------------------------------------------------------------------
*/

bettingCompanySchema.plugin(mongoosePaginate);


/*
* --------------------------------------------------------------------------
* Encypt and store the player's password
* ---------------------------------------------------------------------------
*/

bettingCompanySchema.pre('save', function (next) {
  let player = this;
  if (!player.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(player.password, salt, function (err, hash) {
      player.password = hash;
      next();
    });
  });
});

/*
* --------------------------------------------------------------------------
* Confirm a player's password against the stored password
* ---------------------------------------------------------------------------
*/

bettingCompanySchema.methods.comparePassword = function (password, done) {
  bcrypt.compare(password, this.password, function (err, isMatch) {
    done(err, isMatch);
  });
};

/*
* --------------------------------------------------------------------------
* Export the Betting Company model
* ---------------------------------------------------------------------------
*/

let BettingCompany = mongoose.model('BettingCompany', bettingCompanySchema);

module.exports = {
  BettingCompany: BettingCompany
}
