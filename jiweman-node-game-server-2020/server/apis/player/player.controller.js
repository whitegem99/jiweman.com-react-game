/*
 * --------------------------------------------------------------------------
 * Created by Barquecon Technologies on 26/04/2019 by Dipak Adsul
 * ---------------------------------------------------------------------------
 */

let func = require('../common/commonfunction');
let sendResponse = require('../common/sendresponse');
let logger = require('../../logger/log');
var mongoose = require('mongoose');
let Player = require('../playerAuth/player.model').Player;
let Role = require('../playerAuth/player.model').Role;
var country = require('../playerAuth/player.model').country;
let Match = require('../matchPlay/matchplay.model').Match;
let MatchDataCopy = require('../matchPlay/matchplay.model').MatchDataCopy;
let LeaderBoard = require('../leaderboard/leaderboard.model').LeaderBoard;
var ObjectID = require('mongodb').ObjectID;
let playerController = require('../player/player.controller');
const { playerLeague } = require('../playerLeague/playerLeague.model');
const{League, LeagueWinners}  = require('../league/league.model');
const { MatchCopy } = require('../matchPlay/matchplay.model');
const _ = require('lodash')
const moment = require('moment');


/**
 * list all players API start
 */
exports.players = function (req, res) {
  func.checkUserAuthentication(req, res, function (payload) {
    let playerId = req.query.playerId;
    let userName = req.query.userName;
    var skip = req.query.skip;
    var limit = req.query.limit;

    if (playerId) {
      Player.findOne(
        {
          _id: playerId,
        },
        { password: 0 },
        function (err, result) {
          if (err) {
            console.log('err');
            logger.error(err);
            let msg = '';
            sendResponse.sendErrorMessage(msg, res);
          } else if (result) {
            sendResponse.sendSuccessData(result, res);
          }
        }
      );
    } else if (userName) {
      Player.findOne(
        {
          userName: userName,
        },
        { password: 0 },
        function (err, result) {
          if (err) {
            console.log('err');
            logger.error(err);
            let msg = '';
            sendResponse.sendErrorMessage(msg, res);
          } else if (result) {
            sendResponse.sendSuccessData(result, res);
          }
        }
      );
    } else {
      Player.find({}, { password: 0 }, function (err, result) {
        if (err) {
          logger.error(err);
          let msg = '';
          sendResponse.sendErrorMessage(msg, res);
        } else {
          if (result.length == 0) {
            let msg = '';
            sendResponse.sendDataNotFound(msg, res);
          } else {
            sendResponse.sendSuccessData(result, res);
          }
        }
      })
        .skip(parseInt(skip))
        .limit(parseInt(limit));
    }
  });
};

/**
 * Edit player details API start
 */

exports.editPlayer = function (req, res) {
  func.checkUserAuthentication(req, res, function (payload) {
    let playerId = req.body.playerId;
    let updatedPlayer = req.body;
    var ctr = 0;
    if (playerId) {
      Player.findOneAndUpdate(
        {
          _id: playerId,
        },
        updatedPlayer,
        {
          upsert: true,
          new: true,
          useFindAndModify: false,
        },
        function (err, updated) {
          ctr++;
          if (err) {
            let msg = 'some error occurred';
            sendResponse.sendErrorMessage(msg);
          } else {
            sendResponse.sendSuccessData(updated, res);
          }
        }
      );
    } else {
      let msg = 'Send Player Id';
      sendResponse.sendErrorMessage(msg, res);
    }
  });
};

/**
 * list all countries API start
 */

exports.getAllCountries = function (req, res) {
  // console.log(country);
  country.find({}, function (err, result) {
    if (err) {
      logger.error(err);
      let msg = '';
      sendResponse.sendErrorMessage(msg, res);
    } else {
      console.log(result);
      if (result.length == 0) {
        let msg = '';
        sendResponse.sendDataNotFound(msg, res);
      } else {
        sendResponse.sendSuccessData(result, res);
      }
    }
  });

  // let newCounty = new country();
  // newCounty.country_code = '1';
  // newCounty.country_name = 'India';

  // newCounty.save(function(err, data) {
  //     if (err) {
  //         return console.error(err);
  //     }
  //     console.log(data);
  // })
};

/**
 * update player leader board API start
 */

// exports.updatePlayerLeaderBoardData = (req, res) => {
//   console.log('inside updatePlayerLeaderBoardData');
//   func.checkUserAuthentication(req, res, async function (payload) {
//     let winLoseData = req.body;
//     let playerOneData;
//     let playerTwoData;
//     console.log(winLoseData);
//     if (!req.body) {
//       return res.status(400).send({ message: 'Bad Request', status: false });
//     } else {
//       try {
//         var id = winLoseData.matchId;
//         Match.findById(id, function (err, match) {
//           if (err) {
//           } else {
//             // console.log('? DONT')
//             const now = new Date();
//             //  const createTime = new Date(match.createdAt);
//             // console.log( now.getMinutes() );
//             // console.log(createTime.getMinutes())
//           }
//         });
//         let p1Obj = {};
//         let p2Obj = {};

//         var winPoints = 5;
//         var lossPoints = -0.25;
//         var goalPoints = 1;
//         var goalLosePoints = -0.5;
//         var goalDiffPoints = 1.5;
//         var cSpoints = 3;
//         var matchPlayPoints = 1;

//         let matchData = winLoseData;
//         // console.log('matchData', matchData);

//         var p1winCount = 0;
//         var p1winPoints = 0;
//         var p1winStreak = 0;
//         var p2winCount = 0;
//         var p2winPoints = 0;
//         var p2winStreak = 0;

//         var p1lossCount = 0;
//         var p1lossPoints = 0;
//         var p2lossCount = 0;
//         var p2lossPoints = 0;

//         var p1goalFor = 0;
//         var p1GFpts = 0;
//         var p2goalFor = 0;
//         var p2GFpts = 0;


//         var p1goalAgainst = 0;
//         var p1GApts = 0;
//         var p2goalAgainst = 0;
//         var p2GApts = 0;

//         var p1cleanSheet = 0;
//         var p1CsPoints = 0;
//         var p2cleanSheet = 0;
//         var p2CsPoints = 0;

//         var p1matchesPlayed = 0;
//         var p1GPpts = 0;
//         var p2matchesPlayed = 0;
//         var p2GPpts = 0;

//         var p1goalDiff = 0;
//         var p1GDPoints = 0;
//         var p2goalDiff = 0;
//         var p2GDPoints = 0;

//         var p1totalPoints = 0;
//         var p2totalPoints = 0;

//         if (matchData.playerTwoGoal != 0 || matchData.playerOneGoal != 0) {
//           if (matchData.playerTwoGoal == 0) {
//             p1cleanSheet++;
//             p1CsPoints = p1CsPoints + cSpoints;
//           }
//         } else {
//           p1cleanSheet = p1cleanSheet + p1cleanSheet;
//         }

//         if (matchData.playerTwoGoal != 0 || matchData.playerOneGoal != 0) {
//           if (matchData.playerOneGoal == 0) {
//             p2cleanSheet++;
//             p2CsPoints = p2CsPoints + cSpoints;
//           }
//         } else {
//           p2cleanSheet = p2cleanSheet + p2cleanSheet;
//         }

//         if (matchData.winnerName == matchData.playerOneUserName) {
//           p1winStreak++;
//           p2winStreak = 0;
//           p1winCount++;
//           p1winPoints = p1winPoints + winPoints;
//         }

//         if (matchData.winnerName == matchData.playerTwoUserName) {
//           p2winStreak++;
//           p1winStreak = 0;
//           p2winCount++;
//           p2winPoints = p2winPoints + winPoints;
//         }

//         if (matchData.winnerName == matchData.playerOneUserName) {
//           p2lossCount++;
//           p2lossPoints = p2lossPoints + lossPoints;
//         }

//         if (matchData.winnerName == matchData.playerTwoUserName) {
//           p1lossCount++;
//           p1lossPoints = p1lossPoints + lossPoints;
//         }


//         p1goalAgainst =
//           parseInt(p1goalAgainst) + parseInt(matchData.playerTwoGoal);

//         p2goalAgainst =
//           parseInt(p2goalAgainst) + parseInt(matchData.playerOneGoal);

//         p1goalFor = parseInt(p1goalFor) + parseInt(matchData.playerOneGoal);

//         p2goalFor = parseInt(p2goalFor) + parseInt(matchData.playerTwoGoal);

//         p1goalDiff = p1goalFor - p1goalAgainst;

//         p1GDPoints = p1goalDiff * goalDiffPoints;

//         p2goalDiff = p2goalFor - p2goalAgainst;

//         p2GDPoints = p2goalDiff * goalDiffPoints;

//         p1matchesPlayed = p1winCount + p1lossCount;

//         p2matchesPlayed = p2winCount + p2lossCount;

//         p1Obj.leagueId = matchData.leagueId;
//         p1Obj.gameType = matchData.matchType;
//         p1Obj.playerName = matchData.playerOneUserName;
//         p1Obj.win = p1winCount;
//         p1Obj.loss = p1lossCount;
//         p1Obj.goalFor = p1goalFor;
//         p1Obj.goalAgainst = p1goalAgainst;
//         p1Obj.cleanSheet = p1cleanSheet;
//         p1Obj.goalDiff = p1goalDiff;
//         p1Obj.matchesPlayed = p1matchesPlayed;
//         p1Obj.winPoints = p1winPoints;
//         p1Obj.lossPoints = p1lossPoints;
//         p1Obj.cSpoints = p1CsPoints;
//         p1Obj.winStreak = p1winStreak;
//         p1Obj.currentWinStreak = p1winStreak;
//         // p1Obj.highestWinStreak = p1Obj.currentWinStreak;

