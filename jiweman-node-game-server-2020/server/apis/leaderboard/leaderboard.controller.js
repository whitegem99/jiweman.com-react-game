let func = require("../common/commonfunction");
let sendResponse = require("../common/sendresponse");
let logger = require("../../logger/log");
var mongoose = require("mongoose");
let Player = require("../playerAuth/player.model").Player;
let Role = require("../playerAuth/player.model").Role;
var country = require("../playerAuth/player.model").country;
let Match = require("../matchPlay/matchplay.model").Match;
let Leaderboard = require("../leaderboard/leaderboard.model").LeaderBoard;
var PlayerLeague = require("../playerLeague/playerLeague.model").playerLeague;
var ObjectID = require("mongodb").ObjectID;
var League = require("../league/league.model").League;
var _ = require("lodash");
const { playerBet } = require('../playerOneVSOneBet/playerOneVSOneBet.model');
const OneonOne = require('../oneonone/oneonone.model').OneOnOne;
let moment = require('moment');


/*
 * --------------------------------------------------------------------------
 * GET leader board API start
 * ---------------------------------------------------------------------------
 */

// exports.leaderboard = (req, res) => {
//   console.log("inside leaderboard");

//   let loggedInplayerId;
//   var loggedInPlayerArray = [];
//   let sortBy;
//   var skip;
//   var limit;
//   let gameType;
//   let leagueId;
//   var searchObject;
//   skip = req.query.skip;
//   limit = req.query.limit;
//   gameType = req.query.gameType;
//   leagueId = req.query.leagueId;
//   sortBy = req.query.sortBy;

//   if (req.query) {
//     if (!req.query.sortBy) {
//       sortBy = "points";
//     }

//     if (sortBy != "goalAgainst") {
//       sortBy = "-" + sortBy;
//     }

//     if (gameType == null || gameType == undefined) {
//       return res.status(400).send({
//         message: "Please specify gameType",
//         status: false,
//       });
//     }
//   }

//   sortObj = {
//     points: -1,
//     win: -1,
//     avgPointsPerMinute: -1,
//     cleanSheet: -1,
//     highestWinStreak: -1,
//     goalDiff: -1,
//     goalFor: -1,
//     goalAgainst: 1,
//   };

//   func.checkUserAuthentication(req, res, async function (payload) {
//     loggedInplayerId = payload.sub.toObjectId();
//     try {
//       var LoggedInPlayerData = await Player.findOne({ _id: loggedInplayerId })
//       if (gameType == "leagueGamePlay") {
//         if (leagueId) {
//           searchObject = { gameType: gameType, leagueId: leagueId };
//           if (!req.query.sortBy) {
//             sortBy = sortObj;
//           }
//         } else {
//           return res.status(400).send({
//             message: "Please specify leagueId",
//             status: false,
//           });
//         }
//       } else {
//         searchObject = { gameType: gameType };
//       }

//       var result = await Leaderboard.find(searchObject).sort(sortBy).skip(parseInt(skip))
//       .limit(parseInt(limit)).lean();

//       if (result.length == 0) {
//         return res.status(400).send({
//           message: "data not found",
//           status: false,
//         });
//       }  

//       if (gameType == "leagueGamePlay") {
//         playerLeagueData = await PlayerLeague.find({
//           leagueId: leagueId,
//         })
//           .sort({ _id: 1 })
//           .populate("userId", "userName")
//           .lean();
      
//           console.log(playerLeagueData);
//           console.log(">>>>>>>>>>>>>>");
//        var leagueData =  await League.findOne({_id: leagueId});
//         console.log(leagueData)

