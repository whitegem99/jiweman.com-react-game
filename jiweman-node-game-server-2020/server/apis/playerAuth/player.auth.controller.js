/*
 * --------------------------------------------------------------------------
 * Created by Barquecon Technologies on 12/03/2019 by Dipak Adsul
 * ---------------------------------------------------------------------------
 */
let func = require('../common/commonfunction');
let sendResponse = require('../common/sendresponse');
let logger = require('../../logger/log');
let Player = require('./player.model').Player;
let Role = require('./player.model').Role;
let PlayerGameData = require('./player.model').PlayerGameData;
var randomize = require('randomatic');
var fs = require('fs');
var path = require('path');
const crypto = require('crypto');
const axios = require('axios').default;
const _ = require('lodash');
const { League, LeagueWinners } = require('../league/league.model');
let Collection = require('../paymentAPIs/collections/collections.model')
  .Collection;
let playerLeague = require('../playerLeague/playerLeague.model').playerLeague;
let MobileVerification = require('./player.model').MobileVerification;
const bettingCompany = require('../bettingCompany/bettingCompany.model').bettingCompany;

let config = require('../../config');
const { SSL_OP_SINGLE_ECDH_USE } = require('constants');
const {
  updateWalletBalance,
  updateWalletStatus,
  creditToWallet,
} = require('../paymentAPIs/wallet/wallet.service');

let moment = require('moment');
// Require the controllers WHICH WE DID NOT CREATE YET!!

/*
 * --------------------------------------------------------------------------
 * Register with Jiweman Api start
 * ---------------------------------------------------------------------------
 */
exports.registerWithJieman = async function (req, res, next) {
  let userData = req.body;
  const normal = 'normal';
  let allowedCountries = func.allowedCountries;
  userData.roleName = 'player';
  var getReferName='';
  let getReward;
  req.check('password', 'Password is required field!').notEmpty();
  req.check('email', 'Email is required field!').notEmpty();
  // req.check('mobile','Mobile is required field!').notEmpty();

  // req.check('securityCode', 'Security Code is required field!').notEmpty();
  // req.check('mainDeviceToken', 'mainDeviceToken is required field!').notEmpty();
  let registeredId;
  var self = this;
  const foundCountry = allowedCountries.filter((ob) => {
    return ob.name === userData.countryOfRecidence;
  });

  if (_.isEmpty(foundCountry)) {
    return res.status(400).send({
      message: `${userData.countryOfRecidence} country is not allowed`,
      status: false,
    });
  }

  // if (!userData.bettingCompanyId) {
  //   return res.status(400).send({
  //     message: `Betting comapny is required`,
  //     status: false,
  //   });
  // }

  let errors = await req.validationErrors();
  if (errors) {
    console.log('errors', errors);
    return res
      .status(400)
      .send({ message: func.manageValidationMessages(errors), status: false });
  }
  try {
    Role.findOne(
      {
        roleName: userData.roleName,
      },
      async function (err, data) {
        if (err) {
          let msg = '';
          localStorage.send(msg, res);
        } else {
          if (userData.dateOfBirth != '' && userData.dateOfBirth != undefined) {
            var dateOfBirth = func.stringToDate(userData.dateOfBirth);
          }
          var presentAge = func.getAge(dateOfBirth);
          // Create a verification token for this user
          var verificationToken = crypto.randomBytes(16).toString('hex');

          const player = new Player();

          const otp = generateOTP();

          // player.registrationStatus = "pending";
          player.verificationToken = verificationToken;
          player.userName = userData.userName;
          player.fullName = userData.fullName;
          player.email = userData.email;
          player.mobile = userData.mobile;
          player.password = userData.password;
          confirmPassword = userData.confirmPassword;
          player.countryOfRecidence = userData.countryOfRecidence;
          player.dateOfBirth = dateOfBirth;
          player.gender = userData.gender;
          player.roleId = data._id;
          player.accountType = normal;
          player.age = presentAge;
          player.userCurrency = foundCountry[0].currency
          // (player.otp = otp),
          // (player.mobileNumberVerification = false),
          player.mainDeviceToken = userData.mainDeviceToken;

          let company = await bettingCompany.findOne({country: userData.countryOfRecidence, status: "Active"}).lean();

          // fallback to Jiweman if there is not company for selected country
          if(!company){
            company = await bettingCompany.findOne({name: "jiweman", status: "Active"}).lean();
          }

          if (!company) {
            return res.status(400).send({
              message: `We do not have betting company at the moment. Please try after sometime.`,
              status: false,
            });
          }

          player.bettingCompanyId = company._id;
          // player.securityCode = userData.securityCode;
          var getReferName;
          if(userData.referCode){
             getReferName = await Player.findOne({referCode:userData.referCode},{userName:1,bettingCompanyId:1});
            console.log("referCode")
             console.log(userData)

             if(getReferName){
              player.referBy =getReferName.userName;
             }
             else{
             return res.status(200).send({
                message: 'invalid referal code',
                status: false,
              });
             }
    
          }

         
          Player.find(
            {
              email: userData.email,
            },
            function (err, docs) {
              if (docs.length) {
                res.status(200).send({
                  message: 'This email id is already registered',
                  status: false,
                });
              } else {
                Player.find(
                  {
                    userName: userData.userName,
                  },
                  function (err, docs) {
                    console.log('docs', docs);
                    if (docs.length) {
                      res.status(200).send({
                        message: 'This username is already taken',
                        status: false,
                      });
                    } else if (presentAge >= 18) {
                      if (confirmPassword === userData.password) {
                        player.save().then(async function (data, err) {
                          console.log(data);
                          if (err) {
                            console.log(err);
                            let msg = 'some error occurred';

                            sendResponse.sendErrorMessage(msg, res);
                          } else {
                            //send reset password link to user
                            func.sendAccountVerificationMail(player);
                            //uncomment while adding mobile verification
                            //send mobile verification SMS on entered mobile number
                            // func.sendMobileVerificationSMS(player);

                            if(userData.referCode){
                              // update ReferBy
                              console.log("in reward 164")
                              var getEvents = await bettingCompany.findOne({_id:player.bettingCompanyId}).lean();
                              console.log("betting data.....")
                              console.log(getEvents)

                              if(getEvents.referralSetting){
                                let event = _.find(getEvents.referralSetting,{event:'signin'});
                                console.log(">>>>>>>>>>>>> event")
                                console.log(event);
                                if(event){
                                  let payload ={bettingCompanyId:getEvents._id,sub:data._id,player:data};
                                  getReward =  await func.rewardFriend(payload,'signin')
                                }
                                else{
                                  console.log("no betting event found....")
                                }
                              }else{
                                console.log("no event settings found")
                              }
                            }
                            else{
                              console.log("no refer code found...")
                            }

                            data = JSON.parse(JSON.stringify(data));

                            delete data.otp;

                            res.send({
                              status: 200,
                              message:
                                'Registered Successfully...Now please check your ' +
                                player.email +
                                ' to activate your account',
                              data: data,
                              reward:getReward
                            });

                            // sendResponse.sendSuccessData(data, res);
                          }
                        });
                      } else {
                        return res.status(400).send({
                          message: 'Password and confirm password must be same',
                          status: false,
                        });
                      }
                    } else {
                      return res.status(400).send({
                        message: 'Age must be greater than or equal to 18',
                        status: false,
                      });
                    }
                  }
                );
              }
            }
          );
        }
      }
    );
  } catch (error) {
    return console.log(error);
  }
};