//         p2Obj.leagueId = matchData.leagueId;
//         p2Obj.gameType = matchData.matchType;
//         p2Obj.playerName = matchData.playerTwoUserName;
//         p2Obj.win = p2winCount;
//         p2Obj.loss = p2lossCount;
//         p2Obj.goalFor = p2goalFor;
//         p2Obj.goalAgainst = p2goalAgainst;
//         p2Obj.cleanSheet = p2cleanSheet;
//         p2Obj.goalDiff = p2goalDiff;
//         p2Obj.matchesPlayed = p2matchesPlayed;
//         p2Obj.winPoints = p2winPoints;
//         p2Obj.lossPoints = p2lossPoints;
//         p2Obj.cSpoints = p2CsPoints;
//         p2Obj.winStreak = p2winStreak;
//         p2Obj.currentWinStreak = p2winStreak;
//         // p2Obj.highestWinStreak = p2Obj.currentWinStreak;

//         var updatedPlayer1 = p1Obj;
//         var updatedPlayer2 = p2Obj;

//         if (p1Obj.matchesPlayed >= 1) {
//           p1GPpts = p1GPpts + p1Obj.matchesPlayed * matchPlayPoints;
//         } else {
//           p1GPpts = p1GPpts;
//         }

//         if (p2Obj.matchesPlayed >= 1) {
//           p2GPpts = p2GPpts + p2Obj.matchesPlayed * matchPlayPoints;
//         } else {
//           p2GPpts = p2GPpts;
//         }

//         if (p1Obj.goalFor >= 1) {
//           p1GFpts = p1GFpts + p1Obj.goalFor * goalPoints;
//         } else {
//           p1GFpts = p1GFpts;
//         }

//         if (p2Obj.goalFor >= 1) {
//           p2GFpts = p2GFpts + p2Obj.goalFor * goalPoints;
//         } else {
//           p2GFpts = p2GFpts;
//         }

//         if (p1Obj.goalAgainst >= 1) {
//           p1GApts = p1GApts + p1Obj.goalAgainst * goalLosePoints;
//         } else {
//           p1GApts = p1GApts;
//         }

//         if (p2Obj.goalAgainst >= 1) {
//           p2GApts = p2GApts + p2Obj.goalAgainst * goalLosePoints;
//         } else {
//           p2GApts = p2GApts;
//         }

//         p1totalPoints =
//           p1totalPoints +
//           (p1winPoints +
//             p1lossPoints +
//             p1CsPoints +
//             p1GFpts +
//             p1GApts +
//             p1GPpts +
//             p1GDPoints);

//         p1Obj.GFpts = p1GFpts;
//         p1Obj.GApts = p1GApts;
//         p1Obj.GPpts = p1GPpts;
//         p1Obj.GDpts = p1GDPoints;
//         p1Obj.points = p1totalPoints;

//         p2totalPoints =
//           p2totalPoints +
//           (p2winPoints +
//             p2lossPoints +
//             p2CsPoints +
//             p2GFpts +
//             p2GApts +
//             p2GPpts +
//             p2GDPoints);

//         p2Obj.GFpts = p2GFpts;
//         p2Obj.GApts = p2GApts;
//         p2Obj.GPpts = p2GPpts;
//         p2Obj.GDpts = p2GDPoints;
//         p2Obj.points = p2totalPoints;

//         p1durationInSeconds = parseFloat(matchData.playerOneMatchDuration ? matchData.playerOneMatchDuration : 0);
//         p2durationInSeconds = parseFloat(matchData.playerTwoMatchDuration ? matchData.playerTwoMatchDuration : 0);


//         if (p1durationInSeconds >= 30 && p2durationInSeconds >= 30) {
//           console.log("413 >>>> p1 and p2 duration is greater than 30")
//           p1Obj.pointsPerMinute = parseFloat(p1Obj.points / (p1durationInSeconds / 60)).toFixed(4);
//           p2Obj.pointsPerMinute = parseFloat(p2Obj.points / (p2durationInSeconds / 60)).toFixed(4);

//         }



//         //1<= x < 30 for winning player and X=0 for losing player
//         if ((p1durationInSeconds >= 1 && p1durationInSeconds < 30) && p2durationInSeconds == 0) {
//           if (matchData.winnerName == matchData.playerOneUserName) {
//             console.log("424 >>>>> p1 is winner")
//             console.log("p1 duration is 1<= x < 30 and p2 is 0")
//             p1Obj.pointsPerMinute = parseFloat((p1Obj.points / (p1durationInSeconds / 60)) / 1000).toFixed(4);
//             p2Obj.pointsPerMinute = -1 * p1Obj.pointsPerMinute;
//           } else {
//             console.log("429 >>>>> p2 is winner");
//             console.log("p1 duration is 1<= x < 30 and p2 is 0")
//             p1Obj.pointsPerMinute = -1 * parseFloat((p1Obj.points / (p1durationInSeconds / 60)) / 1000).toFixed(4);
//             p2Obj.pointsPerMinute = -1 * p1Obj.pointsPerMinute;
//           }
//         }
//         else {
//           if ((p2durationInSeconds >= 1 && p2durationInSeconds < 30) && p1durationInSeconds == 0) {
//             console.log("437 >>>> p2 is winner")
//             console.log("p2 duration is 1<= x < 30 and p1 is 0")
//             if (matchData.winnerName == matchData.playerTwoUserName) {
//               p2Obj.pointsPerMinute = parseFloat((p2Obj.points / (p2durationInSeconds / 60)) / 1000).toFixed(4);
//               p1Obj.pointsPerMinute = -1 * p2Obj.pointsPerMinute;
//             } else {
//               console.log("443 >>>>> p1 is winner")
//               console.log("p1 duration is 1<= x < 30 and p2 is 0")
//               p2Obj.pointsPerMinute = -1 * parseFloat((p2Obj.points / (p2durationInSeconds / 60)) / 1000).toFixed(4);
//               p1Obj.pointsPerMinute = -1 * p2Obj.pointsPerMinute;
//             }
//           }

//         }


//         if ((p1durationInSeconds >= 30 && (matchData.winnerName == matchData.playerOneUserName)) && p2durationInSeconds < 30) {
//           console.log("454 >>>> p1 is winner");
//           console.log("p1 duration is greater than 30 and  p2 is less than 30");
//           p1Obj.pointsPerMinute = parseFloat(p1Obj.points / (p1durationInSeconds / 60)).toFixed(4);
//           p2Obj.pointsPerMinute = parseFloat((p2Obj.points / (p2durationInSeconds / 60)) / 1000).toFixed(4);

//         } else if ((p2durationInSeconds >= 30 && (matchData.winnerName == matchData.playerTwoUserName)) && p1durationInSeconds < 30) {
//           console.log("460 >>>> p2 is winner")
//           console.log("p2 is greater than 30 and p1 is less than 30"); 
//           p2Obj.pointsPerMinute = parseFloat(p2Obj.points / (p2durationInSeconds / 60)).toFixed(4);
//           p1Obj.pointsPerMinute = parseFloat((p1Obj.points / (p1durationInSeconds / 60)) / 1000).toFixed(4);

//         } else {
//           if ((p1durationInSeconds < 30 && (matchData.winnerName == matchData.playerOneUserName)) && p2durationInSeconds >= 30) {
//             console.log("467 >>>> p1 winner")
//             console.log("p1 is less than 30 and p2 is greater than 30");
//             p1Obj.pointsPerMinute = parseFloat((p1Obj.points / (p1durationInSeconds / 60)) / 1000).toFixed(4);
//             p2Obj.pointsPerMinute = parseFloat(p2Obj.points / (p2durationInSeconds / 60)).toFixed(4);

//           } else if ((p2durationInSeconds < 30 && (matchData.winnerName == matchData.playerTwoUserName)) && p1durationInSeconds >= 30) {
//             console.log("473 >>>> p2 winner")
//             console.log("p2 is less than 30 and p1 is greater than 30");
//             p2Obj.pointsPerMinute = parseFloat((p2Obj.points / (p2durationInSeconds / 60)) / 1000).toFixed(4);
//             p1Obj.pointsPerMinute = parseFloat(p1Obj.points / (p1durationInSeconds / 60)).toFixed(4);

//           }
//         }

//         p1Obj.pointsPerMinute = !isNaN(p1Obj.pointsPerMinute) ? p1Obj.pointsPerMinute : 0
//         p2Obj.pointsPerMinute = !isNaN(p2Obj.pointsPerMinute) ? p2Obj.pointsPerMinute : 0


//         return new Promise(async (resolve, reject) => {
//           var searchObj = {
//             playerName: p1Obj.playerName,
//             gameType: p1Obj.gameType,
//           };
//           //TODO: Check error handling here
//           if (p1Obj.leagueId) {
//             searchObj['leagueId'] = p1Obj.leagueId;
//             var getLeagueData = await League.findOne({ _id: p1Obj.leagueId });
//             if (getLeagueData) {
//               const player1Detail = await Player.findOne({
//                 userName: p1Obj.playerName,
//               });

//               const ticketInfo = await playerLeague
//                 .findOne({
//                   userId: ObjectID(player1Detail._id),
//                   leagueId: ObjectID(p1Obj.leagueId),
//                   remaining: {
//                     $gt: 0,
//                   },
//                 })
//                 .sort({
//                   remaining: 1,
//                 });