//        if(leagueData && leagueData.allowedCountries.length==1){
//          console.log("110")
//         var beynoicAmountCoversionData = await func.getLocalCurrencyCoversionDetails(
//           payload
//         );
//         beynoicAmountCoversionData = _.isEmpty(beynoicAmountCoversionData)? 1: beynoicAmountCoversionData;
//         var prizeLimit = leagueData.numberOfPrizes;
//         if (prizeLimit > result.length) {
//           prizeLimit = result.length;
//         }
//         var i = 0;
//         var prizes = leagueData.prize;
//         while (i != prizeLimit) {
//           result[i].prize = parseFloat(
//             (prizes[i] -
//               prizes[i] * func.getCurrencyConversionRisk(leagueData[0])) *
//               beynoicAmountCoversionData.usd_rate
//           ).toFixed(2);
//           i++;
//         }
//        }
//        else{
//          console.log("129")
//         var prizeLimit = leagueData.numberOfPrizes;
//         if (prizeLimit > result.length) {
//           prizeLimit = result.length;
//         }
//         var i = 0;
//         var prizes = leagueData.prize;
//         console.log("prizeds...")
//         console.log(typeof leagueData.prize)
//         while (i != prizeLimit) {
//           console.log(prizes[i]);
//           result[i]['prize'] = prizes[i];
//           i++;
//         }
//        }
//     }
//       if (!LoggedInPlayerData) {
//            if (gameType == "leagueGamePlay") {
//             res.json({
//             status: 200,
//             message: "Data Found",
//             data: result,
//           });
//          }
//         }
//         else if(LoggedInPlayerData){
//           var loggedInPlayerSearchObj = {
//             playerName: LoggedInPlayerData.userName,
//             gameType: gameType,
//           };
//          var getLoggedInPlayerLeaderboardData =  await Leaderboard.findOne(loggedInPlayerSearchObj).lean();
//          if(!_.isEmpty(getLoggedInPlayerLeaderboardData)){
//          loggedInPlayerArray.push(getLoggedInPlayerLeaderboardData);  
//          } 
        
//          res.json({
//           status: 200,
//           message: "Data Found",
//           LoggedInPlayerData:loggedInPlayerArray, 
//           data:  result,
//         });
//         } 
//         } catch (err) {
//           console.log(err);
//           return res.json({
//             success: false,
//             message: err.toString(),
//           });
//         }
//       })
    
// };