/*
 * --------------------------------------------------------------------------
 * verifyMobile
 * ---------------------------------------------------------------------------
 */
exports.verifyMobile = async function (req, res, next) {
  let userData = req.body;

  req.check('otp', 'otp is required field!').notEmpty();
  req.check('mobile', 'Mobile is required field!').notEmpty();

  Player.findOne(
    {
      mobile: userData.mobile,
    },
    function (err, data) {
      if (data && data.otp === userData.otp) {
        Player.findOneAndUpdate(
          {
            mobile: userData.mobile,
            mobileNumberVerification: false,
          },
          {
            mobileNumberVerification: true,
          },
          function (err, result) {
            if (result) {
              res.json({
                status: true,
                message: 'Mobile number verified Successfully.',
              });
            } else if (err) {
              console.log(err);
              msg = 'Some Error Occurred';
              sendResponse.sendErrorMessage(err, res);
            }
          }
        );
      } else {
        return res.status(400).send({
          status: false,
          message: 'Wrong OTP. Please try again.',
        });
      }
    }
  );
};

/*
 * --------------------------------------------------------------------------
 * Activate Jiweman Account Api start
 * ---------------------------------------------------------------------------
 */

exports.activateAccount = (req, res) => {
  var email = req.query.email;
  var verificationToken = req.query.verificationToken;
  if (!email || !verificationToken) {
    return res.status(400).send({ message: 'Bad Request', status: false });
  }

  Player.findOne(
    {
      email: email,
    },
    (err, userFound) => {
      if (err) {
        return res.status(400).send({
          message: 'You have not registered yet please register first.',
          status: false,
        });
      } else {
        if (userFound == null || undefined) {
          logger.info('Please enter valid email');
          return res
            .status(400)
            .send({ message: 'Please enter valid email', status: false });
        } else {
          if (
            userFound.registrationStatus == 'pending' &&
            userFound.verificationToken == verificationToken
          ) {
            Player.findOneAndUpdate(
              {
                email: email,
                verificationToken: verificationToken,
                registrationStatus: 'pending',
              },
              {
                registrationStatus: 'verified',
              },
              function (err, result) {
                console.log(result);
                if (result) {
                  res.redirect(`${config.WEB_URL}/login?new_account=true`);
                  // res.redirect('https://jiweman.com');
                } else if (err) {
                  console.log(err);
                  msg = 'Some Error Occurred';
                  sendResponse.sendErrorMessage(err, res);
                }
              }
            );
          } else {
            // res.redirect('https://jiweman.com');
            res.redirect(`${config.WEB_URL}/login?new_account=true`);
          }
        }
      }
    }
  );
};

/*
 * --------------------------------------------------------------------------
 * upload profile photo Api start
 * ---------------------------------------------------------------------------
 */

exports.uploadProfilePhoto = async function (req, res, next) {
  console.log('inside uploadPhoto');

  let file = req.file;

  if (file) {
    res.send({
      status: 200,
      message: 'profile photo uploaded',
      // imageUrl: 'http://159.89.172.140/' + file.filename
      imageUrl: 'https://139.59.45.231/uploads/images/' + file.filename,
    });
  } else if (!file) {
    res.send({
      status: 400,
      message: 'profile photo not uploaded',
    });
  }
};