//               const totalTicketsConsumedForALeague = await playerLeague.find({
//                 userId: ObjectID(player1Detail._id),
//                 leagueId: ObjectID(p1Obj.leagueId),
//                 remaining: 0,
//               });

//               if (!ticketInfo) {
//                 return res.status(400).send({
//                   message: 'Player 1 not authorized to play this game',
//                   status: false,
//                 });
//               } else {
//                 searchObj.ticket = ticketInfo.ticket;
//                 p1Obj.ticket = ticketInfo.ticket;
//                 p1Obj.leagueRound = totalTicketsConsumedForALeague.length + 1;
//                 ticketInfo.remaining = ticketInfo.remaining - 1
//                 await ticketInfo.save();
//                 searchObj['leagueRound'] = p1Obj.leagueRound;

//               }
//             }
//           }

//           LeaderBoard.findOne(searchObj, function (err, data) {
//             console.log('playerOne', data);

//             if (data == null) {
//               console.log(typeof p1Obj.pointsPerMinute);

//               if (p1durationInSeconds == 0 && p2durationInSeconds == 0) {
//                 console.log("541 >>>> p1 winner")
//                 console.log("both p1 and p2 duration is zero")
//                 if (matchData.winnerName == matchData.playerOneUserName) {
//                   p1Obj.pointsPerMinute = .001 * matchData.p1matchesPlayed;
//                 }
//                 else {
//                   p1Obj.pointsPerMinute = -.001 * matchData.p1matchesPlayed;
//                 }
//               }


//               if ((p1durationInSeconds > 0 && p1durationInSeconds < 1) && p2durationInSeconds == 0) {
//                  console.log("553 >>>> p1 is winner")
//                  console.log(" p1 time duration greater than 0 and less than 1 and p2 duration is zero")
//                 if (matchData.winnerName == matchData.playerOneUserName) {
//                   p1Obj.pointsPerMinute = .001 * matchData.p1matchesPlayed;
//                 }
//                 else {
//                   p1Obj.pointsPerMinute = -.001 * matchData.p1matchesPlayed;
//                 }
//               }



//               p1Obj.avgPointsPerMinute = p1Obj.pointsPerMinute

//               var leaderBoard = new LeaderBoard(p1Obj);
//               leaderBoard
//                 .save()
//                 .then((item, err) => {
//                   if (err) {
//                     console.log(err);
//                     let msg = 'some error occurred';
//                     sendResponse.sendErrorMessage(msg, res);
//                   } else {
//                     playerOneData = item;
//                     updatePlayerTwoLeaderBoard();
//                   }
//                 })
//                 .catch((err) => {
//                   reject(err);
//                 });
//             } else if (data) {
//               data.gameType = updatedPlayer1.gameType;
//               data.goalFor = updatedPlayer1.goalFor + data.goalFor;
//               data.goalAgainst = updatedPlayer1.goalAgainst + data.goalAgainst;
//               data.win = updatedPlayer1.win + data.win;
//               data.loss = updatedPlayer1.loss + data.loss;
//               data.cleanSheet = updatedPlayer1.cleanSheet + data.cleanSheet;
//               data.goalDiff = updatedPlayer1.goalDiff + data.goalDiff;
//               data.matchesPlayed =
//                 updatedPlayer1.matchesPlayed + data.matchesPlayed;
//               data.winPoints = updatedPlayer1.winPoints + data.winPoints;
//               data.lossPoints = updatedPlayer1.lossPoints + data.lossPoints;
//               data.cSpoints = updatedPlayer1.cSpoints + data.cSpoints;
//               data.GFpts = p1GFpts + data.GFpts;
//               data.GApts = p1GApts + data.GApts;
//               data.GPpts = p1GPpts + data.GPpts;
//               data.GDpts = p1GDPoints + data.GDpts;
//               data.points = p1totalPoints + data.points;


//               if ((p1durationInSeconds > 0 && p1durationInSeconds < 1) && p2durationInSeconds == 0) {
//                 console.log("604>>> p1 is winner")
//                 console.log(" p1 time duration greater than 0 and less than 1 and p2 duration is zero")
//                 if (matchData.winnerName == matchData.playerOneUserName) {
//                   p1Obj.pointsPerMinute = .001 * data.matchesPlayed;
//                 }
//                 else {
//                   p1Obj.pointsPerMinute = -.001 * data.matchesPlayed;
//                 }
//               }



//               if (p1durationInSeconds == 0 && p2durationInSeconds == 0) {
//                 console.log("617>>> p1 is winner")
//                 console.log(" p1 and p2 duration is zero")
//                 if (matchData.winnerName == matchData.playerOneUserName) {
//                   p1Obj.pointsPerMinute = .001 * data.matchesPlayed;
//                 }
//                 else {
//                   p1Obj.pointsPerMinute = -.001 * data.matchesPlayed;
//                 }
//               }

//               if (data.matchesPlayed > 1) {
//                 let tmp = (data.pointsPerMinute + parseFloat(p1Obj.pointsPerMinute)) / data.matchesPlayed;
//                 data.avgPointsPerMinute = tmp.toFixed(4);
//                 data.pointsPerMinute = data.pointsPerMinute + parseFloat(p1Obj.pointsPerMinute);

//               }

//               if (p1winStreak == 0) {
//                 data.currentWinStreak = 0;
//               } else {
//                 data.currentWinStreak = p1winStreak + data.currentWinStreak;
//                 if (data.currentWinStreak == 2) {
//                   data.highestWinStreak = data.currentWinStreak + data.highestWinStreak;
//                 }
//                 else if (data.currentWinStreak > 2 && p1winStreak == 1) {
//                   data.highestWinStreak = data.highestWinStreak + 1;
//                 }

//               }
//               console.log(data);
//               console.log("final- data")

//               data.save(function (err, item) {
//                 if (!err) {
//                   playerOneData = item;
//                   updatePlayerTwoLeaderBoard();
//                 } else {
//                   reject(err);
//                 }
//               });
//             }
//           });

//           async function updatePlayerTwoLeaderBoard() {
//             // update player 2 leaderboard Data after player one is done
//             var searchObj = {
//               playerName: p2Obj.playerName,
//               gameType: p2Obj.gameType,
//             };

//             if (p2Obj.leagueId) {
//               searchObj['leagueId'] = p2Obj.leagueId;
//               var getLeagueData = await League.findOne({ _id: p2Obj.leagueId });
//               if (getLeagueData) {
//                 const player2Detail = await Player.findOne({
//                   userName: p2Obj.playerName,
//                 });
//                 const ticketInfo = await playerLeague
//                   .findOne({
//                     userId: ObjectID(player2Detail._id),
//                     leagueId: ObjectID(p2Obj.leagueId),
//                     remaining: {
//                       $gt: 0,
//                     },
//                   })
//                   .sort({
//                     remaining: 1,
//                   });

//                 const totalTicketsConsumedForALeague = await playerLeague.find({
//                   userId: ObjectID(player2Detail._id),
//                   leagueId: ObjectID(p2Obj.leagueId),
//                   remaining: 0,
//                 });

//                 if (!ticketInfo) {
//                   return res.status(400).send({
//                     message: 'Player 2 not authorized to play this game',
//                     status: false,
//                   });
//                 } else {
//                   searchObj.ticket = ticketInfo.ticket;
//                   p2Obj.ticket = ticketInfo.ticket;
//                   p2Obj.leagueRound = totalTicketsConsumedForALeague.length + 1;
//                   ticketInfo.remaining = ticketInfo.remaining - 1
//                   await ticketInfo.save();
//                   searchObj['leagueRound'] = p2Obj.leagueRound;
//                 }
//               }
//             }

//             LeaderBoard.findOne(searchObj, async function (err, data) {
//               console.log("player 2 data ")
//               console.log(data);

//               if (data == null) {
//                 console.log(p2Obj);

//                 if ((p2durationInSeconds > 0 && p2durationInSeconds < 1) && p1durationInSeconds == 0) {
//                   console.log("716 >>>> p2 is winner")
//                   console.log(" p2 time duration greater than 0 and less than 1 and p1 duration is zero")
//                   if (matchData.winnerName == matchData.playerTwoUserName) {
//                     p2Obj.pointsPerMinute = .001 * matchData.p2matchesPlayed;
//                   }
//                   else {
//                     p2Obj.pointsPerMinute = -.001 * matchData.p2matchesPlayed;
//                   }
//                 }


//                 if (p1durationInSeconds == 0 && p2durationInSeconds == 0) {
//                   console.log("728>>>> p2 is winner")
//                   console.log(" p1 and p2 duration is zero")
//                   if (matchData.winnerName == matchData.playerTwoUserName) {
//                     p2Obj.pointsPerMinute = .001 * matchData.p2matchesPlayed;
//                   }
//                   else {
//                     p2Obj.pointsPerMinute = -.001 * matchData.p2matchesPlayed;
//                   }
//                 }
//                 p2Obj.avgPointsPerMinute = p2Obj.pointsPerMinute
//                 var leaderBoard = new LeaderBoard(p2Obj);