exports.leaderboard = (req, res) => {
  console.log("inside leaderboard");

  let loggedInplayerId;
  var loggedInPlayerArray = [];
  let sortBy;
  var skip;
  var limit;
  let gameType;
  let leagueId;
  var searchObject;
  skip = req.query.skip;
  limit = req.query.limit;
  gameType = req.query.gameType;
  leagueId = req.query.leagueId;
  sortBy = req.query.sortBy;
  gameId = req.query.gameId

  // console.log(sortBy);
  // console.log("32424224342");
  sortObj = {
    points: -1,
    win: -1,
    avgPointsPerMinute: -1,
    cleanSheet: -1,
    highestWinStreak: -1,
    goalDiff: -1,
    goalFor: -1,
    goalAgainst: 1,
  };

  func.checkUserAuthentication(req, res, async function (payload) {
    console.log(payload);
    loggedInplayerId = payload.sub.toObjectId();
    Player.findOne({ _id: loggedInplayerId,
    }, async function (
      err,
      LoggedInPlayerData
    ) {
      var playerLeagueData;
      if (err) {
        let response = {
          message: 'No such Player exist',
          status: false
        }
        let statusCode = 400
        func.log("leaderboard", req.body, statusCode, response)
        return res
          .status(statusCode)
          .send(response)
      } else {
        try {
          if (req.query) {
            if (!req.query.sortBy) {
              sortBy = "points";
            }

            if (sortBy != "goalAgainst") {
              sortBy = "-" + sortBy;
            }

            if (gameType == null || gameType == undefined) {
              let response = {
                message: 'Please specify gameType',
                status: false
              }
              let statusCode = 400
              func.log("leaderboard", req.body, statusCode, response)
              return res
                .status(statusCode)
                .send(response)
            }
          }

          if (gameType == "leagueGamePlay") {
            // console.log(leagueId);
            // console.log(loggedInplayerId);
            if (leagueId) {
              searchObject = { gameType: gameType, leagueId: leagueId };
              if (!req.query.sortBy) {
                sortBy = sortObj;
              }
            } else {
              let response = {
                message: 'Please specify leagueId',
                status: false
              }
              let statusCode = 400
              func.log("leaderboard", req.body, statusCode, response)
              return res
                .status(statusCode)
                .send(response)
            }
          }
          else if(gameType=='oneononeBet'){
            if (gameId) {
              searchObject = { gameType: gameType, gameId: gameId };
              if (!req.query.sortBy) {
                sortBy = sortObj;
              }
            } else {
              let response = {
                message: 'Please specify gameId',
                status: false
              }
              let statusCode = 400
              func.log("leaderboard", req.body, statusCode, response)
              return res
                .status(statusCode)
                .send(response)
            }
          }
           else {
            searchObject = { gameType: gameType, bettingCompanyId: payload.bettingCompanyId };
          }
          console.log(">>>>>>>>>>>>>>>>>>>");
          console.log(searchObject);
          if (!LoggedInPlayerData) {
            Leaderboard.find(searchObject)
              .sort(sortBy)
              .skip(parseInt(skip))
              .limit(parseInt(limit))
              .exec(async (err, result) => {
                if (err) {
                  let response = {
                    message: 'No such Player exist',
                    status: false
                  }
                  let statusCode = 400
                  func.log("leaderboard", req.body, statusCode, response)
                  return res
                    .status(statusCode)
                    .send(response)
                } else if (result.length == 0) {
                  let response = {
                    message: 'data not found',
                    status: false
                  }
                  let statusCode = 400
                  func.log("leaderboard", req.body, statusCode, response)
                  return res
                    .status(statusCode)
                    .send(response)
                } else {

                  var result = JSON.parse(JSON.stringify(result));

                  console.log(result)

                  let groupResult = _.groupBy(result,function(row){

                    return row.leagueId + row.playerName + row.leagueRound

                  })
                  let tempResult = []
                  _.forOwn(groupResult,function(values,key){

                    let highestTimeStamp = null

                    _.map(values,function(item){

                      if (!highestTimeStamp){

                        highestTimeStamp = item.updatedAt

                      }else{

                        if(moment(item.updatedAt) > moment(highestTimeStamp)){
                          highestTimeStamp = item.updatedAt
                        }
                      }

                    })
                    _.map(values,function(item){

                      if (item.updatedAt == highestTimeStamp){

                        highestTimeStamp = item.updatedAt
                        tempResult.push (item)
                      }

                    })

                  })
                  console.log(">>>>>>")
                  console.log(tempResult)

                  result = tempResult

                  result.sort((a,b) => b.points - a.points || b.win - a.win || b.avgPointsPerMinute - a.avgPointsPerMinute || b.cleanSheet - a.cleanSheet || b.highestWinStreak - a.highestWinStreak  || b.goalDiff - a.goalDiff || b.goalFor - a.goalFor || b.goalAgainst - a.goalAgainst  )

                  
                  if (gameType == "leagueGamePlay") {
                    
                    playerLeagueData = await PlayerLeague.find({
                      leagueId: leagueId,
                    })
                      .sort({ _id: 1 })
                      .populate("userId", "userName")
                      .lean();

                    League.find({ _id: leagueId }).exec(
                      async (err, leagueData) => {
                        if (err) {
                          let response = {
                            message: 'Something went wrong',
                            status: false
                          }
                          let statusCode = 400
                          func.log("leaderboard", req.body, statusCode, response)
                          return res
                            .status(statusCode)
                            .send(response)
                        } else {
                          console.log("found leagues")
                          console.log(leagueData)
                          console.log(payload)
                          if (leagueData[0].allowedCountries.length == 1) {
                            payload.country = leagueData[0].allowedCountries[0]
                            var beynoicAmountCoversionData = await func.getLocalCurrencyCoversionDetails(
                              payload
                            );
                            console.log("beynoicAmountCoversionData")
                            console.log(beynoicAmountCoversionData)
                            if (!beynoicAmountCoversionData) {
                              beynoicAmountCoversionData = {
                                'usd_rate' : 1
                              };
                            }
                            beynoicAmountCoversionData = await func.getLocalCurrencyConversionDetailsAsPerGameRegionType(leagueData[0], beynoicAmountCoversionData)
                            // console.log(beynoicAmountCoversionData.usd_rate);
                            var prizeLimit = leagueData[0].numberOfPrizes;
                            if (prizeLimit > result.length) {
                              prizeLimit = result.length;
                            }
                            var i = 0;
                            var prizes = leagueData[0].prize;

                            while (i != prizeLimit) {
                              result[i].prize = parseInt(
                                prizes[i] * beynoicAmountCoversionData.usd_rate
                              );
                              i++;
                            }
                          } else {
                            var prizeLimit = leagueData[0].numberOfPrizes;
                            if (prizeLimit > result.length) {
                              prizeLimit = result.length;
                            }
                            var i = 0;
                            var prizes = leagueData[0].prize;

                            while (i != prizeLimit) {
                              result[i].prize = parseInt(prizes[i]);
                              i++;
                            }
                          }

                          let response = {
                            status: true,
                            message: "Data Found",
                            data: _.isEmpty(result) ? [] : result,
                          }
                  
                          statusCode = 200
                  
                          func.log("leaderboard", req.body, statusCode, response)
                          res
                            .status(statusCode)
                            .send(response)

                        }
                      }
                    );
                  } else if(gameType=='oneononeBet') {
                   
                    playerLeagueData = await playerBet.find({
                      gameId: gameId,
                    })
                      .sort({ _id: 1 })
                      .populate("userId", "userName")
                      .lean();
                    console.log("374LLLLLLLLLLLLLl")
                    console.log(playerLeagueData)  
                    OneonOne.find({ _id: gameId }).exec(
                      async (err, gameData) => {
                        if (err) {
                          let response = {
                            message: 'Something went wrong',
                            status: false
                          }
                          let statusCode = 400
                          func.log("leaderboard", req.body, statusCode, response)
                          return res
                            .status(statusCode)
                            .send(response)
                        } else {
                          if (gameData[0].allowedCountries.length == 1) {
                            payload.country = gameData[0].allowedCountries[0]
                            var beynoicAmountCoversionData = await func.getLocalCurrencyCoversionDetails(
                              payload
                            );
                            if (!beynoicAmountCoversionData) {
                              beynoicAmountCoversionData = {
                                'usd_rate' : 1
                              };
                            }
                            beynoicAmountCoversionData = await func.getLocalCurrencyConversionDetailsAsPerGameRegionType(gameData[0], beynoicAmountCoversionData)
                            // console.log(beynoicAmountCoversionData.usd_rate);
                            var prizeLimit = gameData[0].numberOfPrizes;
                            if (prizeLimit > result.length) {
                              prizeLimit = result.length;
                            }
                            var i = 0;
                            var prizes = gameData[0].prize;
                            result.forEach(info=>{

                              let data = playerLeagueData.filter(item => item.userId.userName.indexOf(info.playerName) !== -1);
                          
                              
                            if(data){
                              let sum =0
                              data.forEach(d=>{
                                sum= sum+parseFloat(
                                  prizes[d.win] *
                                  beynoicAmountCoversionData.usd_rate
                                );
                              })
                              info.prize=sum.toFixed(2);

                             }                                

                            })
                          }            
                          let response = {
                            status: true,
                            message: "Data Found",
                            data: _.isEmpty(result) ? [] : result,
                          }
                  
                          statusCode = 200
                  
                          func.log("leaderboard", req.body, statusCode, response)
                          res
                            .status(statusCode)
                            .send(response)
                        }
                      }
                    );
                  }
                  else{
                    let response = {
                      status: true,
                      message: "Data Found",
                      data: _.isEmpty(result) ? [] : result,
                    }
            
                    statusCode = 200
            
                    func.log("leaderboard", req.body, statusCode, response)
                    res
                      .status(statusCode)
                      .send(response)

                  }
                }
              });
          } else if (LoggedInPlayerData) {
            console.log("445 loggedInPlayer")
            var playerLeagueData;
            var loggedInPlayerSearchObj = {
              playerName: LoggedInPlayerData.userName,
              gameType: gameType,
            };
            if (gameType == "leagueGamePlay") {
              if (leagueId) {
                loggedInPlayerSearchObj["leagueId"] = leagueId;
                playerLeagueData = await PlayerLeague.find({
                  leagueId: leagueId,
                })
                  .sort({ _id: 1 })
                  .populate("userId", "userName")
                  .lean();
              }
              }
              else if(gameType=='oneononeBet'){
                if(gameId){
                  loggedInPlayerSearchObj["gameId"] = gameId;
                  playerLeagueData = await playerBet.find({
                    gameId: gameId,
                  })
                    .sort({ _id: 1 })
                    .populate("userId", "userName")
                    .lean();
                }

              }
              // else{
              //   return res.status(400).send({
              //     message: "Please specify leagueId",
              //     status: false,
              //   });
              //}
              console.log(loggedInPlayerSearchObj)
              console.log(searchObject);
              Leaderboard.findOne(loggedInPlayerSearchObj,{},{ sort: { 'updatedAt' : -1 } })
              .lean()
              .exec((err, result) => {
                if (!_.isEmpty(result)) {
                  loggedInPlayerArray.push(result);
                  console.log(result)
                }

                Leaderboard.find(searchObject)
                  .sort(sortBy)
                  .skip(parseInt(skip))
                  .limit(parseInt(limit))
                  .exec((err, result) => {
                    if (err) {
                      let response = {
                        message: 'No such Player exist',
                        status: false
                      }
                      let statusCode = 400
                      func.log("leaderboard", req.body, statusCode, response)
                      return res
                        .status(statusCode)
                        .send(response)
                    } else if (result.length == 0) {
                      let response = {
                        message: 'data not found',
                        status: false
                      }
                      let statusCode = 400
                      func.log("leaderboard", req.body, statusCode, response)
                      return res
                        .status(statusCode)
                        .send(response)
                    } else {
                      var result = JSON.parse(JSON.stringify(result));

                      if (gameType == "leagueGamePlay") {
                        League.find({ _id: ObjectID(leagueId) }).exec(
                          async (err, leagueData) => {
                           console.log(leagueData);
                            if (err) {
                              let response = {
                                message: 'Something went wrong',
                                status: false
                              }
                              let statusCode = 400
                              func.log("leaderboard", req.body, statusCode, response)
                              return res
                                .status(statusCode)
                                .send(response)
                            } else if (!_.isEmpty(leagueData)) {

                              console.log("========")
                              console.log(result)
                              let groupResult = _.groupBy(result,function(row){

                                return row.leagueId + row.playerName + row.leagueRound

                              })
                              let tempResult = []
                              _.forOwn(groupResult,function(values,key){

                                let highestTimeStamp = null

                                _.map(values,function(item){

                                  if (!highestTimeStamp){

                                    highestTimeStamp = item.updatedAt

                                  }else{

                                    if(moment(item.updatedAt) > moment(highestTimeStamp)){
                                      highestTimeStamp = item.updatedAt
                                    }
                                  }

                                })
                                _.map(values,function(item){

                                  if (item.updatedAt == highestTimeStamp){

                                    highestTimeStamp = item.updatedAt
                                    tempResult.push (item)
                                  }

                                })

                              })
                              console.log(">>>>>>")
                              console.log(tempResult)

                              result = tempResult

                              result.sort((a,b) => b.points - a.points || b.win - a.win || b.avgPointsPerMinute - a.avgPointsPerMinute || b.cleanSheet - a.cleanSheet || b.highestWinStreak - a.highestWinStreak  || b.goalDiff - a.goalDiff || b.goalFor - a.goalFor || b.goalAgainst - a.goalAgainst  )


                              if (leagueData[0].allowedCountries.length == 1) {
                                var beynoicAmountCoversionData = await func.getLocalCurrencyCoversionDetails(
                                  payload
                                );
                                // console.log(beynoicAmountCoversionData.usd_rate);

                                if (beynoicAmountCoversionData == null) {
                                  beynoicAmountCoversionData = {
                                    usd_rate: 1
                                  };
                                }

                                beynoicAmountCoversionData = await func.getLocalCurrencyConversionDetailsAsPerGameRegionType(leagueData[0], beynoicAmountCoversionData)

                                var prizeLimit = !_.isEmpty(leagueData[0])
                                  ? leagueData[0].numberOfPrizes
                                  : 0;

                                if (prizeLimit > result.length) {
                                  prizeLimit = result.length;
                                }
                                var i = 0;
                                var prizes = leagueData[0].prize;

                                while (i != prizeLimit) {
                                  result[i].prize = parseInt(
                                    prizes[i] *
                                    beynoicAmountCoversionData.usd_rate
                                  );
                                  // console.log(result[i].prize);
                                  // console.log("prize >>>>>>");
                                  i++;
                                }
                              } else {
                                var prizeLimit = !_.isEmpty(leagueData[0])
                                  ? leagueData[0].numberOfPrizes
                                  : 0;

                                if (prizeLimit > result.length) {
                                  prizeLimit = result.length;
                                }
                                var i = 0;
                                var prizes = leagueData[0].prize;

                                while (i != prizeLimit) {
                                  result[i].prize = parseInt(prizes[i]);
                                  i++;
                                }
                              }

                              let response = {
                                status: true,
                                message: "Data Found",
                                LoggedInPlayerData: _.isEmpty(
                                  loggedInPlayerArray
                                )
                                  ? []
                                  : loggedInPlayerArray[0],
                                data: _.isEmpty(result) ? [] : result,
                              }
                      
                              statusCode = 200
                      
                              func.log("leaderboard", req.body, statusCode, response)
                              res
                                .status(statusCode)
                                .send(response)
                            
                            }
                          else {
                            let response = {
                              message: 'data not found',
                              status: false
                            }
                            let statusCode = 400
                            func.log("leaderboard", req.body, statusCode, response)
                            return res
                              .status(statusCode)
                              .send(response)
                            }
                          }
                        );
                      }
                      else if(gameType=='oneononeBet'){
                          
                        OneonOne.find({ _id: ObjectID(gameId) }).exec(
                          async (err, gameData) => {
                            console.log(gameData);
                            if (err) {
                              let response = {
                                message: 'Something went wrong',
                                status: false
                              }
                              let statusCode = 400
                              func.log("leaderboard", req.body, statusCode, response)
                              return res
                                .status(statusCode)
                                .send(response)
                            } else if (!_.isEmpty(gameData)) {
                              if (gameData[0].allowedCountries.length == 1) {
                                var beynoicAmountCoversionData = await func.getLocalCurrencyCoversionDetails(
                                  payload
                                );
                               

                                if (beynoicAmountCoversionData == null) {
                                  beynoicAmountCoversionData = {
                                    usd_rate: 1
                                  };
                                }

                                beynoicAmountCoversionData = await func.getLocalCurrencyConversionDetailsAsPerGameRegionType(gameData[0], beynoicAmountCoversionData)

                              var prizes = gameData[0].prize;
                              
                              result.forEach(info=>{
                             
                                let data = playerLeagueData.filter(item => item.userId.userName.indexOf(info.playerName) !== -1);
                             
                                
                              if(data){
                                let sum =0
                                data.forEach(d=>{
                                  sum= sum+parseFloat(
                                    prizes[d.win] *
                                    beynoicAmountCoversionData.usd_rate
                                  );
                                })
                                info.prize=sum.toFixed(2);
                              }                                

                              })
                             
                              }

                              let response = {
                                status: true,
                                message: "Data Found",
                                LoggedInPlayerData: _.isEmpty(
                                  loggedInPlayerArray
                                )
                                  ? []
                                  : loggedInPlayerArray[0],
                                data: _.isEmpty(result) ? [] : result,
                              }
                      
                              statusCode = 200
                      
                              func.log("leaderboard", req.body, statusCode, response)
                              res
                                .status(statusCode)
                                .send(response)
                            
                            }    
                        })

                      }
                      
                      else {
                        // console.log(result);
                        let response = {
                          status: true,
                          message: "Data Found 2",
                          LoggedInPlayerData: _.isEmpty(loggedInPlayerArray)
                            ? []
                            : loggedInPlayerArray[0],
                          data: _.isEmpty(result) ? [] : result,
                        }
                
                        statusCode = 200
                
                        func.log("leaderboard", req.body, statusCode, response)
                        res
                          .status(statusCode)
                          .send(response)
                      }
                    }
                  });
              });
          }
        } catch (err) {
          let response = {
            message: err.message,
            status: false
          }
          let statusCode = 400
          func.log("leaderboard", req.body, statusCode, response)
          return res
            .status(statusCode)
            .send(response)
        }
      }
    });
  });
};