/*
 * --------------------------------------------------------------------------
 * Login with Jiweman API start
 * ---------------------------------------------------------------------------
 */

exports.loginwithJiweman = function (req, res) {
  let userName = req.body.userName;
  let password = req.body.password;
  // let mainDeviceToken = req.body.mainDeviceToken;

  if (!userName && !password) {
    return res.status(400).send({ message: 'Bad Request', status: false });
  }
  Player.findOne(
    {
      userName: userName,
    },
    '+password'
  )
    .populate('verificationId')
    .exec(function (err, foundUser) {
      console.log(err);
      // console.log('foundUser',foundUser);
      if (err) {
        return res.status(400).send({ message: 'Bad request', status: false });
      } else {
        if (foundUser == null) {
          logger.info('Please enter valid Username');
          return res
            .status(400)
            .send({ message: 'Please enter valid Username', status: false });
        } else if (foundUser.isUserBanned) {
          res.send({
            status: false,
            banned: true,
            reason: foundUser.banReason,
            message:
              'User Account Suspended',
          });
        } else if (foundUser.registrationStatus !== 'pending') {
          // if (foundUser.isVerified == false)
          // return res.status(400).send({ message: "Please check your registered email to activate your account.", status: false });
          // console.log(foundUser);

          // console.log(foundUser.mainDeviceToken);

          // if (foundUser.mainDeviceToken != mainDeviceToken) {
          //     console.log('in mainDeviceToken not matched');

          //     res.send({
          //         status: false,
          //         message: "You are already logged in on different device"
          //     })

          // } else {
          foundUser.comparePassword(password, function (err, isMatch) {
            if (err) {
              logger.info('Incorrect Credentials');
              return res
                .status(400)
                .send({ message: 'Incorrect Credentials', status: false });
            } else {
              if (!isMatch) {
                logger.info('Please enter valid Password');
                return res.status(400).send({
                  message: 'Please enter valid Password',
                  status: false,
                });
              } else {
                func.checkUserRoleName(foundUser._id, async function (
                  roleName
                ) {
                  foundUser.roleName = roleName;
                  if(foundUser.accountType == "observer" && foundUser.token){

                    var payload = func.decodeToken(foundUser.token)

                    if (payload.exp <= moment().unix()) {

                      var token = func.createToken(foundUser);

                    }else{
                      var token = foundUser.token
                    }

                  }else{

                    var token = func.createToken(foundUser);

                  }
                  data = foundUser;

                  if (req.headers['req-source'] === 'WebLogin') {
                    foundUser.webToken = token;
                  } else {
                    foundUser.token = token;
                  }

                  foundUser.save().then(function (data, err) {
                    if (err) {
                      logger.info('issue in saving token');
                      return res
                        .status(400)
                        .send({ message: 'Token issue', status: false });
                    }
                    return res.status(200).send({
                      message: 'Data Found',
                      status: true,
                      token,
                      data,
                    });
                  });
                  //   return res.status(200).send({ message: "Data Found", status: true, token, data });

                  // Player.findByIdAndUpdate(foundUser._id,{
                  //     $set:{token:token}
                  // }).then(function(data,err){
                  //     console.log(data);
                  //     console.log(err);
                  // })
                });
              }
            }
          });
          // }
        } else {
          res.send({
            status: false,
            message:
              'Please check your registered email to activate your account.',
          });
        }
      }
    });
};

/*
 * --------------------------------------------------------------------------
 * Check user's main device token API
 * ---------------------------------------------------------------------------
 */
exports.checkMainDeviceToken = (req, res) => {
  let mainDeviceToken = req.body.mainDeviceToken;

  Player.findOne({ mainDeviceToken: mainDeviceToken }).exec((err, data) => {
    if (err) {
      console.log(err);

      res.send({
        status: false,
        message: 'Data not found',
      });
    } else if (!data) {
      return res.status(400).send({ message: 'Data not Found', status: false });
    } else {
      return res
        .status(200)
        .send({ message: 'Data Found', status: true, data });
    }
  });
};

/*
 * --------------------------------------------------------------------------
 * Check user's security code API
 * ---------------------------------------------------------------------------
 */
exports.checkSecurityCode = (req, res) => {
  let securityCode = req.body.securityCode;
  let mainDeviceToken = req.body.mainDeviceToken;

  Player.findOne({ securityCode: securityCode }).exec((err, data) => {
    if (err) {
      console.log(err);
    } else {
      if (!data) {
        res.send({
          status: false,
          message: 'Please enter valid security code',
        });
      } else if (data) {
        let searchData = {
          securityCode: securityCode,
        };

        let updateData = {
          mainDeviceToken: mainDeviceToken,
        };

        Player.findOneAndUpdate(
          searchData,
          updateData,
          { upsert: false, new: true },
          function (err, data) {
            if (err) {
              return res.status(400).send({ err: err, status: false });
            }
            res.status(200).send({
              message: 'Main Device token updated successfully!',
              status: true,
              data: data,
            });
          }
        );
      }
    }
  });
};

