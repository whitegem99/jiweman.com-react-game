/*
* --------------------------------------------------------------------------
* Created by Barquecon Technologies on 12/03/2019 by Dipak Adsul
* ---------------------------------------------------------------------------
*/
let func = require('../common/commonfunction');
let sendResponse = require('../common/sendresponse');
let logger = require('../../logger/log');
let BettingCompany = require('./betting.model').BettingCompany;
let BettingAccount = require('./bettingaccount.model').BettingAccount;
let Role = require('../playerAuth/player.model').Role;
let PlayerGameData = require('../playerAuth/player.model').PlayerGameData;

let bettingTransactionController = require('./betting.transaction.controller');


// Require the controllers WHICH WE DID NOT CREATE YET!!



/*
* --------------------------------------------------------------------------
* Register with Jiweman Api start
* ---------------------------------------------------------------------------
*/
exports.registerBettingCompany = async function (req, res, next) {

  let userData = req.body;
  const normal = 'normal';
  userData.roleName = 'bettingCompanyAdmin';
  req.check('password', 'Password is required field!').notEmpty();
  req.check('email', 'Email is required field!').notEmpty();

  let errors = await req.validationErrors();
  if (errors) {
    return res.status(400).send({ "message": func.manageValidationMessages(errors), status: false })
  }
  try {

    Role.findOne({
      roleName: userData.roleName
    }, function (err, data) {
      if (err) {
        let msg = ""
        localStorage.send(msg, res);
      } else {
        const bettingAdmin = new BettingCompany();
        bettingAdmin.username = userData.username,
          bettingAdmin.email = userData.email,
          bettingAdmin.password = userData.password
        bettingAdmin.roleId = data._id;
        BettingCompany.find({
          email: userData.email
        }, function (err, docs) {
          if (docs.length) {
            res.status(200).send({
              message: "This email id is already registered",
              status: false
            });
          } else {

            bettingAdmin.save().then(function (data, err) {
              console.log(data);
              if (err) {
                console.log(err)
                let msg = "some error occurred"
                sendResponse.sendErrorMessage(msg, res);
              } else {
                let data = {};
                sendResponse.sendSuccessData(data, res);

              }
            });


          }
        });
      }

    })
  }

  catch (error) {
    return console.log(error);
  }
}




/*
* --------------------------------------------------------------------------
* Login with Jiweman API start
* ---------------------------------------------------------------------------
*/

exports.loginBettingCompany = function (req, res) {
  let userName = req.body.username;
  let password = req.body.password;
  if (!userName || !password) {
    console.log('not found')
    res.status(400).send({
      message: "Bad Request",
      status: false
    });
  }
  BettingCompany.findOne({
    username: userName,
  }, '+password', function (err, foundUser) {
    if (err) {
      let msg = '';
      sendResponse.sendErrorMessage(msg, res)

    } else {
      if (foundUser == null) {
        logger.info('Please enter valid User id')
        let msg = '';
        sendResponse.wrongCredentials(msg, res);
      }
      console.log(foundUser)
      foundUser.comparePassword(password, function (err, isMatch) {
        if (err) {
          logger.info('Incorrect Credentials');
          let msg = '';
          sendResponse.wrongCredentials(msg, res);
        } else {
          if (!isMatch) {
            logger.info('Please enter valid Password');
            let msg = '';
            sendResponse.wrongCredentials(msg, res);
          } else {
            console.log('BQT')
            console.log(foundUser)
            func.checkBettingUserRoleName(foundUser._id, function (roleName) {
              foundUser.roleName = roleName;
              var token = func.createToken(foundUser);
              data = foundUser;
              sendResponse.sendSuccesslogin(data, token, res);
            });
          }
        }
      });
    }
  });
}


/*
* --------------------------------------------------------------------------
* CreateBettingAccount
* ---------------------------------------------------------------------------
*/