/*
 * --------------------------------------------------------------------------
 * Distribute prizes in league leaderboard for winners
 * ---------------------------------------------------------------------------
 */
exports.distributeLeaguePrizes = (req, res) => {
  console.log("inside leaderboard");

  try {
    func.checkUserAuthentication(req, res, function (payload) {
      loggedInplayerId = payload.sub.toObjectId();

      Player.findOne({ _id: loggedInplayerId }, function (
        err,
        LoggedInPlayerData
      ) {
        if (err) {
          return res
            .status(400)
            .send({ message: "No such Player exist", status: false });
        } else {
        }
      });
    });
  } catch (e) {
    next(e);
  }
};

/*
 * ---------------------------------------------------------------------------
 * Player's winning history API start
 * ---------------------------------------------------------------------------
 */
exports.winHistory = (req, res) => {
  console.log("inside winHistory");

  try {
    //   func.checkUserAuthentication(req, res, function (payload) {
    // loggedInplayerId = payload.sub.toObjectId();
    var userName = req.query.userName;
    var leagueId = req.query.leagueId;
    var searchObject;

    if (leagueId) {
      searchObject = {
        matchStatus: "finished",
        matchType: "leagueGamePlay",
        winnerName: userName,
        leagueId: leagueId,
      };
    } else {
      searchObject = {
        matchStatus: "finished",
        matchType: "leagueGamePlay",
        winnerName: userName,
      };
    }
    Match.find(searchObject).exec((err, data) => {
      if (err) {
        return res
          .status(200)
          .send({ message: "Something went wrong", status: false });
      } else if (_.isEmpty(data)) {
        // console.log('empty', data);
        return res
          .status(200)
          .send({ message: "No data found", status: false });
      } else {
        // console.log('data', data);
        return res
          .status(200)
          .send({ message: "Data found", status: true, data: data });
      }
    });

    // })
  } catch (e) {
    next(e);
  }
};
/*
 * --------------------------------------------------------------------------
 * update leaderBoard prize status
 * ---------------------------------------------------------------------------
 */