/*
 * --------------------------------------------------------------------------
 * Login as Guest
 * ---------------------------------------------------------------------------
 */
// exports.loginAsGuest = function (req, res) {
//     console.log('guest login');
//     let mainDeviceToken = req.body.mainDeviceToken;
//     let deviceToken = req.body.deviceToken;
//     const guest = 'guest';
//     Player.findOne({
//         mainDeviceToken: mainDeviceToken,
//         accountType: guest
//     }, function (err, foundUser) {

//         if (err) {
//             // res.sendErrorMessage();
//             console.log(err)
//         } else {
//             if (foundUser == null) {

//                 let msg = 'Login Successful';
//                 //  while (true) {
//                 let randomText = guest + Math.floor(100000 + Math.random() * 900000);
//                 Player.findOne({
//                     userName: randomText,
//                     accountType: guest
//                 }, function (err, foundGuestId) {
//                     if (err) {
//                         msg = 'Some Error Occurred';
//                         sendResponse.sendErrorMessage(foundGuestId, res);
//                     } else if (foundGuestId) {
//                         var token = func.createToken(foundGuestId);
//                         data = foundGuestId;
//                         sendResponse.sendSuccesslogin(data, token, res);
//                         // sendResponse.sendSuccessData(data, res);
//                     } else if (foundGuestId == null) {
//                         const player = new Player();
//                         player.fullName = randomText;
//                         player.userName = randomText;
//                         player.email = randomText;
//                         player.password = randomText;
//                         player.deviceToken = deviceToken;
//                         player.mainDeviceToken = mainDeviceToken;
//                         player.accountType = guest;

//                         player.save().then(function (foundUser, err) {
//                             if (err) {
//                                 console.log(err)
//                                 let msg = "some error occurred";
//                                 sendResponse.sendErrorMessage(msg, res);
//                             } else {
//                                 var token = func.createToken(foundUser);
//                                 data = foundUser;
//                                 sendResponse.sendSuccesslogin(data, token, res);
//                                 // sendResponse.sendSuccessData(data, res);
//                             }
//                         });
//                     }
//                 });
//                 //  }
//                 //change logic
//             } else {
//                 var token = func.createToken(foundUser);
//                 data = foundUser;
//                 sendResponse.sendSuccesslogin(data, token, res);
//             }
//         }
//     });
// }

/*
 * --------------------------------------------------------------------------
 * Login with Facebook
 * ---------------------------------------------------------------------------
 */
// exports.loginwithFacebook = function (req, res) {
//     console.log('Facebook login');
//     let deviceToken = req.body.deviceToken;
//     let email = req.body.fbMail;
//     let socialId = req.body.fbId;
//     let userName = 'fb_' + socialId;
//     const accountType = 'facebook';
//     Player.findOne({
//         socialId: socialId,
//         accountType: accountType
//     }, function (err, foundUser) {
//         if (err) {
//             // res.sendErrorMessage();
//             console.log(err)
//         } else {
//             if (foundUser == null) {
//                 let msg = 'Login Successful';
//                 //  while (true) {
//                 Player.findOne({
//                     userName: userName,
//                     accountType: accountType
//                 }, function (err, foundGuestId) {
//                     if (err) {
//                         msg = 'Some Error Occurred';
//                         sendResponse.sendErrorMessage(foundGuestId, res);
//                     } else if (foundGuestId == null) {

//                         const player = new Player();

//                         player.userName = userName;
//                         player.email = email;
//                         player.password = userName;
//                         player.deviceToken = deviceToken;
//                         player.accountType = accountType;
//                         player.socialId = socialId;

//                         player.save().then(function (foundUser, err) {
//                             if (err) {
//                                 console.log(err)
//                                 let msg = "some error occurred";
//                                 sendResponse.sendErrorMessage(msg, res);
//                             } else {
//                                 var token = func.createToken(foundUser);
//                                 data = foundUser;
//                                 sendResponse.sendSuccesslogin(data, token, res);

//                             }
//                         });
//                     } else if (foundGuestId) {
//                         var token = func.createToken(foundGuestId);
//                         data = foundGuestId;
//                         sendResponse.sendSuccesslogin(data, token, res);
//                     }

//                 });
//                 //  }

//                 //change logic

//             } else {
//                 var token = func.createToken(foundUser);
//                 data = foundUser;
//                 sendResponse.sendSuccesslogin(data, token, res);
//             }

//         }

//     });
// }
``;
/*
 * --------------------------------------------------------------------------
 * Forgot Password
 * ---------------------------------------------------------------------------
 */