//                 leaderBoard
//                   .save()
//                   .then((item) => {
//                     res.json({
//                       status: 200,
//                       message: 'Data saved',
//                       player1data: playerOneData,
//                       player2data: item
//                     });
//                     resolve(item);
//                   })
//                   .catch((err) => {
//                     reject(err);
//                   });
//               } else if (data) {
//                 data.gameType = updatedPlayer2.gameType;
//                 data.goalFor = updatedPlayer2.goalFor + data.goalFor;
//                 data.goalAgainst =
//                   updatedPlayer2.goalAgainst + data.goalAgainst;
//                 data.win = updatedPlayer2.win + data.win;
//                 data.loss = updatedPlayer2.loss + data.loss;
//                 data.cleanSheet = updatedPlayer2.cleanSheet + data.cleanSheet;
//                 data.goalDiff = updatedPlayer2.goalDiff + data.goalDiff;
//                 data.matchesPlayed =
//                   updatedPlayer2.matchesPlayed + data.matchesPlayed;
//                 data.winPoints = updatedPlayer2.winPoints + data.winPoints;
//                 data.lossPoints = updatedPlayer2.lossPoints + data.lossPoints;
//                 data.cSpoints = updatedPlayer2.cSpoints + data.cSpoints;
//                 data.GFpts = p2GFpts + data.GFpts;
//                 data.GApts = p2GApts + data.GApts;
//                 data.GPpts = p2GPpts + data.GPpts;
//                 data.GDpts = p2GDPoints + data.GDpts;
//                 data.points = p2totalPoints + data.points;



//                 if ((p2durationInSeconds > 0 && p2durationInSeconds < 1) && p1durationInSeconds == 0) {
//                   console.log("777 >>>> p2 is winner")
//                   console.log(" p2 time duration greater than 0 and less than 1 and p1 duration is zero")
//                   if (matchData.winnerName == matchData.playerTwoUserName) {
//                     p2Obj.pointsPerMinute = .001 * data.matchesPlayed;
//                   }
//                   else {
//                     p2Obj.pointsPerMinute = -.001 * data.matchesPlayed;
//                   }
//                 }

//                 //This is how we will calculate the PPM when Player Turn Time is 0 for both players (P1 and P2)

//                 if (p1durationInSeconds == 0 && p2durationInSeconds == 0) {
//                   console.log("790 >>>>>> p2 is winner")
//                   console.log(" p2 and p1 duration is zero")
//                   if (matchData.winnerName == matchData.playerTwoUserName) {
//                     p2Obj.pointsPerMinute = .001 * data.matchesPlayed;
//                   }
//                   else {
//                     p2Obj.pointsPerMinute = -.001 * data.matchesPlayed;
//                   }
//                 }


//                 if (data.matchesPlayed > 1) {
//                   let temp = (data.pointsPerMinute + parseFloat(p2Obj.pointsPerMinute)) / data.matchesPlayed;
//                   data.avgPointsPerMinute = (temp).toFixed(4);
//                   data.pointsPerMinute = data.pointsPerMinute + parseFloat(p2Obj.pointsPerMinute);

//                 }


//                 if (p2winStreak == 0) {
//                   data.currentWinStreak = 0;
//                 } else {
//                   data.currentWinStreak = p2winStreak + data.currentWinStreak;
//                   if (data.currentWinStreak == 2) {
//                     data.highestWinStreak = data.currentWinStreak + data.highestWinStreak;
//                   }
//                   else if (data.currentWinStreak > 2 && p2winStreak == 1) {
//                     data.highestWinStreak = data.highestWinStreak + 1;
//                   }

//                 }

//                 // if (p2winStreak == 0) {
//                 //   data.currentWinStreak = 0;
//                 // } else {
//                 //   data.currentWinStreak = p2winStreak + data.currentWinStreak;

//                 //   if (data.currentWinStreak > data.highestWinStreak) {
//                 //     data.highestWinStreak = data.currentWinStreak;
//                 //   }
//                 // }

//                 data.save(function (err, data) {
//                   if (!err) {
//                     res.json({
//                       status: 200,
//                       message: 'Data saved',
//                       player1data: playerOneData,
//                       player2data: data
//                     });
//                     resolve(data);
//                   } else {
//                     reject(err);
//                   }
//                 });
//               }
//             });
//           }
//         });
//       } catch (error) {
//         console.log(error);
//         return res
//           .status(400)
//           .send({ message: 'something went wrong', status: false });
//       }
//     }
//   });
// };

/**
 * display player stats/profile API start
 */

exports.getPlayerProfileDetails = (req, res) => {
  console.log('inside getPlayerProfileDetails');
  func.checkUserAuthentication(req, res, async function (payload) {

    let loggedInplayerId;
    let opponentId = req.query.opponentId;

    if (opponentId) {

      loggedInplayerId = opponentId;

    } else {

      loggedInplayerId = payload.sub.toObjectId();

    }
    
    let gameType = req.query.gameType;
    let oneononeBetObj = {};
    let leagueObj = {};

    let totalPlayed = 0;
    let percent = 0;

    leagueObj['matchesWon'] = 0;
    leagueObj['winPercent'] = 0;
    leagueObj['goalFor'] = 0;
    leagueObj['totalNumberOfLeaguePrizesWon'] = 0;
    leagueObj['totalLeaguePrizeMoneyWon'] = 0;
    leagueObj['totalPlayed'] = 0;

    oneononeBetObj['matchesWon'] = 0;
    oneononeBetObj['winPercent'] = 0;
    oneononeBetObj['goalFor'] = 0;
    oneononeBetObj['totalPlayed'] = 0;

    // let oneononeBetObj = {};

    try {

      if(_.isEmpty(gameType)){
        res.status(400).send({
          status: false,
          message: 'please specify gameType',
        })
      }

      let playerData = await Player.findOne({ _id: loggedInplayerId }, { password: 0 }).lean();

      let leagueWinningData = await LeagueWinners.find({user: loggedInplayerId}).lean();

      console.log('leagueWinningData',leagueWinningData);

      if (_.isEmpty(playerData)) {
        let msg = '';
        sendResponse.sendDataNotFound(msg, res);
      }
          // console.log('887',playerData);
          // res.send(playerData);
          if(gameType == 'leagueGamePlay') {
            LeaderBoard.find({
              playerName: playerData.userName,
              gameType: gameType
            }).exec((err, result)=>{
              if (err) {
                logger.error(err);
                let msg = '';
                sendResponse.sendErrorMessage(msg, res);
              } else {
    
                if(_.isEmpty(result)){
                  res.status(400).send({
                    status: false,
                    message: 'Data not Found',
                  })
                }

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

                
                result.forEach(element => {
                  leagueObj['matchesWon'] = leagueObj['matchesWon'] + element.win;
                  
                  totalPlayed = totalPlayed + element.matchesPlayed;

                  // percent = !isNaN(totalPlayed / [ leagueObj['leagueMatchesWon'] * 100 ]) ? percent : 0;

                  // leagueObj['winPercent'] = percent;            //Math.round(percent);

                  leagueObj['goalFor'] = leagueObj['goalFor'] + element.goalFor;

                });

                leagueObj['totalPlayed'] = leagueObj['totalPlayed'] + totalPlayed;

                
                percent = [ leagueObj['matchesWon'] * 100 ] / totalPlayed;

                if (leagueObj['matchesWon'] > 0) {

                  leagueObj['winPercent'] = Math.ceil(percent);

                } else { 

                  leagueObj['winPercent'] = 0;

                }

                leagueObj['totalNumberOfLeaguePrizesWon'] = leagueObj['totalNumberOfLeaguePrizesWon'] + leagueWinningData.length;

                leagueWinningData.forEach(element=>{

                  leagueObj['totalLeaguePrizeMoneyWon'] = leagueObj['totalLeaguePrizeMoneyWon'] + element['paymentResponse']['amount'];

                })

                leagueObj['userCurrency'] = payload.player.userCurrency;

                res.send({
                  status: true,
                  message: 'Data Found',
                  data: leagueObj
                });
              }
            })
          } else if (gameType == 'oneononeBet') {
            LeaderBoard.find({
              playerName: playerData.userName,
              gameType: gameType
            }).exec((err, result)=>{
              if (err) {
                logger.error(err);
                let msg = '';
                sendResponse.sendErrorMessage(msg, res);
              } else {
                if(_.isEmpty(result)){
                  res.status(400).send({
                    status: false,
                    message: 'Data not Found',
                  })
                }

                result.forEach(element => {
                  oneononeBetObj['matchesWon'] = oneononeBetObj['matchesWon'] + element.win;
                  
                  totalPlayed = totalPlayed + element.matchesPlayed;

                  // percent = !isNaN(totalPlayed / [ oneononeBetObj['betMatchesWon'] * 100 ]) ? percent : 0 ;

                  // oneononeBetObj['winPercent'] = percent;                              //Math.round(percent);

                  oneononeBetObj['goalFor'] = oneononeBetObj['goalFor'] + element.goalFor;

                });

                oneononeBetObj['totalPlayed'] = oneononeBetObj['totalPlayed'] + totalPlayed;

                percent = [ oneononeBetObj['matchesWon'] * 100 ] / totalPlayed;

                  if (oneononeBetObj['matchesWon'] > 0) {
                    
                    oneononeBetObj['winPercent'] = Math.ceil(percent);

                  } else { 

                    oneononeBetObj['winPercent'] = 0;

                  }

                  oneononeBetObj['userCurrency'] = payload.player.userCurrency;

                res.send({
                  status: true,
                  message: 'Data Found',
                  data: oneononeBetObj
                });
              }
            })
            // res.send(playerData);
          } 
    } catch (err) {
      return res.json({
        success: false,
        message: err.toString(),
      });
    }
  });
};

