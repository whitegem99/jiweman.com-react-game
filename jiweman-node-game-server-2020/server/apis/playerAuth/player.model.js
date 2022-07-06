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
 * Define the MongoDB for the roles collection
 * ---------------------------------------------------------------------------
 */
var roleSchema = new mongoose.Schema(
  {
    roleName: { type: String, required: true, unique: true },
  },
  { timestamps: true },
  { read: 'secondaryPreferred' }
);

/*
 * --------------------------------------------------------------------------
 * Define Players collection
 * ---------------------------------------------------------------------------
 */
var playerSchema = new Schema(
  {
    fullName: { type: String, required: false },
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String },
    password: { type: String, required: true, select: false },
    resetPassword: {
      initiated: { type: Boolean },
      token: { type: String },
      expiresOn: { type: Date },
    },
    countryOfRecidence: { type: String },
    dateOfBirth: { type: Date, required: false },
    gender: { type: String, required: false },
    roleId: { type: Schema.Types.ObjectId, required: false },
    roleName: { type: String },
    accountType: { type: String },
    deviceToken: { type: String, required: false },
    mainDeviceToken: { type: String, required: false },
    registrationStatus: { type: String, required: false, default: 'pending' },
    verificationToken: { type: String, required: false },
    age: { type: Number, required: false },
    balance: {
      type: Number,
      min: 0,
      default: 0,
    },
    verificationId: { type: Schema.Types.ObjectId, ref: 'userverification' },
    userCurrency: { type: String },
    // mobileNumberVerification: { type: Boolean },
    // otp: { type: Number },
    // securityCode: { type: String, required: true, unique: true }
    // playerCurrentHomeTown: { type: String },
    // countryId: { type: String, required: false },
    // socialId: { type: String, required: false },
    //  countryOfBirth: { type: String },
    // playerWhatsUpNumber: { type: Number, required: true },
    // playerMobileMonenyNumber: { type: Number, required: true },
    // playerNationalIdNumber: { type: String, required: true },
    // foodPrefrences: [],
    // beveragePrefrences: [],
    // snackPrefrences: [],
    // moviePrefrences: [],
    token: { type: String },
    webToken: { type: String },
    isUserBanned: { type: Boolean, default: false, required: false },
    banReason: {
      type: String,
      required: false,
      default: ""
    },
    warnCount: { type: Number, required: false, default: 0},
    warnReasons: { type: [String], required: false, default:[]},
    bettingCompanyId: { type: Schema.Types.ObjectId, required: true,ref:'bettingCompany' },
    referCode:{type:String},
    referBy:{type:String}
  },
  { timestamps: true },
  { read: 'secondaryPreferred' }
);

/*
 * --------------------------------------------------------------------------
 * Players game related stat and all the game related associated data
 * ---------------------------------------------------------------------------
 */
var playerGameSchema = new mongoose.Schema(
  {
    playerId: { type: String, required: false },
    userName: { type: String, required: true },
    formationId: { type: String },
    formationName: { type: String },
    entryFee: { type: String },
    indexNumber: { type: Number },
    disks: [
      {
        diskName: String,
        X: String,
        Y: String,
        Z: String,
        diskType: String,
        isCaptain: Boolean,
        force: Number,
        aim: Number,
        time: Number,
      },
    ],

    coins: { type: Number, required: false },
  },
  { timestamps: true },
  { read: 'secondaryPreferred' }
);

var mobileVerificationSchema = new mongoose.Schema(
  {
    userId: { type: Object },
    mobileNumber: { type: Number },
    otp: { type: String },
    email: { type: String },
    varify: { type: Boolean, default: false },
  },
  { timestamps: true },
  { read: 'secondaryPreferred' }
);

/*
 * --------------------------------------------------------------------------
 * Define Country collection
 * ---------------------------------------------------------------------------
 */

var countrySchema = new mongoose.Schema(
  {
    country_code: { type: String, required: false },
    country_name: { type: String, required: false },
  },
  { timestamps: true },
  { read: 'secondaryPreferred' }
);

/*
 * --------------------------------------------------------------------------
 * Paginate the results
 * ---------------------------------------------------------------------------
 */

playerSchema.plugin(mongoosePaginate);
playerGameSchema.plugin(mongoosePaginate);
countrySchema.plugin(mongoosePaginate);

/*
 * --------------------------------------------------------------------------
 * Encypt and store the player's password
 * ---------------------------------------------------------------------------
 */

playerSchema.pre('save', function (next) {
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

playerSchema.methods.comparePassword = function (password, done) {
  bcrypt.compare(password, this.password, function (err, isMatch) {
    done(err, isMatch);
  });
};

/*
 * --------------------------------------------------------------------------
 * Export the Person model
 * ---------------------------------------------------------------------------
 */

let Player = mongoose.model('User', playerSchema);
let Role = mongoose.model('Role', roleSchema);
let PlayerGameData = mongoose.model('PlayerGameData', playerGameSchema);
let country = mongoose.model('country', countrySchema);
let MobileVerification = mongoose.model(
  'mobileverification',
  mobileVerificationSchema
);

module.exports = {
  Role: Role,
  Player: Player,
  PlayerGameData: PlayerGameData,
  country: country,
  MobileVerification: MobileVerification,
};