exports.forgotPassword = function (req, res) {
  var email = req.body.email;
  // req.check('email', 'Email is required field!').notEmpty();
  // req.check('email', 'Please enter email in valid format!').isEmail();

  // var errors = req.validationErrors();

  // let errors = await req.validationErrors();
  // if (errors) {
  //     return res.status(400).send({ "message": func.manageValidationMessages(errors), status: false })
  // }

  try {
    Player.findOne(
      {
        email: email,
      },
      function (err, foundUser) {
        console.log('found USer');
        console.log(foundUser);
        if (err) {
          logger.error(err.stack);
          return res
            .status(502)
            .send({ message: 'Unknown Error', status: false });
        } else {
          if (foundUser == null) {
            logger.info('This email id is not registered');
            return res.status(200).send({
              message: 'This emaid id is not registered',
              status: false,
            });
          } else {
            foundUser.resetPassword.initiated = true;
            foundUser.resetPassword.expiresOn = new Date(
              new Date().getTime() + 60 * 60 * 24 * 1000
            );
            foundUser.resetPassword.token = randomize('Aa0', 50);
            foundUser.save(function (err) {
              if (err) {
                logger.error(err.stack);
                return res.status(502).send({
                  message: 'Unknown Error',
                  status: false,
                  err: err,
                });
              } else {
                //send reset password link to user
                func.sendResetPasswordEmail(
                  foundUser.email,
                  foundUser.resetPassword.token
                );
                return res.status(200).send({
                  message:
                    'Please check ' +
                    foundUser.email +
                    ' for reset password link',
                  status: true,
                });
              }
            });
          }
        }
      }
    );
  } catch (e) {
    console.log(e.stack);
  }
};

/*
 * --------------------------------------------------------------------------
 * Reset Password
 * ---------------------------------------------------------------------------
 */
exports.resetPassword = function (req, res) {
  var passwordResetData = req.body;
  var token = req.query;
  console.log(passwordResetData);
  if (!token || !passwordResetData.password) {
    console.log(err);
    let msg = 'some error occurred';
    sendResponse.sendErrorMessage(msg, res);
  }
  Player.findOne(
    {
      'resetPassword.token': token.token,
      'resetPassword.initiated': true,
    },
    function (err, foundUser) {
      if (err) {
        console.log(err);
        let msg = 'some error occurred';
        sendResponse.sendErrorMessage(msg, res);
      } else {
        if (foundUser == null) {
          console.log(err);
          let msg = 'some error occurred';
          sendResponse.sendErrorMessage(msg, res);
        } else {
          if (new Date(foundUser.resetPassword.expiresOn) < new Date()) {
            return res.status(200).send({
              message: 'Token Expired',
              status: false,
            });
          }
          foundUser.resetPassword.initiated = false;
          foundUser.resetPassword.token = null;
          foundUser.password = passwordResetData.password;
          foundUser.save(function (err) {
            if (err) {
              return res.status(502).send({
                message: 'Unknow Error',
                status: false,
              });
            } else {
              return res.status(200).send({
                message: 'Password updated successfully.',
                status: true,
              });
            }
          });
        }
      }
    }
  );
};

/*
 * --------------------------------------------------------------------------
 * Forgot Username
 * ---------------------------------------------------------------------------
 */
exports.forgotUsername = function (req, res) {
  console.log('inside forgotUsername');

  var email = req.body.email;
  console.log(req.body);
  if (_.isEmpty(email)) {
    return res.send({
      status: 400,
      message: 'email field is emtpy',
    });
  }

  console.log('?>>>>>>>>>>>>>>>.');
  try {
    Player.findOne(
      {
        email: email,
      },
      function (err, foundUser) {
        console.log(foundUser);
        if (err) {
          logger.error(err.stack);
          return res
            .status(502)
            .send({ message: 'Unknown Error', status: false });
        } else {
          if (foundUser == null) {
            logger.info('This email id is not registered');
            return res.status(200).send({
              message: 'This emaid id is not registered',
              status: false,
            });
          } else if (foundUser) {
            func.sendUsernameEmail(foundUser.email);
            return res.status(200).send({
              message: 'Username sent successfully on ' + foundUser.email,
              status: true,
            });
          }
        }
      }
    );
  } catch (e) {
    console.log(e.stack);
  }
};

/*
 * --------------------------------------------------------------------------
 * getUserDetailsByToken
 * ---------------------------------------------------------------------------
 */
exports.getUserDetailsByToken = function (req, res) {
  var token = req.query.token;
  // var token = "lggmLYR0RIr3nbGSRBfc4huYMvxrUCP2eZG6z4Y83mGgteiOpC";
  if (!token) {
    return res.status(400).send({
      message: 'Bad request',
      status: false,
    });
  }
  Player.findOne(
    {
      'resetPassword.token': token,
      'resetPassword.initiated': true,
    },
    function (err, foundUser) {
      if (err) {
        return res.status(502).send({
          message: 'Unknow Error',
          status: false,
        });
      } else {
        if (foundUser == null) {
          return res.status(200).send({
            message: 'Not Found',
            status: false,
          });
        } else {
          if (new Date(foundUser.resetPassword.expiresOn) < new Date()) {
            return res.status(200).send({
              message: 'Token Expired',
              status: false,
            });
          }
          return res.status(200).send({
            message: 'Found',
            data: foundUser,
            status: true,
          });
        }
      }
    }
  );
};

/*
 * --------------------------------------------------------------------------
 * Add Default data for registered player/user
 * ---------------------------------------------------------------------------
 */