exports.createBettingAccount = async function (req, res, next) {

  let userData = req.body;
  try {

    const bettingAccount = new BettingAccount();
    bettingAccount.username = userData.username,
      bettingAccount.password = userData.password,
      bettingAccount.bettingcompid = userData.bettingcompid,
      bettingAccount.availablecash = 0,
      bettingAccount.currency = userData.currency,
      bettingAccount.availablerp = 0,
      BettingAccount.find({
        username: userData.username
      }, function (err, docs) {
        if (docs.length) {
          res.status(200).send({
            message: "This username has already a betting account with selected company",
            status: false
          });
        } else {

          bettingAccount.save().then(function (data, err) {
            if (err) {
              console.log(err)
              let msg = "some error occurred"
              sendResponse.sendErrorMessage(msg, res);
            } else {
              let data = {};
              sendResponse.sendSuccessData(data, res);

            }
          });


        }
      });
  }
  catch (error) {
    return console.log(error);
  }
}


/*
* --------------------------------------------------------------------------
* 1. Get bettingAccount details if userName and betting_id  passed in body
* ---------------------------------------------------------------------------
*/

exports.betAccountDetails = function (req, res) {
  var findData = {
    username: req.body.username,
    bettingcompid: req.body.bettingcompid.toObjectId()
  
  };
  console.log(findData);
  BettingAccount.findOne(findData,{ password: 0 },function (err, data) {
    if (err) {
      logger.error(err);
      res.status(400).send({
        err: err,
        status: false
      })
    } else {
      if (data == null) {
        return res.status(200).send({
          message: " Record Not Found",
          status: false
        });
      }

      res.status(200).send({
        message: "Record Found",
        data: data,
        status: true
      })

    }
  });

}


/*
* --------------------------------------------------------------------------
* 1. Get All Betting Companies if userId is not passed in query param
* 2. Get single Betting Comanies by userId if passed in query param
* ---------------------------------------------------------------------------
*/
exports.getAllBetCompaniesDetails = function (req, res) {
  let username;
   // func.checkUserAuthentication(req, res, function (payload) {
      if(req.query.username){
         uname = req.query.username;
         console.log()
         BettingAccount.find({ username: uname},{password: 0},{currency: 0}, function(err, result) {
          if (err){
            let msg = '';
            sendResponse.sendErrorMessage(msg, res);
          }
          else if(result.length > 0){
            sendResponse.sendSuccessData(result, res);
          }else if (result.length === 0){
            let msg = '';
            sendResponse.sendDataNotFound(msg, res);
          }
        });
      } else {
       // var username = payload.sub.toObjectId();
        BettingCompany.find( function (err, data) {
          if (err) {
            logger.error(err);
            let msg = '';
            sendResponse.sendErrorMessage(msg, res)
          } else {
            if (data.length == 0) {
                let msg = '';
                sendResponse.sendDataNotFound(msg, res);
            } else {
             sendResponse.sendSuccessData(data, res);
            }
          }
        });
      }
  //  });
  }


/*
* --------------------------------------------------------------------------
*  Entry Fee For real money match in betting
* ---------------------------------------------------------------------------
*/
  exports.selectMatchEntryFee = function (req, res) {
    let username = req.body.username;
    let bettingcompid = req.body.bettingcompid;
    let entryFee = req.body.entryFee;
     func.checkUserAuthentication(req, res, function (payload) {
      let loggedInplayerId = payload.sub.toObjectId();
      console.log(loggedInplayerId)
        if( username && entryFee ) {
          var findData = {
            username: req.body.username,
            bettingcompid: req.body.bettingcompid.toObjectId()
          };
          BettingAccount.findOne(findData,{ password: 0 }, async function(err, result) {
            if (err){
              let msg = '';
              sendResponse.sendErrorMessage(msg, res);
            }
            else if(result){
              const betData= {
                username: username,
                bettingcompid: bettingcompid,
                entryFee: entryFee
              }
              let response= await bettingTransactionController.debitRPforBettingGame(betData);
              
              if(response == 'success')
              {              
                  PlayerGameData.findOneAndUpdate(
                    { 
                      playerId: loggedInplayerId
                    },
                    {
                      playerId: loggedInplayerId,
                      entryFee: entryFee
                    },
                    {
                      upsert: true,
                      new: true,
                      useFindAndModify: false
                    },function(err, result) {
                    if(!err) {
                      sendResponse.sendSuccessData(result, res);
                    }
                    else {
                      let msg = '';
                      sendResponse.sendDataNotFound(msg, res);
                    }
                });
          }
            }else if (result.length === 0){
              let msg = '';
              sendResponse.sendDataNotFound(msg, res);
            }
          });
        }
     });
    }