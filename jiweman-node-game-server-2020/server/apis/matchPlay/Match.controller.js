let sendResponse = require('../common/sendresponse');
let logger = require('../../logger/log');
let Match = require('./matchplay.model').Match;
const OneonOne = require('../oneonone/oneonone.model').OneOnOne;
const { playerBet } = require('../playerOneVSOneBet/playerOneVSOneBet.model');
let LeaderBoard = require("../leaderboard/leaderboard.model").LeaderBoard;
let PlayerGameData = require('../playerAuth/player.model').PlayerGameData;
let func = require('../common/commonfunction');
const Player = require('../playerAuth/player.model').Player;
const playerLeague = require('../playerLeague/playerLeague.model').playerLeague;
const async_lib = require('async');
const _ = require('lodash');
let moment = require('moment');
const { OneOnOneData } = require('../oneonone/oneonone.model');
const oneononeController = require('../oneonone/oneonone.controller');
const { data } = require('../../logger/log');
const { creditToWallet,debitFromWallet,getBalance } = require('../paymentAPIs/wallet/wallet.service');
var ObjectID = require('mongodb').ObjectID;
let MatchState = require('../matchStates/matchStates.model').MatchState;


/*
* --------------------------------------------------------------------------
* Create New Match
* ---------------------------------------------------------------------------
*/
exports.createNewMatch = (req, res) => {
  console.log('inside createNewMatch');
  func.checkUserAuthentication(req, res, async function (payload) {
    let matchData = req.body;
    let newMatch = new Match();

    if (!req.body) {
      
      return res.status(400).send({ message: "Bad Request", status: false });

    } else {
      try {

          newMatch.playerOneUserName = matchData.playerOneUserName;
          newMatch.playerTwoUserName = matchData.playerTwoUserName;
          newMatch.roomName = matchData.roomName;
          newMatch.isRematch = matchData.isRematch;
          newMatch.matchType = matchData.matchType;
          newMatch.leagueId = matchData.leagueId;
          newMatch.oneonone = matchData.oneonone;
          newMatch.bettingCompanyId = payload.bettingCompanyId;
          newMatch.secretID = matchData.secretID;
          newMatch.senderId = matchData.senderId;
          newMatch.updatedBysenderId = "";

          if (newMatch.roomName == null || newMatch.roomName == undefined || newMatch.roomName == '') {
            let response = {
              message: "Please specify valid roomName",
              status: false
            }
            let statusCode = 400
            func.log("createNewMatch",req.body,statusCode,response)
            return res
              .status(statusCode)
              .send(response)
          }
          if (newMatch.matchType == 'leagueGamePlay') {
            if (newMatch.leagueId == null || newMatch.leagueId == undefined || newMatch.leagueId == '') {
              let response = {
                message: "Please specify leagueId",
                status: false
              }
              let statusCode = 400
              func.log("createNewMatch",req.body,statusCode,response)
              return res
                .status(statusCode)
                .send(response)
            }
          }

          if (newMatch.matchType == 'oneononeBet') {
            if (newMatch.oneonone == null || newMatch.oneonone == undefined || newMatch.oneonone == '') {
              let response = {
                message: "Please specify oneonone Bet Id",
                status: false
              }
              let statusCode = 400
              func.log("createNewMatch",req.body,statusCode,response)
              return res
                .status(statusCode)
                .send(response)
            }
          }

          if (matchData.matchType == 'oneononeBet') {
            var getUserData = await userBettingData(matchData.playerOneUserName, matchData.playerTwoUserName, matchData.oneonone);
          }

          var oldMatchData = await Match.findOne({secretID: matchData.secretID});
          
          if(oldMatchData && newMatch.senderId == 'obs1') {

            if (matchData.matchType == 'oneononeBet') { 
              matchData.playerOneAmount = getUserData.playerOneAmount
              matchData.playerTwoAmount = getUserData.playerTwoAmount

              // var updateGamePlayChanceP1 = await func.updateOneOnOneGamePlayChance(newMatch.playerOneUserName, 1, newMatch.oneonone, newMatch.matchType);
              // var updateGamePlayChanceP2 = await func.updateOneOnOneGamePlayChance(newMatch.playerTwoUserName, 2, newMatch.oneonone, newMatch.matchType);

            }

            Match.findOneAndUpdate({ secretID: matchData.secretID },
              { $set: matchData }, {
              upsert: false,
              new: true,
              useFindAndModify: false
            }, (err, updated) => {

              let response
              let statusCode
              if (err) {
                response = {
                  message: "something went wrong",
                  status: false
                }
                statusCode = 400
              }else{

                response = {
                  message: "match data updated",
                  status: true,
                  data: updated
                }
                statusCode = 200

              }

              func.log("createNewMatch", req.body, statusCode, response)
              return res
                .status(statusCode)
                .send(response)
            })

          } else if (!oldMatchData) {

            if (matchData.matchType == 'oneononeBet') { 

              const betInfo = await playerBet.find({
                userId: payload.sub.toObjectId(),
                gameId: ObjectID(newMatch.oneonone)
              }).sort({
                _id: -1,
              });

              if(betInfo.remaining == 0 || betInfo.freeBets == 0){
                // return res.status(400).send({ "message": "You need to purchase this bet to get more game play chances", status: false });
                let response = {
                  message: "You need to purchase this bet to get more game play chances",
                  status: false
                }
                let statusCode = 400
                func.log("createNewMatch",req.body,statusCode,response)
                return res
                  .status(statusCode)
                  .send(response)
              }

              newMatch.playerOneAmount = getUserData.playerOneAmount
              newMatch.playerTwoAmount = getUserData.playerTwoAmount

              var getBetData = await OneonOne.findOne({ _id: newMatch.oneonone });

                  if (_.isEmpty(getBetData)) { 
                    
                  return res.status(400).send({ message: "Bad Request", status: false });

                  }
                  
                const player1Detail = await Player.findOne({
                  userName: newMatch.playerOneUserName
                });
          
                const p1ticketInfo = await playerBet
                  .findOne({
                    userId: ObjectID(player1Detail._id),
                    gameId: ObjectID(newMatch.oneonone),
                    freeBets: {
                      $gt: 0
                    }
                  }).sort({
                    freeBets: 1
                  });
            
                  if (p1ticketInfo) {
                  
                  let updateFreeBetsCountp1 = await func.updateFreeBetsCount(newMatch.playerOneUserName, newMatch.oneonone);

                } else {
                  console.log('195 in else');
                  var updateGamePlayChanceP1 = await func.updateOneOnOneGamePlayChance(newMatch.playerOneUserName, 1, newMatch.oneonone, newMatch.matchType);
                }
                
                const player2Detail = await Player.findOne({
                  userName: newMatch.playerTwoUserName
                });
          
                const p2ticketInfo = await playerBet
                  .findOne({
                    userId: ObjectID(player2Detail._id),
                    gameId: ObjectID(newMatch.oneonone),
                    freeBets: {
                      $gt: 0
                    }
                  }).sort({
                    freeBets: 1
                  });
                  
                  if (p2ticketInfo) {
                  
                     let updateFreeBetsCountp2 = await func.updateFreeBetsCount(newMatch.playerTwoUserName, newMatch.oneonone);

                } else {
                  console.log('219 in else');
                  
                  var updateGamePlayChanceP2 = await func.updateOneOnOneGamePlayChance(newMatch.playerTwoUserName, 2, newMatch.oneonone, newMatch.matchType);
                }

            }

            console.log("newMatch")
            console.log(newMatch)
  
            newMatch.save().then(async function (result, err) {
              if (err) {
                console.log(err)
                let msg = "some error occurred"
              } else {
                console.log(' new match data data data');
                var leanedObject = result.toObject();
                console.log(leanedObject);

                let response
                let statusCode
              
                if (matchData.matchType == 'leagueGamePlay' || matchData.matchType == 'oneonone') {
                  response = {
                    message: "New match created",
                    status: true,
                    data: leanedObject
                  }
                  statusCode = 200

                } else if (matchData.matchType == 'oneononeBet') {

                  response = {
                    message: "New match created",
                    status: true,
                    data: leanedObject
                  }
                  statusCode = 200

                } else {
                  response = {
                    message: "Please specify valid game type",
                    status: false
                  }
                  statusCode = 400
                }

                func.log("createNewMatch", req.body, statusCode, response)
                return res
                  .status(statusCode)
                  .send(response)
                }
            });
          } else {


            let response = {
              message: "No need to update",
              status: true,
              data: oldMatchData
            }
            statusCode = 200

            func.log("createNewMatch", req.body, statusCode, response)
            return res
              .status(statusCode)
              .send(response)

          }
      } catch (error) {
        console.log(error);
        let response = {
          message: "something went wrong",
          status: false
        }
        let statusCode = 400
        func.log("createNewMatch",req.body,statusCode,response)
        return res
          .status(statusCode)
          .send(response)
      }
    }
  })
}