function addDefaultDataForPlayer(userData) {
  console.log('narrow');

  // const playerDisks = [{
  //     "diskName": "d1",
  //     "diskType": "active",
  //     "isCaptain": false,
  //     "force": 3.5,
  //     "aim": 10,
  //     "time": 20
  // },
  // {
  //     "diskName": "d2",
  //     "diskType": "active",
  //     "isCaptain": false,
  //     "force": 3.5,
  //     "aim": 10,
  //     "time": 20
  // },
  // {
  //     "diskName": "d3",
  //     "diskType": "active",
  //     "isCaptain": false,
  //     "force": 3.5,
  //     "aim": 10,
  //     "time": 20
  // },
  // {
  //     "diskName": "d4",
  //     "diskType": "active",
  //     "isCaptain": false,
  //     "force": 3.5,
  //     "aim": 10,
  //     "time": 20
  // },
  // {
  //     "diskName": "d5",
  //     "diskType": "active",
  //     "isCaptain": false,
  //     "force": 3.5,
  //     "aim": 10,
  //     "time": 20
  // },
  // {
  //     "diskName": "d6",
  //     "diskType": "substitute",
  //     "isCaptain": false,
  //     "force": 3.5,
  //     "aim": 10,
  //     "time": 20
  // },
  // {
  //     "diskName": "d7",
  //     "diskType": "substitute",
  //     "isCaptain": false,
  //     "force": 3.5,
  //     "aim": 10,
  //     "time": 20
  // },
  // {
  //     "diskName": "d8",
  //     "diskType": "substitute",
  //     "isCaptain": false,
  //     "force": 3.5,
  //     "aim": 10,
  //     "time": 20
  // },
  // {
  //     "diskName": "d9",
  //     "diskType": "substitute",
  //     "isCaptain": false,
  //     "force": 3.5,
  //     "aim": 10,
  //     "time": 20
  // },
  // {
  //     "diskName": "d10",
  //     "diskType": "substitute",
  //     "isCaptain": false,
  //     "force": 3.5,
  //     "aim": 10,
  //     "time": 20
  // }
  // ];
  // const coins = 200;
  playerGameData = new PlayerGameData();
  // playerGameData.disks = playerDisks;
  // playerGameData.coins = coins;
  playerGameData.playerId = userData._id;
  playerGameData.userName = userData.userName;
  playerGameData.save().then(function (data, err) {
    if (err) {
      console.log(err);
      let msg = 'some error occurred';
      sendResponse.sendErrorMessage(msg);
    } else {
      // console.log('data')
      // console.log(data);
    }
  });
}

/*
 * --------------------------------------------------------------------------
 * Checking latest version of apk file
 * ---------------------------------------------------------------------------
 */

exports.latestApk = (req, res) => {
  console.log('inside latestAPK');
  var version = req.query.version;
  console.log(version);
  // for local testing
  // var filePath = '../server/apis/jogabonitobuild_'+version+'.apk'
  var filePath =
    '/var/www/html/uploads/build/jogabonitobuild_' + version + '.apk';
  var exists = fs.existsSync(filePath);
  //  console.log(exists);
  //  console.log(filePath)
  if (exists == false) {
    res.send({
      status: 200,
      message: 'updated version is available',
    });
  } else if (exists == true) {
    res.send({
      status: 400,
      message: 'your app is up to date',
    });
  } else {
    res.send({
      status: 500,
      message: 'some error occurred',
    });
  }
};

exports.playerTransctions = (req, res) => {
  try {
    console.log('player transctions');
    func.checkUserAuthentication(req, res, (payload) => {
      var userId = payload.sub;
      console.log(userId);
      Collection.find({ userId: userId })
        .populate('leagueId')

        .exec(async (err, data) => {
          if (err) {
            return res
              .status(400)
              .send({ message: 'data not found', status: false });
          } else {
            var userHistory = await playerLeague.find({ userId: userId });
            let obj = [];

            data.forEach((info) => {
              let getLeagueId = _.find(userHistory, {
                // leagueId: info.leagueId._id,
                collectionId: info.collectionId,
              });

              let temp = {
                _id: info._id,
                userId: info.userId,
                status: _.isEmpty(info.status) ? 'pending' : info.status,
                phonenumber: info.phoneNumber,
                // leagueInfo: info.leagueId,
                id: info.collectionId,
                // ticket: _.isEmpty(getLeagueId) ? '' : getLeagueId.ticket,
                createdAt: info.createdAt,
                amount: info.amount,
                currency: info.currency,
                collectionType: info.collectionType,
              };
              obj.push(temp);
            });
            res.json({
              message: 'Users Transaction History',
              data: obj,
              status: true,
            });
          }
        });
    });
  } catch (e) {
    return res.status(400).send({ error: e, status: false });
  }
};

exports.playerPreviouslyUsedPhoneNumbers = (req, res) => {
  func.checkUserAuthentication(req, res, async (payload) => {
    var userId = payload.sub;

    const playerPhoneNumberList = await Collection.aggregate([
      {
        $match: {
          userId: userId.toObjectId(),
          status: 'successful',
        },
      },
      {
        $group: {
          _id: '$_id',
          userId: { $first: '$userId' },
          first_name: { $first: '$apiResponse.contact.first_name' },
          last_name: { $first: '$apiResponse.contact.last_name' },
          phone_number: { $first: '$apiResponse.contact.phone_number' },
        },
      },
    ]);

    return res.json({
      status: true,
      data: playerPhoneNumberList,
    });
  });
};

exports.playerPhoneNumberFromLeaguePurchase = (req, res) => {
  func.checkUserAuthentication(req, res, async (payload) => {
    var userId = payload.sub;
    var leagueId = req.params.leagueId.toObjectId();
    console.log(userId);
    console.log(req.params.leagueId);

    const playerPhoneNumberList = await Collection.findOne(
      { userId: userId, leagueId: leagueId },
      { phoneNumber: 1 }
    );

    return res.json({
      status: true,
      data: playerPhoneNumberList,
    });
  });
};