exports.getPlayerDetails = async (req, res) => {
  func.checkUserAuthentication(req, res, async (payload) => {
    try {
      console.log(req.query.bettingCompanyId)
      if (!_.isEmpty(req.query.bettingCompanyId)) {
        var getPlayerData = await Player.find({ bettingCompanyId: req.query.bettingCompanyId }).
          select('fullName userName email countryOfRecidence dateOfBirth gender bettingCompanyId').lean();

        if (!_.isEmpty(getPlayerData)) {
          return res
            .status(200)
            .send({
              message: "Plyer data",
              status: true,
              data: getPlayerData
            })


        }
        else {
          return res
            .status(201)
            .send({
              message: "Data not found",
              status: false
            })
        }
      }
      else {
        return res
          .status(201)
          .send({
            message: "bettingCompanyId parameter is missing",
            status: false
          })

      }
    }
    catch (e) {
      return res
        .status(400)
        .send({
          message: "Enter valid matchId or roomName",
          status: false
        })
    }

  })

}


exports.updatePlayerLeaderBoardData = (req, res) => {
  console.log('inside updatePlayerLeaderBoardData');
  func.checkUserAuthentication(req, res, async function (payload) {
    let winLoseData = req.body;
    console.log("body",winLoseData);
    if (!req.body) {
      return res.status(400).send({ message: 'Bad Request', status: false });
    } else {
      // if (winLoseData.isGameValid == true && winLoseData.isGameValid !== undefined && winLoseData.isGameValid !== null )
      try {

        // var filter = {roomName: winLoseData.roomName,
        //   //   matchStatus: 'active',
        //      _id: winLoseData.matchId,
        //     senderId: 'p1' || 'p2' }

        var matchDataUpdate;

        var oldMatchData = await Match.findOne({
          roomName: winLoseData.roomName,
          _id: winLoseData.matchId
        });

        console.log('997', oldMatchData);

        let dataUpdated = false;

        if ((oldMatchData.updatedBysenderId && winLoseData.senderId == 'obs1') || (!oldMatchData.updatedBysenderId)) {
          console.log('inside if');
          matchDataUpdate = await Match.findOneAndUpdate({
            roomName: winLoseData.roomName,
            //   matchStatus: 'active',
            _id: winLoseData.matchId
            // secretID: winLoseData.secretID
          },
            {
              winnerName: winLoseData.winnerName,
              playerOneGoal: winLoseData.playerOneGoal,
              playerTwoGoal: winLoseData.playerTwoGoal,
              playerOneMatchDuration: winLoseData.playerOneMatchDuration,
              playerTwoMatchDuration: winLoseData.playerTwoMatchDuration,
              matchDuration: winLoseData.matchDuration,
              matchStatus: 'finished',
              updatedBysenderId: winLoseData.senderId
              // isGameValid: true
            }, {
            upsert: false,
            new: true,
            useFindAndModify: false
          })

          dataUpdated = true

        } 

        console.log("dataUpdated",dataUpdated)
        console.log("oldMatchData.updatedBysenderId",oldMatchData.updatedBysenderId)
        console.log(matchDataUpdate);
        if (_.isEmpty(matchDataUpdate) && !oldMatchData) {
          return res
            .status(400)
            .send({
              message: "Enter valid matchId or roomName",
              status: false
            })
        }

        if (oldMatchData.updatedBysenderId && !dataUpdated){

          let player1FinalData = await LeaderBoard.findOne(
            {
              matchId:winLoseData.matchId,
              leagueId:winLoseData.leagueId,
              playerName:winLoseData.playerOneUserName
            }
          );
          let player2FinalData = await LeaderBoard.findOne(
            {
              matchId:winLoseData.matchId,
              leagueId:winLoseData.leagueId,
              playerName:winLoseData.playerTwoUserName
            }
          );

          res.json({
            status: 200,
            message: 'No need to update',
            player1data: player1FinalData,
            player2data: player2FinalData
          });


        }else{

          // var id = winLoseData.matchId;
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

        p1Obj.leagueId = matchData.leagueId;
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
        p1Obj.bettingCompanyId = payload.bettingCompanyId;
        // p1Obj.secretID = winLoseData.secretID;
        p1Obj.senderId = winLoseData.senderId;
        p1Obj.matchId = winLoseData.matchId;
        // p1Obj.highestWinStreak = p1Obj.currentWinStreak;

        p2Obj.leagueId = matchData.leagueId;
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
        p2Obj.bettingCompanyId = payload.bettingCompanyId;
        // p2Obj.secretID = winLoseData.secretID;
        p2Obj.senderId = winLoseData.senderId;
        p2Obj.matchId = winLoseData.matchId;
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

        // if(counter == 1) {
        // if (p1Obj.leagueId && !oldMatchData.updatedBysenderId) {
        //   searchP1Obj = await func.checkAuthorizedPlayer(p1Obj, 1);
        // }

        // if (p2Obj.leagueId && !oldMatchData.updatedBysenderId) {
        //   searchP2Obj = await func.checkAuthorizedPlayer(p2Obj, 2)
        // }
        // }

        // var playerOneData1 = await LeaderBoard.findOne(searchP1Obj).exec();
        // var playerTwoData2 = await LeaderBoard.findOne(searchP2Obj).exec();

        if (matchData.matchType=="leagueGamePlay"){

          if (!matchData.leagueId){

            return res
            .status(400)
            .send({
              message: "leagueId is required",
              status: false
            })

          }

          var leagueData = await League.findOne({ _id: matchData.leagueId });

          if (!leagueData){

            return res
            .status(400)
            .send({
              message: "Enter valid matchId or roomName",
              status: false
            })
            
          }

          const playerOneDetail = await Player.findOne({
            userName: p1Obj.playerName,
          });

          if(!playerOneDetail){
            return res
            .status(400)
            .send({
              message: `Player ${p1Obj.playerName} not found`,
              status: false
            })
          }

          const playerTwoDetail = await Player.findOne({
            userName: p2Obj.playerName,
          });

          if(!playerTwoDetail){
            return res
            .status(400)
            .send({
              message: `Player ${p2Obj.playerName} not found`,
              status: false
            })
          }

          
          if (!oldMatchData.updatedBysenderId) {

            const ticketOfPlayerOne = await playerLeague.findOne({
              userId: ObjectID(playerOneDetail._id),
              leagueId: ObjectID(matchData.leagueId),
              remaining: {
                $gt: 0,
              },
            })
              .sort({
                remaining: 1,
              });

            if (!ticketOfPlayerOne) {
              return res
                .status(400)
                .send({
                  message: `Player ${p1Obj.playerName} not authorized to play this game`,
                  status: false
                })
            }

            const ticketOfPlayerTwo = await playerLeague.findOne({
              userId: ObjectID(playerTwoDetail._id),
              leagueId: ObjectID(matchData.leagueId),
              remaining: {
                $gt: 0,
              },
            })
              .sort({
                remaining: 1,
              });

            if (!ticketOfPlayerTwo) {
              return res
                .status(400)
                .send({
                  message: `Player ${p2Obj.playerName} not authorized to play this game`,
                  status: false
                })
            }

            const totalTicketsConsumedByOne = await playerLeague.find({
              userId: ObjectID(playerOneDetail._id),
              leagueId: ObjectID(matchData.leagueId),
              remaining: 0,
            });

            const totalTicketsConsumedByTwo = await playerLeague.find({
              userId: ObjectID(playerTwoDetail._id),
              leagueId: ObjectID(matchData.leagueId),
              remaining: 0,
            });

            p1Obj.ticket = ticketOfPlayerOne.ticket;
            p1Obj.leagueRound = totalTicketsConsumedByOne.length + 1;

            p2Obj.ticket = ticketOfPlayerTwo.ticket;
            p2Obj.leagueRound = totalTicketsConsumedByTwo.length + 1;

            ticketOfPlayerOne.remaining = ticketOfPlayerOne.remaining - 1;
            await ticketOfPlayerOne.save();

            ticketOfPlayerTwo.remaining = ticketOfPlayerTwo.remaining - 1;
            await ticketOfPlayerTwo.save();

          }else{

            var searchP1ObjForTicket = {
              playerName: p1Obj.playerName,
              gameType: p1Obj.gameType,
              matchId: winLoseData.matchId
            };
    
            var searchP2ObjForTicket = {
              playerName: p2Obj.playerName,
              gameType: p2Obj.gameType,
              matchId: winLoseData.matchId
            };

            var leaderbaord1Data = await LeaderBoard.findOne(searchP1ObjForTicket);
            var leaderboardp2Data = await LeaderBoard.findOne(searchP2ObjForTicket);

            p1Obj.ticket = leaderbaord1Data.ticket;
            p1Obj.leagueRound = leaderbaord1Data.leagueRound;

            p2Obj.ticket = leaderboardp2Data.ticket;
            p2Obj.leagueRound = leaderboardp2Data.leagueRound;

          }

        }
        
        var searchP1ObjForDelete = {
          playerName: p1Obj.playerName,
          gameType: p1Obj.gameType,
          matchId: winLoseData.matchId
        };

        var searchP2ObjForDelete = {
          playerName: p2Obj.playerName,
          gameType: p2Obj.gameType,
          matchId: winLoseData.matchId
        };

        var deletep1Data = await LeaderBoard.deleteOne(searchP1ObjForDelete);
        var deletep2Data = await LeaderBoard.deleteOne(searchP2ObjForDelete);


        var searchP1Obj = {
          playerName: p1Obj.playerName,
          gameType: p1Obj.gameType,
          matchId: { $ne: winLoseData.matchId },
          leagueId: matchData.leagueId,
          ticket: p1Obj.ticket
        };

        var searchP2Obj = {
          playerName: p2Obj.playerName,
          gameType: p2Obj.gameType,
          matchId: { $ne:  winLoseData.matchId},
          leagueId: matchData.leagueId,
          ticket: p2Obj.ticket
        };


        var playerOneData = await LeaderBoard.findOne(searchP1Obj,{},{ sort: { 'updatedAt' : -1 } }).exec();
        var playerTwoData = await LeaderBoard.findOne(searchP2Obj,{},{ sort: { 'updatedAt' : -1 } }).exec();

        var player1FinalData, player2FinalData;
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
        console.log("calculatePPM")
        console.log(temp);
        p1PPM = temp.p1;
        p2PPM = temp.p2;

        if (playerOneData && playerOneData.matchesPlayed > 1) {
          let tmp = (playerOneData.pointsPerMinute + parseFloat(p1PPM)) / playerOneData.matchesPlayed;
          playerOneData.avgPointsPerMinute = tmp.toFixed(4);
          playerOneData.pointsPerMinute = playerOneData.pointsPerMinute + parseFloat(p1PPM);
          // player1FinalData = await playerOneData.save();
          let data = playerOneData.toObject();
          delete data._id;
          data.matchId = winLoseData.matchId;
          // data.secretID = winLoseData.secretID;
          data.senderId = winLoseData.senderId;
          if (matchData.leagueId){

            data.ticket = p1Obj.ticket
            data.leagueRound = p1Obj.leagueRound

          }
          console.log("==========");
          console.log(data)
          player1FinalData = await LeaderBoard.findOneAndUpdate(
            {
              matchId:winLoseData.matchId,
              leagueId:matchData.leagueId,
              playerName:matchData.playerOneUserName
            },
            data,
            {
              new: true,
              upsert: true 
            }
          );
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
          // player2FinalData = await playerTwoData.save();
          let data = playerTwoData.toObject();
          delete data._id;
          data.matchId = winLoseData.matchId;
          // data.secretID = winLoseData.secretID;
          data.senderId = winLoseData.senderId;
          if (matchData.leagueId){

            data.ticket = p2Obj.ticket
            data.leagueRound = p2Obj.leagueRound

          }
          console.log("==========");
          console.log({
            matchId:winLoseData.matchId,
            leagueId:matchData.leagueId,
            playerName:matchData.playerTwoUserName
          })
          player2FinalData = await LeaderBoard.findOneAndUpdate(
            {
              matchId:winLoseData.matchId,
              leagueId:matchData.leagueId,
              playerName:matchData.playerTwoUserName
            },
            data,
            {
              new: true,
              upsert: true 
            }
          );

        }
        else {
          p2Obj.pointsPerMinute = p2PPM;
          p2Obj.avgPointsPerMinute = p2PPM.toFixed(4);
          var leaderBoard = new LeaderBoard(p2Obj);
          player2FinalData = await leaderBoard.save()
        }

        // let recentMatchDataFromObserver = 
        // if (winLoseData.senderId == 'observer') {
        res.json({
          status: 200,
          message: 'Match end  and Leader board data updated',
          player1data: player1FinalData,
          player2data: player2FinalData
        });

        }
        
        // } else if (winLoseData.senderId == 'observer') {

        // }


      } catch (error) {
        console.log(error);
        return res
          .status(400)
          .send({ message: error.message, status: false });
      }
    }
    // else {
    //     return res
    //       .status(400)
    //       .send({ status: false, message: "invalid game" });
    // }
  });
};