var userBettingData = async function (playerOne, playerTwo, gameId) {

  return new Promise(async (resolve, reject) => {
    var data = {};
    var getUserData = await Player.find({ userName: { $in: [playerOne, playerTwo] } }).lean();
    var getGameData = await OneonOne.findOne({ _id: gameId }).lean();


    const modifiedList = await Promise.all(
      getUserData.map(async (info) => {

        query = {
          gameId: getGameData._id,
          userId: info._id,
        }

        var getPlayerBetInfo = await playerBet.find(query).sort({ _id: -1 }).lean();
        console.log("getPlayerBetInfo");
        console.log(getPlayerBetInfo);
        if (info.userName == playerOne) {
          if (getPlayerBetInfo[0].totalAllowed != getPlayerBetInfo[0].remaining) {
            data.playerOneAmount = !isNaN(getGameData.prize[getPlayerBetInfo[0].win + 1] - getGameData.prize[getPlayerBetInfo[0].win]) ? getGameData.prize[getPlayerBetInfo[0].win + 1] - getGameData.prize[getPlayerBetInfo[0].win] : 0;
            // data.playerOneAmount = data.playerOneAmount - getGameData.prize[getPlayerBetInfo[0].win]
          }
          else {

            data.playerOneAmount = !isNaN(getGameData.prize[getPlayerBetInfo[0].win + getPlayerBetInfo[0].loss + 1]) ? getGameData.prize[getPlayerBetInfo[0].win + getPlayerBetInfo[0].loss + 1] : 0;
            data.playerOneAmount = !isNaN(data.playerOneAmount - getGameData.prize[getPlayerBetInfo[0].win]) ? data.playerOneAmount - getGameData.prize[getPlayerBetInfo[0].win] : 0;

          }
        }
        else {

          if (getPlayerBetInfo[0].totalAllowed != getPlayerBetInfo[0].remaining && info.userName == playerTwo) {
            data.playerTwoAmount = !isNaN(getGameData.prize[getPlayerBetInfo[0].win + 1] - getGameData.prize[getPlayerBetInfo[0].win]) ? getGameData.prize[getPlayerBetInfo[0].win + 1] - getGameData.prize[getPlayerBetInfo[0].win] : 0;
          }
          else {
            data.playerTwoAmount = !isNaN(getGameData.prize[getPlayerBetInfo[0].win + getPlayerBetInfo[0].loss + 1]) ? getGameData.prize[getPlayerBetInfo[0].win + getPlayerBetInfo[0].loss + 1] : 0;
            data.playerTwoAmount = !isNaN(data.playerTwoAmount - getGameData.prize[getPlayerBetInfo[0].win]) ? data.playerTwoAmount - getGameData.prize[getPlayerBetInfo[0].win] : 0;
          }

        }
      })
    );
    console.log(data);
    resolve(data);

  })
}