// Not Used Anymore...
exports.claimLeagueWinning = (req, res) => {
  // func.checkUserAuthentication(req, res, async (payload) => {
  //   var userId = payload.sub;
  //   // const { winningId, phoneNumber, first_name, last_name } = req.body;
  //   const { winningId } = req.body;

  //   const leagueWinningPromise = LeagueWinners.findById(winningId)
  //     .populate({
  //       path: 'leaderboard',
  //       model: 'LeaderBoard',
  //     })
  //     .populate({
  //       path: 'user',
  //       model: 'User',
  //     })
  //     .populate({
  //       path: 'league',
  //       model: 'League',
  //     });


  //   const [leagueWinningObj, conversionData] = await Promise.all([
  //     leagueWinningPromise,
  //     //  conversionDataPromise,
  //   ]);

  //   if (!leagueWinningObj.user._id.equals(payload.sub)) {
  //     return res.status(400).json({
  //       status: false,
  //       message: 'This is not your winning ;)',
  //     });
  //   }

  //   if (leagueWinningObj.state !== 'created') {
  //     return res.status(400).json({
  //       status: false,
  //       message: 'Already in process',
  //     });
  //   }

  //   const walletResponse = await creditToWallet(
  //     payload.sub,
  //     leagueWinningObj.amount,
  //     leagueWinningObj.amount,
  //     leagueWinningObj._id,
  //     'Won League: ' + leagueWinningObj.league.leagueName,
  //     'successful'
  //   );

  //   leagueWinningObj.paymentResponse = walletResponse.wallet;
  //   leagueWinningObj.state = 'successful';
  //   leagueWinningObj.hasClaimed = true;
  //   leagueWinningObj.save();

  //   return res.json({
  //     status: true,
  //     // data: {
  //     //   // leagueWinningObj,
  //     //   // conversionData,
  //     //   makePaymentResponse: makePaymentResponse.data,
  //     // },
  //     message: 'Prize Added To Wallet',
  //   });
  // });
};

exports.winningsPaymentWebhook = async (req, res) => {
  if (
    req.body.data.metadata &&
    req.body.data.metadata.type &&
    req.body.data.metadata.id &&
    req.body.data.metadata.type === 'wallet_transfer'
  ) {
    if (['processed', 'processed_with_errors'].includes(req.body.data.state)) {
      await updateWalletStatus(req.body.data.metadata.id, 'successful');
    }

    if (['rejected', 'cancelled'].includes(req.body.data.state)) {
      const walletResponse = await updateWalletStatus(
        req.body.data.metadata.id,
        'failed'
      );
      await updateWalletBalance(
        walletResponse.accountNumber,
        Math.abs(walletResponse.amount)
      );
    }
  }

  return res.json({
    state: true,
    message: 'Updated Successfully',
  });
};

function generateOTP() {
  // Declare a digits variable
  // which stores all digits
  var digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < 4; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}

exports.transactionHistoryForAdmin = async (req, res) => {
  try {
    console.log('transation admin');
    var page = _.isEmpty(req.query.page) ? 1 : parseInt(req.query.page);
    var limit = _.isEmpty(req.query.limit) ? 10 : parseInt(req.query.limit);
    var query = {};
    var options = {
      sort: { date: -1 },
      populate: 'leagueId userId',
      lean: true,
      offset: page * limit,
      limit: limit,
    };

    console.log(options);
    Collection.paginate(query, options).then(async (data) => {
      // return res.json(data);
      console.log(data.docs.length);
      var userHistory = await playerLeague.find({});
      let obj = [];
      data.docs.forEach((info) => {
        // if (info.status == 'successful' && info.leagueId  ) {
        let getLeagueId = _.find(userHistory, {
          // leagueId: info.leagueId._id,
          collectionId: info.collectionId,
        });

        //   if (getLeagueId) {
        let temp = {
          _id: info._id,
          userInfo: info.userId.userName,
          userCountry: info.userId.countryOfRecidence,
          status: info.status,
          phonenumber: info.phoneNumber,
          // leagueInfo: info.leagueId ? info.leagueId.leagueName : '',
          id: info.collectionId,
          //  ticket: _.isEmpty(getLeagueId) ? '' : getLeagueId.ticket,
          createdAt: info.createdAt,
          amount: info.amount,
          currency: info.currency,
          collectionType: info.collectionType,
        };
        obj.push(temp);
      });
      res.json({
        message: 'Users Transaction History',
        data: obj,
        total: data.total,
        limit: data.limit,
        offset: data.offset,
        status: true,
      });
    });
  } catch (e) {
    return res.status(400).send({ error: e, status: false });
  }
};

exports.checkAuthentication = (req, res) => {
  try {
    func.checkUserAuthentication(req, res, (payload) => {
      res.json({
        message: 'Users has valid session',
        data: {},
        status: true,
      });
    });
  } catch (e) {
    return res.status(400).send({ error: e, status: false });
  }
};