// var checkAuthorizedPlayer = async (playerObject, player,) => {
//   console.log('inside auth');
//   return new Promise(async (resolve, reject) => {
//     var searchObj = {
//       playerName: playerObject.playerName,
//       gameType: playerObject.gameType,
//     };
//     searchObj['leagueId'] = playerObject.leagueId;
//     var getLeagueData = await League.findOne({ _id: playerObject.leagueId });
//     if (getLeagueData) {
//       const playerDetail = await Player.findOne({
//         userName: playerObject.playerName,
//       });

//       const ticketInfo = await playerLeague
//         .findOne({
//           userId: ObjectID(playerDetail._id),
//           leagueId: ObjectID(playerObject.leagueId),
//           remaining: {
//             $gt: 0,
//           },
//         })
//         .sort({
//           remaining: 1,
//         });

//       const totalTicketsConsumedForALeague = await playerLeague.find({
//         userId: ObjectID(playerDetail._id),
//         leagueId: ObjectID(playerObject.leagueId),
//         remaining: 0,
//       });

//       if (!ticketInfo) {
//         reject({
//           message: `Player ${player} not authorized to play this game`,
//           status: false,
//         });
//       } else {
//         searchObj.ticket = ticketInfo.ticket;
//         playerObject.ticket = ticketInfo.ticket;
//         playerObject.leagueRound = totalTicketsConsumedForALeague.length + 1;
//         ticketInfo.remaining = ticketInfo.remaining - 1
//         await ticketInfo.save();
//         searchObj['leagueRound'] = playerObject.leagueRound;
//         resolve(searchObj);
//       }
//     }
//   })

// }


// var assignPlayerData = async (playerData, updatedPlayer, GFpts, GApts, GPpts, GDPoints, totalPoints) => {
//   console.log("assignPlayerData");

//   return new Promise((resolve, reject) => {
//     playerData.gameType = updatedPlayer.gameType;
//     playerData.goalFor = updatedPlayer.goalFor + playerData.goalFor;
//     playerData.goalAgainst = updatedPlayer.goalAgainst + playerData.goalAgainst;
//     playerData.win = updatedPlayer.win + playerData.win;
//     playerData.loss = updatedPlayer.loss + playerData.loss;
//     playerData.cleanSheet = updatedPlayer.cleanSheet + playerData.cleanSheet;
//     playerData.goalDiff = updatedPlayer.goalDiff + playerData.goalDiff;
//     playerData.matchesPlayed =
//       updatedPlayer.matchesPlayed + playerData.matchesPlayed;
//     playerData.winPoints = updatedPlayer.winPoints + playerData.winPoints;
//     playerData.lossPoints = updatedPlayer.lossPoints + playerData.lossPoints;
//     playerData.cSpoints = updatedPlayer.cSpoints + playerData.cSpoints;
//     playerData.GFpts = GFpts + playerData.GFpts;
//     playerData.GApts = GApts + playerData.GApts;
//     playerData.GPpts = GPpts + playerData.GPpts;
//     playerData.GDpts = GDPoints + playerData.GDpts;
//     playerData.points = totalPoints + playerData.points;
//     resolve(playerData);

//   })

// }

// var calculatePPM = async (p1durationInSeconds, p2durationInSeconds, playerOneData, playerTwoData, p1Obj, p2Obj, matchData) => {
//   return new Promise((resolve, rejcet) => {
//     var p1MatchesPlayed = playerOneData;
//     var p2MatchesPlayed = playerTwoData;
//     console.log("p1 matches played", p1MatchesPlayed);
//     console.log("p2 matches played", p2MatchesPlayed);

//     //  slide 2 

//     if (p1durationInSeconds == 0 && p2durationInSeconds == 0) {
//       console.log("Player Turn Time is 0 for both players (P1 and P2)")
//       if (matchData.winnerName == matchData.playerOneUserName) {
//         console.log("player one winner")
//         p1Obj.pointsPerMinute = +.001 * p1MatchesPlayed;  //( note positive sign here for loser)
//         p2Obj.pointsPerMinute = -.001 * p2MatchesPlayed; // ( note negative sign here)
//       }
//       else {
//         console.log("player two winner");
//         p2Obj.pointsPerMinute = +.001 * p2MatchesPlayed; // ( note positive sign here for loser)
//         p1Obj.pointsPerMinute = -.001 * p1MatchesPlayed // ( note negative sign here)	
//       }
//       resolve({ p1: p1Obj.pointsPerMinute, p2: p2Obj.pointsPerMinute });
//     }

//     //slide 4 2a

//     if (p1durationInSeconds > 0 && p1durationInSeconds < 1 && p2durationInSeconds == 0 && matchData.winnerName == matchData.playerOneUserName) {
//       console.log("0< x <1 for first player and X=0 for other player");
//       console.log("player one winner");
//       p1Obj.pointsPerMinute = .001 * p1MatchesPlayed // ( note positive sign here for loser)
//       p2Obj.pointsPerMinute = -1 * .001 * p2MatchesPlayed // ( note negative 1 multiplied here
//       resolve({ p1: p1Obj.pointsPerMinute, p2: p2Obj.pointsPerMinute });
//     }

//     if (p2durationInSeconds > 0 && p2durationInSeconds < 1 && p1durationInSeconds == 0 && matchData.winnerName == matchData.playerTwoUserName) {
//       console.log("0< x <1 for second player and X=0 for other player");
//       console.log("player two winner");
//       p2Obj.pointsPerMinute = .001 * p2MatchesPlayed //( note positive sign here for loser)
//       p1Obj.pointsPerMinute = -1 * .001 * p1MatchesPlayed //( note negative 1 multiplied here
//       resolve({ p1: p1Obj.pointsPerMinute, p2: p2Obj.pointsPerMinute });
//     }


//     //slide 5 2a