/*
 * --------------------------------------------------------------------------
 * Match Results
 * ---------------------------------------------------------------------------
 */

exports.updateMatchResults = async (req, res) => {
  console.log('inside updateMatchResults');
  func.checkUserAuthentication(req, res, async function (payload) {
    let data = req.body;
    const finished = 'finished';
    console.log(req.body);
    if (!req.body) {
      return res.status(400).send({ message: "Bad Request", status: false });

    } else {
      try {
        // return new Promise(async (resolve, reject) => {

        if (data.roomName == '' || data.roomName == null || data.roomName == undefined) {
          return res
            .status(400)
            .send({
              message: "Please specify valid roomName",
              status: false
            })
        }

        if (data.matchId == '' || data.matchId == null || data.matchId == undefined) {
          return res
            .status(400)
            .send({
              message: "Please specify valid matchId",
              status: false
            })
        }

        if (data.winnerName == '' || data.winnerName == null || data.winnerName == undefined) {
          return res
            .status(400)
            .send({
              message: "Please specify valid winnerName",
              status: false
            })
        }

        if (data.playerOneGoal == '' || data.playerOneGoal == null || data.playerOneGoal == undefined) {
          return res
            .status(400)
            .send({
              message: "Please specify valid playerOneGoal",
              status: false
            })
        }

        if (data.playerTwoGoal == '' || data.playerTwoGoal == null || data.playerTwoGoal == undefined) {
          return res
            .status(400)
            .send({
              message: "Please specify valid playerTwoGoal",
              status: false
            })
        }

        if (data.playerOneMatchDuration == '' || data.playerOneMatchDuration == null || data.playerOneMatchDuration == undefined) {
          return res
            .status(400)
            .send({
              message: "Please specify valid playerOneMatchDuration",
              status: false
            })
        }

        if (data.playerTwoMatchDuration == '' || data.playerTwoMatchDuration == null || data.playerTwoMatchDuration == undefined) {
          return res
            .status(400)
            .send({
              message: "Please specify valid playerTwoMatchDuration",
              status: false
            })
        }

        if (data.matchDuration == '' || data.matchDuration == null || data.matchDuration == undefined) {
          return res
            .status(400)
            .send({
              message: "Please specify valid matchDuration",
              status: false
            })
        }


        Match.findOneAndUpdate({
          roomName: data.roomName,
          matchStatus: 'active',
          _id: data.matchId
        }, {
          winnerName: data.winnerName,
          playerOneGoal: data.playerOneGoal,
          playerTwoGoal: data.playerTwoGoal,
          playerOneMatchDuration: data.playerOneMatchDuration,
          playerTwoMatchDuration: data.playerTwoMatchDuration,
          matchDuration: data.matchDuration,
          matchStatus: finished
        }, {
          upsert: false,
          new: true,
          useFindAndModify: false
        }, function (err, updated) {
          if (updated == null) {
            return res
              .status(400)
              .send({
                message: "Enter valid matchId or roomName",
                status: false
              })
          } else if (err) {
            let msg = "some error occurred"
            reject(msg);
          } else {
            console.log('updatedMatchResult', updated);
            res.json({
              status: 200,
              message: "Match data updated",
              data: updated
            })
            // resolve(updated);
          }
        });

        //});
      } catch (error) {
        console.log(error);
        return res.status(400).send({ "message": "something went wrong", status: false })
      }
    }
  })
}



/*
* --------------------------------------------------------------------------
* user left function
* ---------------------------------------------------------------------------
*/

// exports.userLeft = function (userData) {
//     Match.findOneAndUpdate(
//         { 
//           roomName: userData.roomName
//         },
//         {
//           winnerId: userData.winnerId
//         },
//         { 
//           upsert: true,
//           new: true,
//           useFindAndModify: false
//         },function(err, result) {
//         if(!err) {
//           console.log(result)
//         }
//         else {
//           console.log(err)
//         }
//     });
// }

exports.getInGameFormation = async function (data) {
  let firstPlayerId = data.playerOneId;
  let secondPlayerId = data.playerTwoId;
  console.log(firstPlayerId);
  let result = {};
  result.roomName = data.roomName;
  return new Promise(async (resolve, reject) => {
    result.playerOneFormation = await PlayerGameData.findOne(
      { playerId: firstPlayerId }, { disks: 0 }).exec();

    result.playerTwoFormation = await PlayerGameData.findOne(
      { playerId: secondPlayerId }, { disks: 0 }).exec();
    resolve(result);
  });
}