exports.mobileNumberVerification = async (req, res, next) => {
  func.checkUserAuthentication(req, res, async (payload) => {
    console.log('mobile number verification');
    var userId = payload.sub;
    var getUserInfo = await Player.findOne({ _id: userId });
    if (getUserInfo) {
      const otp = generateOTP();

      var obj = new MobileVerification({
        email: getUserInfo.email,
        mobileNumber: req.body.mobileNumber,
        otp: otp,
        varify: false,
      });

      console.log(otp)
      obj.save(function (err, result) {
        let subject = `Joga-Bonito –   Your OTP for Mobile Verification`;
        let body = `<div style="width: 680px; margin: 0 auto;">
                <div style="background: #504482; height: 80px;">
                <h3 style="color: #fff; font-size: 36px; font-weight: normal; padding: 18px 0 0 70px; margin: 0;">Welcome to Joga Bonito</h3>
                </div>
                <div style="background: #fff; padding: 23px 70px 20px 70px;">
                <h4 style="font-size: 24px; color: #504482; margin: 20px 0 30px;">Hello ${getUserInfo.userName},</h4>
                <p>Your One Time Password (OTP) for Mobile Number Verification for your Joga Bonito account is [${result.otp}]</p>
                <p>Please enter this code in the OTP code box listed on the page.<p>
                <div style="color: #8b8382; font-size: 15px;">
                <div style="display: block; margin: 90px 0;">&nbsp;</div>
                </div>
                </div>
                <div style="height: 52px; background: #dfdfdf;">&nbsp;</div>
                </div>`;
        common.sendEmail(getUserInfo.email, body, subject);
        return res.json({
          status: true,
          message: `OTP sent Successfully...Now please check your ${getUserInfo.email} to verify your mobile number`,
        });
      });
    }
  });
};

exports.verifyMobileNumber = async (req, res, next) => {
  func.checkUserAuthentication(req, res, async (payload) => {
    var userId = payload.sub;
    console.log(req.body);
    var { mobileNumber, otp } = req.body;
    MobileVerification.findOne({ mobileNumber: mobileNumber, otp: otp }).exec(
      function (err, result) {
        if (err) {
          return res.status(400).json({
            status: false,
            message: err.message,
          });
        } else {
          console.log(result);
          if (result) {
            result.varify = true;
            result.save(function (err, data) {
              console.log(data);
              console.log(err);
              return res.json({
                status: true,
                message: 'data found',
                verify: data.verify,
              });
            });
          } else {
            return res.status(400).json({
              status: false,
              message: 'data not found',
            });
          }
        }
      }
    );
  });
};


exports.updateBanStatus = async (req, res, next) => {
  func.checkUserAuthentication(req, res, async (payload) => {
    // reqbody - id, isUserBanned, banReason
    const { id, isUserBanned, banReason } = req.body;
    await Player.updateOne({ _id: id }, {
      $set: {
        isUserBanned,
        banReason: isUserBanned ? banReason : ''
      }
    });

    return res.status(200).json({
      status: true,
      message: isUserBanned ? 'User Banned' : "User Unbanned",
    });
  })
}

exports.warn = async (req, res, next) => {
  func.checkUserAuthentication(req, res, async (payload) => {

    // Update warn count in users collection
    const { id, warnReason } = req.body;
    await Player.updateOne({ _id: id }, {
      $inc: {
        warnCount: 1
      },
      $push: { warnReasons: warnReason }
    });

    // Send email to player with warning reason
    await Player.findOne(
      {
        _id: id,
      },
      function (err, userInfo) {
        if (err) {
          res.status(200).send({
            message: 'Some error occurred',
            status: false,
          });
        } else {
          let subject = `Joga-Bonito –  Warning`;
          let body = `<div style="width: 680px; margin: 0 auto;">
                            <div style="background: #504482; height: 80px;">
                            <h3 style="color: #fff; font-size: 36px; font-weight: normal; padding: 18px 0 0 70px; margin: 0;">Welcome to Joga Bonito</h3>
                            </div>
                            <div style="background: #fff; padding: 23px 70px 20px 70px;">
                            <h4 style="font-size: 24px; color: #504482; margin: 20px 0 30px;">Hi ${userInfo.userName},</h4>
                            <div style="color: #8b8382; font-size: 15px;">
                            <p>Hey, You have warn for the below reason!!! </p>
                            <p><strong>${warnReason}</strong></p>
                            <div style="display: block; margin: 90px 0;">&nbsp;</div>
                            </div>
                            </div>
                            <div style="height: 52px; background: #dfdfdf;">&nbsp;</div>
                            </div>`;
          common.sendEmail(userInfo.email, body, subject);
        }
      }
    );


    return res.status(200).json({
      status: true,
      message: 'User warned',
    });
  })
}

exports.getReferCode = async(req,res,next)=>{
  func.checkUserAuthentication(req, res, async (payload) => {
    var id = payload.sub;
    var getCode;
    
    var getData =await Player.findOne({ _id: id }).lean();
    console.log(getData);

    if(_.isEmpty(getData.referCode)){
      var getCode =func.generateReferCode();
    
      await Player.updateOne({ _id: id }, {
        $set: {
         referCode :getCode
        }
      });
    
    }
    else{
      getCode = getData.referCode;
    }
   
    return res.status(200).json({
      status: true,
      message:"Fetch Referral code",
      data:{
        referCodeLink:getCode
      }
    });
    

  })

}