exports.updatePrizeStatus = (req, res) => {
  // let status = req.body.prizeStatus;
  let leagueId = req.body.leagueId;
  let playerName = req.body.playerName;

  if (!playerName || playerName == undefined || null) {
    res.send({
      status: false,
      message: "Please enter playerName",
    });
  }

  func.checkUserAuthentication(req, res, function (payload) {
    League.findOne({ _id: leagueId }).exec((err, data) => {
      if (!leagueId) {
        res.send({
          status: false,
          message: "Please enter leagueId",
        });
      } else if (data.leagueStatus != "closed") {
        res.send({
          status: false,
          message:
            "You can't distribute prizes for this league as this is Active or Upcoming league",
        });
      }
    });

    Leaderboard.findOneAndUpdate(
      { leagueId: leagueId, playerName: playerName },
      { prizeStatus: "paid" },
      {
        upsert: false,
        new: true,
        useFindAndModify: false,
      },
      (err, updated) => {
        // console.log(updated);

        if (err) {
          let msg = "some error occurred";
          res.send({
            status: false,
            message: msg,
          });
        } else {
          if (!updated) {
            res.status(400).send({
              status: false,
              message: "prizeStatus not updated ",
            });
          } else {
            res.status(200).send({
              status: true,
              message: "prizeStatus updated",
              data: updated,
            });
          }
        }
      }
    );
  });
};