/*
 * --------------------------------------------------------------------------
 * Last Played Match Results
 * ---------------------------------------------------------------------------
 */

exports.getLastPlayedMatchDetails = async (req, res) => {

  func.checkUserAuthentication(req, res, async function (payload) {
    let matchId = req.body.matchId;

    if (matchId == '' || matchId == null || matchId == undefined) {
      let response = {
        message: 'Please specify valid matchId',
        status: false
      }
      let statusCode = 400
      func.log("getLastPlayedMatchDetails", req.body, statusCode, response)
      return res
        .status(statusCode)
        .send(response)
    }

    try {

      let recentMatchData = await Match.findOne({ _id: matchId }).lean();

      if(_.isEmpty(recentMatchData)) {
        
        let response = {
          message: 'no data found',
          status: false
        }
        let statusCode = 400
        func.log("getLastPlayedMatchDetails", req.body, statusCode, response)
        return res
          .status(statusCode)
          .send(response)
      }

      if (recentMatchData.matchStatus == 'finished' && recentMatchData.matchType == 'oneononeBet') {

        if (recentMatchData.winnerName == recentMatchData.playerOneUserName) {

          Match.findOneAndUpdate({ _id: matchId }, { $set: { playerTwoAmount: 0 } },
            {
              upsert: false,
              new: true,
              useFindAndModify: false
            }).exec((err, result) => {
              if (err) {
                let response = {
                  message: 'something went wrong',
                  status: false
                }
                let statusCode = 400
                func.log("getLastPlayedMatchDetails", req.body, statusCode, response)
                return res
                  .status(statusCode)
                  .send(response)
                
              } else {
                let response = {
                  status: true,
                  message: "Match data found",
                  data: result
                }
        
                statusCode = 200
        
                func.log("getLastPlayedMatchDetails", req.body, statusCode, response)
                res
                  .status(statusCode)
                  .send(response)
                
              }
            })

        } else if (recentMatchData.winnerName == recentMatchData.playerTwoUserName) {

          Match.findOneAndUpdate({ _id: matchId }, { $set: { playerOneAmount: 0 } },
            {
              upsert: false,
              new: true,
              useFindAndModify: false
            }).exec((err, result) => {
              if (err) {
                let response = {
                  message: 'something went wrong',
                  status: false
                }
                let statusCode = 400
                func.log("getLastPlayedMatchDetails", req.body, statusCode, response)
                return res
                  .status(statusCode)
                  .send(response)
              } else {
                let response = {
                  status: true,
                  message: "Match data found",
                  data: result
                }
        
                statusCode = 200
        
                func.log("getLastPlayedMatchDetails", req.body, statusCode, response)
                res
                  .status(statusCode)
                  .send(response)
                
              }
            })
        }
      } else {
        let response = {
          status: true,
          message: "Match data found",
          data: recentMatchData
        }

        statusCode = 200

        func.log("getLastPlayedMatchDetails", req.body, statusCode, response)
        res
          .status(statusCode)
          .send(response)
      }
    } catch (e) {

      let response = {
        message: e.message,
        status: false
      }
      let statusCode = 400
      func.log("getLastPlayedMatchDetails", req.body, statusCode, response)
      return res
        .status(statusCode)
        .send(response)
    }
  });
}

/*
 * --------------------------------------------------------------------------
 * getAllUnfinishedMatches API start
 * ---------------------------------------------------------------------------
 */

exports.listAllUnfinishedMatches = async (req, res) => {
  console.log('inside getAllUnfinishedMatches');
  func.checkUserAuthentication(req, res, async function (payload) {
    
      try {

        let date = new Date();
        let ISOdate = date.toISOString();

        let currentTime = moment().subtract(7200, 'seconds').toISOString();
        console.log('currentTime 510',currentTime);

        let unfinishedMatches = await Match.find({

            matchStatus : 'active' 
            // updatedAt: { $lte: currentTime}

         }).lean();

         if(_.isEmpty(unfinishedMatches)) {

          return res.status(400).send({ message: "no data found", status: false });
        
         } else {
           console.log(unfinishedMatches.length)
          res.json({
            status: true,
            message: "Unfinished Matches",
            data: unfinishedMatches
          })
         }

      } catch (error) {
        console.log(error);
        return res.status(400).send({ "message": "something went wrong", status: false })
      }
  })
}


/*
 * --------------------------------------------------------------------------
 * getMatchDetails API start
 * ---------------------------------------------------------------------------
 */