//     if (p1durationInSeconds >= 1 && p1durationInSeconds < 30 && p2durationInSeconds == 0 && matchData.winnerName == matchData.playerOneUserName) {
//       console.log("1<= x < 30 for winning player and X=0 for losing player");
//       console.log("player one winner");
//       p1Obj.pointsPerMinute = (p1Obj.points / (p1durationInSeconds / 60)) / 1000
//       p2Obj.pointsPerMinute = -1 * p1Obj.pointsPerMinute //  (note the negative sign before P1 PPM)
//       resolve({ p1: p1Obj.pointsPerMinute, p2: p2Obj.pointsPerMinute });
//     }
//     else
//       if (p2durationInSeconds >= 1 && p2durationInSeconds < 30 && p1durationInSeconds == 0 && matchData.winnerName == matchData.playerTwoUserName) {
//         console.log("1<= x < 30 for winning player and X=0 for losing player");
//         console.log("player two winner");
//         p2Obj.pointsPerMinute = (p2Obj.points / (p2durationInSeconds / 60)) / 1000
//         p1Obj.pointsPerMinute = -1 * p2Obj.pointsPerMinute  //(note the negative sign before P1 PPM)
//         resolve({ p1: p1Obj.pointsPerMinute, p2: p2Obj.pointsPerMinute });
//       }



//     //slide 6 2b

//     if ((p1durationInSeconds >= 1 && p1durationInSeconds < 30) && p2durationInSeconds == 0 && (matchData.winnerName == matchData.playerTwoUserName)) {
//       console.log("1<= x < 30 for losing player and X=0 for winning player")
//       console.log("player two winner")
//       p1Obj.pointsPerMinute = -1 * ((p1Obj.points / (p1durationInSeconds / 60)) / 1000);
//       p2Obj.pointsPerMinute = -1 * p1Obj.pointsPerMinute; //(note the negative sign before P1 PPM)
//       resolve({ p1: p1Obj.pointsPerMinute, p2: p2Obj.pointsPerMinute });
//     }

//     if ((p2durationInSeconds >= 1 && p2durationInSeconds < 30) && p1durationInSeconds == 0 && (matchData.winnerName == matchData.playerOneUserName)) {
//       console.log("1<= x < 30 for losing player and X=0 for winning player")
//       console.log("player one winner")
//       p2Obj.pointsPerMinute = -1 * ((p2Obj.points / (p2durationInSeconds / 60)) / 1000);
//       p1Obj.pointsPerMinute = -1 * p2Obj.pointsPerMinute; //(note the negative sign before P1 PPM)
//       resolve({ p1: p1Obj.pointsPerMinute, p2: p2Obj.pointsPerMinute });
//     }



//     //slide 7 3 

//     if (p1durationInSeconds >= 30 && (p2durationInSeconds >= 0 && p2durationInSeconds < 1) && matchData.winnerName == matchData.playerOneUserName) {
//       console.log("one player turn time X>=30 and other player turn time  is 0<=X<1");
//       console.log("player one winner");
//       p1Obj.pointsPerMinute = (p1Obj.points / (p1durationInSeconds / 60));
//       p2Obj.pointsPerMinute = +.001 * p2MatchesPlayed;
//       resolve({ p1: p1Obj.pointsPerMinute, p2: p2Obj.pointsPerMinute });
//     }
//     else
//       if (p2durationInSeconds >= 30 && (p1durationInSeconds >= 0 && p1durationInSeconds < 1) && matchData.winnerName == matchData.playerTwoUserName) {
//         console.log("one player turn time X>=30 and other player turn time  is 0<=X<1");
//         console.log("player two winner");
//         p2Obj.pointsPerMinute = (p2Obj.points / (p2durationInSeconds / 60));
//         p1Obj.pointsPerMinute = +.001 * p1MatchesPlayed;
//         resolve({ p1: p1Obj.pointsPerMinute, p2: p2Obj.pointsPerMinute });
//       }



//     //slide 8 4
//     if (p1durationInSeconds >= 30 && (p2durationInSeconds >= 1 && p2durationInSeconds < 30)) {
//       console.log("PPM calculation when losing player turn time is X>= 30s and winning player turn time is at 1<=X<30 seconds at the exact time of disconnection")
//       if (matchData.winnerName == matchData.playerTwoUserName) {
//         {
//           console.log("player one winner")
//           p1Obj.pointsPerMinute = (p1Obj.points / (p1durationInSeconds / 60));
//           p2Obj.pointsPerMinute = (p2Obj.points / (p2durationInSeconds / 60)) / 1000;
//           resolve({ p1: p1Obj.pointsPerMinute, p2: p2Obj.pointsPerMinute });

//         }
//       }
//     }
//     else
//       if (p2durationInSeconds >= 30 && (p1durationInSeconds >= 1 && p1durationInSeconds < 30)) {
//         console.log("PPM calculation when losing player turn time is X>= 30s and winning player turn time is at 1<=X<30 seconds at the exact time of disconnection")

//         if (matchData.winnerName == matchData.playerOneUserName) {
//           console.log("player two winner");
//           p2Obj.pointsPerMinute = (p2Obj.points / (p2durationInSeconds / 60));
//           p1Obj.pointsPerMinute = (p1Obj.points / (p1durationInSeconds / 60)) / 1000;
//           resolve({ p1: p1Obj.pointsPerMinute, p2: p2Obj.pointsPerMinute });
//         }
//       }

//     //slide 9  5

//     if (p1durationInSeconds >= 30 && p2durationInSeconds >= 30) {
//       console.log("PPM calculation when losing player turn time is X>= 30s and winning player turn time is at X>=30 seconds at the exact time of disconnection")
//       p1Obj.pointsPerMinute = (p1Obj.points / (p1durationInSeconds / 60));
//       p2Obj.pointsPerMinute = (p2Obj.points / (p2durationInSeconds / 60));
//       resolve({ p1: p1Obj.pointsPerMinute, p2: p2Obj.pointsPerMinute });
//     }



//     //slide 11 

//     if ((p1durationInSeconds > 0 && p1durationInSeconds < 1) && (p2durationInSeconds > 0 && p2durationInSeconds < 1)) {
//       console.log("Both players have x at 0< x <1");

//       if (matchData.winnerName == matchData.playerOneUserName) {
//         console.log("player one winner");
//         p1Obj.pointsPerMinute = +.001 * p1MatchesPlayed // ( note positive sign here for loser)
//         p2Obj.pointsPerMinute = -.001 * p2MatchesPlayed// ( note negative sign here)
//       }
//       else {
//         console.log("player two winner");
//         p2Obj.pointsPerMinute = +.001 * p2MatchesPlayed // ( note positive sign here for loser)
//         p1Obj.pointsPerMinute = -.001 * p1MatchesPlayed// ( note negative sign here)
//       }
//       resolve({ p1: p1Obj.pointsPerMinute, p2: p2Obj.pointsPerMinute });
//     }


//     //slide 12

//     if ((p1durationInSeconds >= 1 && p1durationInSeconds < 30) && (p2durationInSeconds >= 1 && p2durationInSeconds < 30)) {
//       console.log("Both players have X at 1<= x < 30")
//       p1Obj.pointsPerMinute = (p1Obj.points / (p1durationInSeconds / 60)) / 1000;
//       p2Obj.pointsPerMinute = (p2Obj.points / (p2durationInSeconds / 60)) / 1000;
//       resolve({ p1: p1Obj.pointsPerMinute, p2: p2Obj.pointsPerMinute });
//     }

//     //slide 13 
//     if ((p1durationInSeconds >= 1 && p1durationInSeconds < 30) && (p2durationInSeconds > 0 && p2durationInSeconds < 1)) {
//       console.log("One player at  1<=X<30    other player at  0<x<1");
//       if (matchData.winnerName == matchData.playerOneUserName) {
//         console.log("playerone winner")
//         p1Obj.pointsPerMinute = (p1Obj.points / (p1durationInSeconds / 60)) / 1000;
//         p2Obj.pointsPerMinute = -p1Obj.pointsPerMinute;
//       }
//       resolve({ p1: p1Obj.pointsPerMinute, p2: p2Obj.pointsPerMinute });
//     }

//     if ((p2durationInSeconds >= 1 && p2durationInSeconds < 30) && (p1durationInSeconds > 0 && p1durationInSeconds < 1)) {
//       console.log("Second player at 1<=X<30  other player at  0<x<1");

//       if (matchData.winnerName == matchData.playerTwoUserName) {
//         console.log("player two winner")
//         p2Obj.pointsPerMinute = (p2Obj.points / (p2durationInSeconds / 60)) / 1000;
//         p1Obj.pointsPerMinute = -p2Obj.pointsPerMinute;
//       }
//       resolve({ p1: p1Obj.pointsPerMinute, p2: p2Obj.pointsPerMinute });
//     }





//   })
// }

// var calculatePPM = async (p1durationInSeconds, p2durationInSeconds, playerOneData, playerTwoData, p1Obj, p2Obj, matchData) => {
//   console.log('inside calculatePPM');

//   return new Promise((resolve, reject) => {
//     var p1MatchesPlayed = playerOneData;
//     var p2MatchesPlayed = playerTwoData;

//     console.log("p1 matches played",p1MatchesPlayed);
//     console.log("p2 matches played",p2MatchesPlayed);