exports.getMatchDetails = async (req, res) => {
  console.log('inside getMatchDetails');
  func.checkUserAuthentication(req, res, async function (payload) {
    let matchId = req.query.matchId;
    let detailsObj = {};
    // let details = [];

    if (_.isEmpty(matchId)) {
      return res.status(400).send({ message: "please specify match id", status: false });

    }

    try {
      let matchStateDetails;

      let MatchDetails = await OneOnOneData.find({ matchId: matchId }).lean();
      console.log('inside MatchDetails', MatchDetails);

      let matchInfo = await Match.findOne({ _id: matchId }).lean();

      if (_.isEmpty(matchInfo)) {
        return res.status(200).send({ message: "no match data found", status: false });

      }

      if (_.isEmpty(MatchDetails)) {

        // return res.status(400).send({ message: "no match data found", status: false });

        matchStateDetails = await MatchState.findOne({ matchId: matchId, senderId: 'obs1' }).sort({ udatedAt: -1 }).lean();

        console.log('inside matchStateDetails', matchStateDetails);

        if (!_.isEmpty(matchStateDetails)) {

          detailsObj = {

            roomName: matchInfo.roomName,
            playerOneUserName: matchInfo.playerOneUserName,
            playerTwoUserName: matchInfo.playerTwoUserName,
            matchType: matchInfo.matchType
          }

          if (detailsObj.matchType == 'oneononeBet') {
            detailsObj.oneonone = matchInfo.oneonone;

          } else if (detailsObj.matchType == 'leagueGamePlay') {
            detailsObj.leagueId = matchInfo.leagueId;

          } else {
            return res.status(400).send({ message: "need proper matchType", status: false });
          }

          detailsObj.secretID = matchInfo.secretID;
          // detailsObj.isGameValid = req.query.isGameValid;

          if (matchStateDetails.winnerName) {
            detailsObj.winnerName = matchStateDetails.winnerName;

          } else if (detailsObj.playerOneGoal > detailsObj.playerTwoGoal) {
            detailsObj.winnerName = detailsObj.playerOneUserName;

          } else {
            detailsObj.winnerName = detailsObj.playerTwoUserName;

          }

          res.json({
            status: true,
            message: "Match details",
            data: [{...matchStateDetails,...detailsObj},{...matchStateDetails,...detailsObj}]
          })

        } else if (_.isEmpty(matchStateDetails)) {

          matchStateDetails = await MatchState.find({ matchId: matchId, senderId: { $ne: 'obs1' } }).sort({ udatedAt: -1 }).lean();

          if (_.isEmpty(matchStateDetails)) {
            return res.status(200).send({ message: "no match state data found", status: false });

          }

          // if (matchStateDetails.senderId = matchInfo.playerOneUserName) {

          //   var p1detailsObj = {

          //     ...matchStateDetails,
          //     roomName: matchInfo.roomName,
          //     playerOneUserName: matchInfo.playerOneUserName,
          //     playerTwoUserName: matchInfo.playerTwoUserName,
          //     matchType: matchInfo.matchType
          //   }
          // }

          // if (matchStateDetails.senderId = matchInfo.playerTwoUserName) {

            detailsObj = {

              // ...matchStateDetails,
              roomName: matchInfo.roomName,
              playerOneUserName: matchInfo.playerOneUserName,
              playerTwoUserName: matchInfo.playerTwoUserName,
              matchType: matchInfo.matchType
            }

          // }

          // detailsObj = { ...p1detailsObj, ...p2detailsObj };

          if (detailsObj.matchType == 'oneononeBet') {
            detailsObj.oneonone = matchInfo.oneonone;

          } else if (detailsObj.matchType == 'leagueGamePlay') {
            detailsObj.leagueId = matchInfo.leagueId;

          } else {
            return res.status(400).send({ message: "need proper matchType", status: false });
          }

          detailsObj.secretID = matchInfo.secretID;
          // detailsObj.isGameValid = req.body.isGameValid;

          if (matchStateDetails.winnerName) {
            detailsObj.winnerName = matchStateDetails.winnerName;

          } else if (detailsObj.playerOneGoal > detailsObj.playerTwoGoal) {
            detailsObj.winnerName = detailsObj.playerOneUserName;

          } else {
            detailsObj.winnerName = detailsObj.playerTwoUserName;

          }

          res.json({
            status: true,
            message: "Match details",
            data: [{...matchStateDetails,...detailsObj},{...matchStateDetails,...detailsObj}]
          })

        } else {
          return res.status(200).send({ message: "no data found", status: false });

        }
      } else {
        res.json({
          status: true,
          message: "Match details",
          data: MatchDetails
        })
      }

    } catch (error) {
      console.log(error);
      return res.status(400).send({ "message": "something went wrong", status: false });
    }
  })
}

/*
 * --------------------------------------------------------------------------
 * updateOneOnOneResultManually API start
 * ---------------------------------------------------------------------------
 */

exports.updateOneOnOneResultManually = async (req, res) => {
  console.log('inside updateOneOnOneResultManually');
  func.checkUserAuthentication(req, res, async function (payload) {
    let winLoseData = req.body;

    if(_.isEmpty(winLoseData)){
      return res.status(400).send({ message: "bad request", status: false });
    } else {
    
    try {
      let update = await upadteoneononedata(winLoseData,payload);

      console.log('upadte',update);

      res.json({
        status: true,
        message: "Match results updated successfully",
        data: update
      })

    } catch (error) {
      console.log(error);
      return res.status(400).send({ "message": "something went wrong", status: false })
    } 
  }

  })
}