//     // slide 2 and 5 
//     if ((p1durationInSeconds >= 0 && p1durationInSeconds <= 1) &&
//       (p2durationInSeconds >= 0 && p2durationInSeconds <= 1)) {
//       if (matchData.winnerName == matchData.playerOneUserName) {
//         p1Obj.pointsPerMinute = .001 * p1MatchesPlayed;
//         p2Obj.pointsPerMinute = -.001 * p2MatchesPlayed;
//       }
//       else {
//         p2Obj.pointsPerMinute = .001 * p2MatchesPlayed;
//         p1Obj.pointsPerMinute = -.001 * p1MatchesPlayed;

//       }
//       console.log("1435");
//       resolve({p1:p1Obj.pointsPerMinute,p2:p2Obj.pointsPerMinute})
//     }

//         //slide 12
//         if((p1durationInSeconds >= 1 && p1durationInSeconds < 30) && (p2durationInSeconds >= 1 && p2durationInSeconds < 30) ){
//           console.log("both less than 30");
//         p1Obj.pointsPerMinute =parseFloat((p1Obj.points / (p1durationInSeconds / 60)) / 1000).toFixed(4);
//         p2Obj.pointsPerMinute =parseFloat((p2Obj.points / (p2durationInSeconds / 60)) / 1000).toFixed(4);
//         console.log("===",p2Obj.pointsPerMinute);
//         console.log("1522");
//         resolve({p1:p1Obj.pointsPerMinute,p2:p2Obj.pointsPerMinute})
//         // console.log("===",p2Obj.pointsPerMinute);

//     }

//         //slide 13
//         if (((p1durationInSeconds >= 1 && p1durationInSeconds < 30) && (p2durationInSeconds > 0 && p2durationInSeconds < 1)) && matchData.winnerName == matchData.playerOneUserName) {
//           p1Obj.pointsPerMinute = parseFloat(p1Obj.points / (p1durationInSeconds / 60) / 1000).toFixed(4);
//           p2Obj.pointsPerMinute = -1 * p1Obj.pointsPerMinute;
//           console.log("1542");
//           resolve({p1:p1Obj.pointsPerMinute,p2:p2Obj.pointsPerMinute}); 

//         } else {
//           p2Obj.pointsPerMinute = parseFloat(p2Obj.points / (p2durationInSeconds / 60) / 1000).toFixed(4);
//           p1Obj.pointsPerMinute = -1 * p2Obj.pointsPerMinute;
//           console.log("1549");
//           resolve({p1:p1Obj.pointsPerMinute,p2:p2Obj.pointsPerMinute}); 

//         }

//     // slide 9
//     if (p1durationInSeconds >= 30 && p2durationInSeconds >= 30) {
//       p1Obj.pointsPerMinute = parseFloat(p1Obj.points / (p1durationInSeconds / 60)).toFixed(4);
//       p2Obj.pointsPerMinute = parseFloat(p2Obj.points / (p2durationInSeconds / 60)).toFixed(4);

//       console.log("1444");
//       resolve({p1:p1Obj.pointsPerMinute,p2:p2Obj.pointsPerMinute}); 
//     } 

//     // slide 4
//     if ((p1durationInSeconds >= 1 && p1durationInSeconds < 30) && p2durationInSeconds == 0) {
//       if (matchData.winnerName == matchData.playerOneUserName) {
//         p1Obj.pointsPerMinute =  parseFloat((p1Obj.points / (p1durationInSeconds / 60)) / 1000).toFixed(4);
//         p2Obj.pointsPerMinute = -1 * p1Obj.pointsPerMinute;
//       } else {
//         p1Obj.pointsPerMinute = -1 * parseFloat((p1Obj.points / (p1durationInSeconds / 60)) / 1000).toFixed(4);
//         p2Obj.pointsPerMinute = -1 * p1Obj.pointsPerMinute;

//         // p2Obj.pointsPerMinute = parseFloat((p2Obj.points / (p2durationInSeconds / 60)) / 1000).toFixed(4);
//         // p1Obj.pointsPerMinute = -1 * p2Obj.pointsPerMinute;
//       }
//       console.log("1460");
//       resolve({p1:p1Obj.pointsPerMinute,p2:p2Obj.pointsPerMinute});
//     }


//     // slide 6 
//     if ((p2durationInSeconds >= 1 && p2durationInSeconds < 30) && p1durationInSeconds == 0) {
//       if (matchData.winnerName == matchData.playerTwoUserName) {
//         p2Obj.pointsPerMinute =  parseFloat((p2Obj.points / (p2durationInSeconds / 60)) / 1000).toFixed(4);
//         p1Obj.pointsPerMinute = -1 * p2Obj.pointsPerMinute;

//       } else {
//         p2Obj.pointsPerMinute = -1 * parseFloat((p2Obj.points / (p2durationInSeconds / 60)) / 1000).toFixed(4);
//         p1Obj.pointsPerMinute = -1 * p2Obj.pointsPerMinute;

//         // p2Obj.pointsPerMinute = -1 * parseFloat((p2Obj.points / (p2durationInSeconds / 60)) / 1000).toFixed(4);
//         // p1Obj.pointsPerMinute = -1 * p2Obj.pointsPerMinute;
//       }
//       console.log("1478");
//       resolve({p1:p1Obj.pointsPerMinute,p2:p2Obj.pointsPerMinute});
//     }


//     // if ((p1durationInSeconds >= 30 && matchData.winnerName == matchData.playerOneUserName) && p2durationInSeconds < 30) {
//     //   p1Obj.pointsPerMinute = parseFloat(p1Obj.points / (p1durationInSeconds / 60)).toFixed(4);
//     //   p2Obj.pointsPerMinute = parseFloat((p2Obj.points / (p2durationInSeconds / 60)) / 1000).toFixed(4);
//     //   console.log("1486");
//     //   resolve({p1:p1Obj.pointsPerMinute,p2:p2Obj.pointsPerMinute}); 
//     // }
//     // else {
//     //   if(matchData.winnerName == matchData.playerTwoUserName && p2durationInSeconds >= 30){
//     //     p2Obj.pointsPerMinute = parseFloat((p2Obj.points / (p2durationInSeconds / 60)) / 1000).toFixed(4);
//     //     p1Obj.pointsPerMinute = parseFloat(p1Obj.points / (p1durationInSeconds / 60)).toFixed(4);
//     //   console.log("1493");
//     //     resolve({p1:p1Obj.pointsPerMinute,p2:p2Obj.pointsPerMinute});

//     //   }
//     //     }

//     //slide 7 ruchika
//     if ((p1durationInSeconds >= 30 && matchData.winnerName == matchData.playerOneUserName) && (p2durationInSeconds >= 0 && p2durationInSeconds < 1)) {
//       p1Obj.pointsPerMinute = parseFloat(p1Obj.points / (p1durationInSeconds / 60)).toFixed(4);
//       p2Obj.pointsPerMinute = .001 * p2MatchesPlayed;
//       console.log("1515");
//       resolve({p1:p1Obj.pointsPerMinute,p2:p2Obj.pointsPerMinute}); 
//     } else {
//       p2Obj.pointsPerMinute = parseFloat(p2Obj.points / (p2durationInSeconds / 60)).toFixed(4);
//       p1Obj.pointsPerMinute = .001 * p1MatchesPlayed;
//       console.log("1520");
//       resolve({p1:p1Obj.pointsPerMinute,p2:p2Obj.pointsPerMinute}); 
//     }


//     //slide 8 ruchika
//     if (( (p1durationInSeconds >= 1 && p1durationInSeconds < 30 ) && matchData.winnerName == matchData.playerOneUserName) && p2durationInSeconds >= 30) {
//       p2Obj.pointsPerMinute = parseFloat(p2Obj.points / (p2durationInSeconds / 60)).toFixed(4);
//       p1Obj.pointsPerMinute = parseFloat((p1Obj.points / (p1durationInSeconds / 60)) / 1000).toFixed(4);
//       console.log("1529");
//       resolve({p1:p1Obj.pointsPerMinute,p2:p2Obj.pointsPerMinute}); 
//     } else {
//       p1Obj.pointsPerMinute = parseFloat(p1Obj.points / (p1durationInSeconds / 60)).toFixed(4);
//       p2Obj.pointsPerMinute = parseFloat((p2Obj.points / (p2durationInSeconds / 60)) / 1000).toFixed(4);
//       console.log("1534");
//       resolve({p1:p1Obj.pointsPerMinute,p2:p2Obj.pointsPerMinute}); 
//     }




// //ashish 
//     // if ((p2durationInSeconds >= 30 && matchData.winnerName == matchData.playerTwoUserName) && p1durationInSeconds < 30) {
//     //   p2Obj.pointsPerMinute = parseFloat(p2Obj.points / (p2durationInSeconds / 60)).toFixed(4);
//     //   p1Obj.pointsPerMinute = parseFloat((p1Obj.points / (p1durationInSeconds / 60)) / 1000).toFixed(4);
//     //   console.log("1503");
//     //   resolve({p1:p1Obj.pointsPerMinute,p2:p2Obj.pointsPerMinute});
//     // }
//     // else {
//     //   if(matchData.winnerName == matchData.playerOneUserName && p1durationInSeconds >= 30){
//     //     p1Obj.pointsPerMinute = parseFloat((p1Obj.points / (p1durationInSeconds / 60)) / 1000).toFixed(4);
//     //     p2Obj.pointsPerMinute = parseFloat(p2Obj.points / (p2durationInSeconds / 60)).toFixed(4);
//     //   console.log("1510");
//     //     resolve({p1:p1Obj.pointsPerMinute,p2:p2Obj.pointsPerMinute});
//     //   }
//     // }




//   })

// }