var upadteoneononedata = async function updateOneOnOneLeaderBoardData(winLoseData, payload) {
  console.log('inside oneonone update');
  try {
    var matchDataUpdate = await Match.findOneAndUpdate({
      matchStatus: 'active',
      _id: winLoseData.matchId
    }, {
      winnerName: winLoseData.winnerName,
      playerOneGoal: winLoseData.playerOneGoal,
      playerTwoGoal: winLoseData.playerTwoGoal,
      playerOneMatchDuration: winLoseData.playerOneMatchDuration,
      playerTwoMatchDuration: winLoseData.playerTwoMatchDuration,
      matchDuration: winLoseData.matchDuration,
      matchStatus: 'finished'
    }, {
      upsert: false,
      new: true,
      useFindAndModify: false
    })
    if (_.isEmpty(matchDataUpdate)) {
      console.log('matchupdate 711');

      console.log('Enter valid matchId or roomName');
      return;

    }

    if(winLoseData.isGameValid == false) {

      var updateGamePlayChanceP1 = await func.addOneOnOneFreeBetsCount(winLoseData.playerOneUserName, winLoseData.oneonone);
      var updateGamePlayChanceP2 = await func.addOneOnOneFreeBetsCount(winLoseData.playerTwoUserName, winLoseData.oneonone);

      console.log('invalid match');
      return;
    }

    let p1Obj = {};
    let p2Obj = {};
    var winPoints = 5;
    var lossPoints = -0.25;
    var goalPoints = 1;
    var goalLosePoints = -0.5;
    var goalDiffPoints = 1.5;
    var cSpoints = 3;
    var matchPlayPoints = 1;

    let matchData = winLoseData;

    var p1winCount = 0;
    var p1winPoints = 0;
    var p1winStreak = 0;
    var p2winCount = 0;
    var p2winPoints = 0;
    var p2winStreak = 0;

    var p1lossCount = 0;
    var p1lossPoints = 0;
    var p2lossCount = 0;
    var p2lossPoints = 0;

    var p1goalFor = 0;
    var p1GFpts = 0;
    var p2goalFor = 0;
    var p2GFpts = 0;


    var p1goalAgainst = 0;
    var p1GApts = 0;
    var p2goalAgainst = 0;
    var p2GApts = 0;

    var p1cleanSheet = 0;
    var p1CsPoints = 0;
    var p2cleanSheet = 0;
    var p2CsPoints = 0;

    var p1matchesPlayed = 0;
    var p1GPpts = 0;
    var p2matchesPlayed = 0;
    var p2GPpts = 0;

    var p1goalDiff = 0;
    var p1GDPoints = 0;
    var p2goalDiff = 0;
    var p2GDPoints = 0;

    var p1totalPoints = 0;
    var p2totalPoints = 0;


    if (matchData.playerTwoGoal != 0 || matchData.playerOneGoal != 0) {
      if (matchData.playerTwoGoal == 0) {
        p1cleanSheet++;
        p1CsPoints = p1CsPoints + cSpoints;
      }
    } else {
      p1cleanSheet = p1cleanSheet + p1cleanSheet;
    }

    if (matchData.playerTwoGoal != 0 || matchData.playerOneGoal != 0) {
      if (matchData.playerOneGoal == 0) {
        p2cleanSheet++;
        p2CsPoints = p2CsPoints + cSpoints;
      }
    } else {
      p2cleanSheet = p2cleanSheet + p2cleanSheet;
    }

    if (matchData.winnerName == matchData.playerOneUserName) {
      p1winStreak++;
      p2winStreak = 0;
      p1winCount++;
      p1winPoints = p1winPoints + winPoints;
    }

    if (matchData.winnerName == matchData.playerTwoUserName) {
      p2winStreak++;
      p1winStreak = 0;
      p2winCount++;
      p2winPoints = p2winPoints + winPoints;
    }

    if (matchData.winnerName == matchData.playerOneUserName) {
      p2lossCount++;
      p2lossPoints = p2lossPoints + lossPoints;
    }

    if (matchData.winnerName == matchData.playerTwoUserName) {
      p1lossCount++;
      p1lossPoints = p1lossPoints + lossPoints;
    }


    p1goalAgainst =
      parseInt(p1goalAgainst) + parseInt(matchData.playerTwoGoal);

    p2goalAgainst =
      parseInt(p2goalAgainst) + parseInt(matchData.playerOneGoal);

    p1goalFor = parseInt(p1goalFor) + parseInt(matchData.playerOneGoal);

    p2goalFor = parseInt(p2goalFor) + parseInt(matchData.playerTwoGoal);

    p1goalDiff = p1goalFor - p1goalAgainst;

    p1GDPoints = p1goalDiff * goalDiffPoints;

    p2goalDiff = p2goalFor - p2goalAgainst;

    p2GDPoints = p2goalDiff * goalDiffPoints;

    p1matchesPlayed = p1winCount + p1lossCount;

    p2matchesPlayed = p2winCount + p2lossCount;

    p1Obj.gameId = matchData.oneonone;
    p1Obj.gameType = matchData.matchType;
    p1Obj.playerName = matchData.playerOneUserName;
    p1Obj.win = p1winCount;
    p1Obj.loss = p1lossCount;
    p1Obj.goalFor = p1goalFor;
    p1Obj.goalAgainst = p1goalAgainst;
    p1Obj.cleanSheet = p1cleanSheet;
    p1Obj.goalDiff = p1goalDiff;
    p1Obj.matchesPlayed = p1matchesPlayed;
    p1Obj.winPoints = p1winPoints;
    p1Obj.lossPoints = p1lossPoints;
    p1Obj.cSpoints = p1CsPoints;
    p1Obj.winStreak = p1winStreak;
    p1Obj.currentWinStreak = p1winStreak;
    p1Obj.matchId = winLoseData.matchId;

    var firstPlayer = await Player.findOne({ userName: p1Obj.playerName }).lean();

    p1Obj.bettingCompanyId = firstPlayer.bettingCompanyId;
    console.log('p1Obj.bettingCompanyId 860', p1Obj.bettingCompanyId);

    // p1Obj.highestWinStreak = p1Obj.currentWinStreak;

    p2Obj.gameId = matchData.oneonone;
    p2Obj.gameType = matchData.matchType;
    p2Obj.playerName = matchData.playerTwoUserName;
    p2Obj.win = p2winCount;
    p2Obj.loss = p2lossCount;
    p2Obj.goalFor = p2goalFor;
    p2Obj.goalAgainst = p2goalAgainst;
    p2Obj.cleanSheet = p2cleanSheet;
    p2Obj.goalDiff = p2goalDiff;
    p2Obj.matchesPlayed = p2matchesPlayed;
    p2Obj.winPoints = p2winPoints;
    p2Obj.lossPoints = p2lossPoints;
    p2Obj.cSpoints = p2CsPoints;
    p2Obj.winStreak = p2winStreak;
    p2Obj.currentWinStreak = p2winStreak;
    p2Obj.matchId = winLoseData.matchId;

    var secondPlayer = await Player.findOne({ userName: p2Obj.playerName }).lean();

    p2Obj.bettingCompanyId = secondPlayer.bettingCompanyId;
    console.log('p2Obj.bettingCompanyId 884', p2Obj.bettingCompanyId);
    // p2Obj.highestWinStreak = p2Obj.currentWinStreak;

    var updatedPlayer1 = p1Obj;
    var updatedPlayer2 = p2Obj;

    if (p1Obj.matchesPlayed >= 1) {
      p1GPpts = p1GPpts + p1Obj.matchesPlayed * matchPlayPoints;
    } else {
      p1GPpts = p1GPpts;
    }

    if (p2Obj.matchesPlayed >= 1) {
      p2GPpts = p2GPpts + p2Obj.matchesPlayed * matchPlayPoints;
    } else {
      p2GPpts = p2GPpts;
    }

    if (p1Obj.goalFor >= 1) {
      p1GFpts = p1GFpts + p1Obj.goalFor * goalPoints;
    } else {
      p1GFpts = p1GFpts;
    }

    if (p2Obj.goalFor >= 1) {
      p2GFpts = p2GFpts + p2Obj.goalFor * goalPoints;
    } else {
      p2GFpts = p2GFpts;
    }

    if (p1Obj.goalAgainst >= 1) {
      p1GApts = p1GApts + p1Obj.goalAgainst * goalLosePoints;
    } else {
      p1GApts = p1GApts;
    }

    if (p2Obj.goalAgainst >= 1) {
      p2GApts = p2GApts + p2Obj.goalAgainst * goalLosePoints;
    } else {
      p2GApts = p2GApts;
    }

    p1totalPoints =
      p1totalPoints +
      (p1winPoints +
        p1lossPoints +
        p1CsPoints +
        p1GFpts +
        p1GApts +
        p1GPpts +
        p1GDPoints);

    p1Obj.GFpts = p1GFpts;
    p1Obj.GApts = p1GApts;
    p1Obj.GPpts = p1GPpts;
    p1Obj.GDpts = p1GDPoints;
    p1Obj.points = p1totalPoints;

    p2totalPoints =
      p2totalPoints +
      (p2winPoints +
        p2lossPoints +
        p2CsPoints +
        p2GFpts +
        p2GApts +
        p2GPpts +
        p2GDPoints);

    p2Obj.GFpts = p2GFpts;
    p2Obj.GApts = p2GApts;
    p2Obj.GPpts = p2GPpts;
    p2Obj.GDpts = p2GDPoints;
    p2Obj.points = p2totalPoints;

    p1durationInSeconds = parseFloat(matchData.playerOneMatchDuration ? matchData.playerOneMatchDuration : 0);
    p2durationInSeconds = parseFloat(matchData.playerTwoMatchDuration ? matchData.playerTwoMatchDuration : 0);

    p1Obj.pointsPerMinute = !isNaN(p1Obj.pointsPerMinute) ? p1Obj.pointsPerMinute : 0
    p2Obj.pointsPerMinute = !isNaN(p2Obj.pointsPerMinute) ? p2Obj.pointsPerMinute : 0

    var searchP1Obj = {
      playerName: p1Obj.playerName,
      gameType: p1Obj.gameType
    };

    var searchP2Obj = {
      playerName: p2Obj.playerName,
      gameType: p2Obj.gameType
    };

    if (p1Obj.gameId) {
      searchP1Obj = await func.checkAuthorizedPlayerForBet(p1Obj, 1, matchData.winnerName);
    }

    if (p2Obj.gameId) {
      searchP2Obj = await func.checkAuthorizedPlayerForBet(p2Obj, 2, matchData.winnerName)
    }

    var playerOneData = await LeaderBoard.findOne(searchP1Obj.searchObj).exec();
    var playerTwoData = await LeaderBoard.findOne(searchP2Obj.searchObj).exec();
    // var player1FinalData, player2FinalData;
    var p1PPM, p2PPM;


    if (playerTwoData) {
      if (p2winStreak == 0) {
        playerTwoData.currentWinStreak = 0;
      } else {
        playerTwoData.currentWinStreak = p2winStreak + playerTwoData.currentWinStreak;
        if (playerTwoData.currentWinStreak == 2) {
          playerTwoData.highestWinStreak = playerTwoData.currentWinStreak + playerTwoData.highestWinStreak;
        }
        else if (playerTwoData.currentWinStreak > 2 && p2winStreak == 1) {
          playerTwoData.highestWinStreak = playerTwoData.highestWinStreak + 1;
        }
      }
      playerTwoData = await func.assignPlayerData(playerTwoData, updatedPlayer2, p2GFpts, p2GApts, p2GPpts, p2GDPoints, p2totalPoints)
    }

    if (playerOneData) {
      if (p1winStreak == 0) {
        playerOneData.currentWinStreak = 0;
      } else {
        playerOneData.currentWinStreak = p1winStreak + playerOneData.currentWinStreak;
        if (playerOneData.currentWinStreak == 2) {
          playerOneData.highestWinStreak = playerOneData.currentWinStreak + playerOneData.highestWinStreak;
        }
        else if (playerOneData.currentWinStreak > 2 && p1winStreak == 1) {
          playerOneData.highestWinStreak = playerOneData.highestWinStreak + 1;
        }
      }
      playerOneData = await func.assignPlayerData(playerOneData, updatedPlayer1, p1GFpts, p1GApts, p1GPpts, p1GDPoints, p1totalPoints)

    }

    let p1Data = _.isEmpty(playerOneData) ? p1matchesPlayed : playerOneData.matchesPlayed;
    let p2Data = _.isEmpty(playerTwoData) ? p2matchesPlayed : playerTwoData.matchesPlayed;

    p1Obj.points = _.isEmpty(playerOneData) ? p1Obj.points : playerOneData.points;
    p2Obj.points = _.isEmpty(playerTwoData) ? p2Obj.points : playerTwoData.points;


    var temp = await func.calculatePPM(p1durationInSeconds, p2durationInSeconds, p1Data, p2Data, p1Obj, p2Obj, matchData);

    p1PPM = temp.p1;
    p2PPM = temp.p2;

    if (playerOneData && playerOneData.matchesPlayed > 1) {
      let tmp = (playerOneData.pointsPerMinute + parseFloat(p1PPM)) / playerOneData.matchesPlayed;
      playerOneData.avgPointsPerMinute = tmp.toFixed(4);
      playerOneData.pointsPerMinute = playerOneData.pointsPerMinute + parseFloat(p1PPM);
      playerOneData.matchId = winLoseData.matchId;
      player1FinalData = await playerOneData.save();
    }
    else {
      p1Obj.pointsPerMinute = p1PPM;
      p1Obj.avgPointsPerMinute = p1PPM.toFixed(4);
      var leaderBoard = new LeaderBoard(p1Obj);
      player1FinalData = await leaderBoard.save();
    }


    if (playerTwoData && playerTwoData.matchesPlayed > 1) {
      let temp = (playerTwoData.pointsPerMinute + parseFloat(p2PPM)) / playerTwoData.matchesPlayed;
      playerTwoData.avgPointsPerMinute = (temp).toFixed(4);
      playerTwoData.pointsPerMinute = playerTwoData.pointsPerMinute + parseFloat(p2PPM);
      playerTwoData.matchId = winLoseData.matchId;
      player2FinalData = await playerTwoData.save();
    }
    else {
      p2Obj.pointsPerMinute = p2PPM;
      p2Obj.avgPointsPerMinute = p2PPM.toFixed(4);
      var leaderBoard = new LeaderBoard(p2Obj);
      player2FinalData = await leaderBoard.save()
    }

    console.log('1060 winLoseData', winLoseData);

    var getData = await OneonOne.findOne({ _id: winLoseData.oneonone }).lean();

    console.log('getData 1064', getData);

    if (searchP1Obj.winCount + searchP1Obj.lossCount == getData.gameCount) {
      console.log('searchP1Obj in if', searchP1Obj);

      let beyonicCurrencyData = await func.getLocalCurrencyCoversionDetails(
        payload
      );
      beyonicCurrencyData = await func.getLocalCurrencyConversionDetailsAsPerGameRegionType(getData, beyonicCurrencyData)
      let prize = getData.prize[searchP1Obj.winCount]
      prize = prize * beyonicCurrencyData['usd_rate'];

      if (prize > 0){
        await creditToWallet(searchP1Obj.player._id, searchP1Obj.player.bettingCompanyId, prize, prize, winLoseData.matchId, 'Won OneOnOne ' + getData.gameName, 'successful', true)
      }
    }

    if (searchP2Obj.winCount + searchP2Obj.lossCount == getData.gameCount) {
      console.log('searchP2Obj in if', searchP2Obj);

      let beyonicCurrencyData = await func.getLocalCurrencyCoversionDetails(
        payload
      );
      beyonicCurrencyData = await func.getLocalCurrencyConversionDetailsAsPerGameRegionType(getData, beyonicCurrencyData)
      let prize = getData.prize[searchP2Obj.winCount]
      prize = prize * beyonicCurrencyData['usd_rate'];
      if (prize > 0){
        await creditToWallet(searchP2Obj.player._id, searchP2Obj.player.bettingCompanyId, prize, prize, winLoseData.matchId, 'Won OneOnOne ' + getData.gameName, 'successful', true)
      }
    }
    var dataArray = [];
    dataArray.push(player1FinalData);
    dataArray.push(player2FinalData);

    return dataArray;

    //  res.json({
    //     status: true,
    //     message: 'Match end  and Leader board data updated',
    //     data: {
    //     player1data: player1FinalData,
    //     player2data: player2FinalData
    //     }
    //   });

  } catch (error) {
    console.log('catch 1106', error);
    // return 
    //   .status(400)
    //   .send({ message: error.message, status: false });
  }
  // }
  // }
  // });
};