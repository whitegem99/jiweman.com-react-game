let func = require('../common/commonfunction');
let sendResponse = require('../common/sendresponse');
let logger = require('../../logger/log');
var mongoose = require('mongoose');
let Player = require('../playerAuth/player.model').Player;
let Role = require('../playerAuth/player.model').Role;
let Match = require('../matchPlay/matchplay.model').Match;
let LeaderBoard = require('../leaderboard/leaderboard.model').LeaderBoard;

/*
 * --------------------------------------------------------------------------
 * Matches Played by each Player API start
 * ---------------------------------------------------------------------------
 */

exports.matchesPlayedByPlayer = (req, res) => {
  console.log('inside matchesPlayedByPlayer');

  func.checkUserAuthentication(req, res, function (payload) {
    var userName = req.query.userName;
    var allMatchesPlayed = 0;
    // var playWithFriendsMatches;
    // var leagueMatches;

    if (userName) {
      LeaderBoard.find({ playerName: userName }).exec((err, playerData) => {
        playerData.forEach((player) => {
          if (
            player.gameType == 'oneonone' ||
            player.gameType == 'leagueGamePlay' ||
            player.gameType == 'playWithFriends'
          ) {
            allMatchesPlayed = allMatchesPlayed + player.matchesPlayed;
            // console.log('allMatchesPlayed',allMatchesPlayed);
          } else {
            res.json({
              status: 400,
              message: 'something went wrong',
            });
            console.log('something went wrong');
          }
          //  else if(player.gameType == leagueGamePlay) {
          //     oneononeMatches = player.matchesPlayed
          // } else if(player.gameType == oneonone) {
          //     oneononeMatches = player.matchesPlayed
          // }
        });

        if (allMatchesPlayed) {
          res.json({
            status: 200,
            message: 'All matches Played By Player',
            data: allMatchesPlayed,
          });
        } else if (!allMatchesPlayed) {
          res.json({
            status: 400,
            message: 'No data found',
          });
        }
      });
    } else {
      res.json({
        status: 400,
        message: 'Player name is missing',
      });
    }
  });
};

/*
 * --------------------------------------------------------------------------
 * Time spent on each match by each Player API start
 * DEPRECATED, Logic has a nested looop. Needs to be removed once the optimized logic is tested, verified.
 * ---------------------------------------------------------------------------
 */

exports.playerStats = (req, res) => {
  func.checkUserAuthentication(req, res, function (payload) {
    var userName = req.query.userName;
    var player;
    // var playerOneTime = 0;
    // var playerTwoTime = 0;

    // var p1hours = 0;
    // var p1minutes = 0;
    // var p1seconds = 0;

    // var p2hours = 0;
    // var p2minutes = 0;
    // var p2seconds = 0;
    var statsData = {};
    Match.find({ matchStatus: 'finished' }).exec((err, matchData) => {
      matchData.forEach((match) => {
        let diff = new Date(match.updatedAt - match.createdAt);
        var hours = diff.getUTCHours();
        var minutes = diff.getUTCMinutes();
        var seconds = diff.getUTCSeconds();

        var p1timeSpentArray = [];
        var p2timeSpentArray = [];

        if (statsData[match.playerOneUserName]) {
          // console.log('in p1 user found')
          p1timeSpentArray.push(minutes);
          statsData[match.playerOneUserName][
            'timeSpentForEachMatch'
          ] = statsData[match.playerOneUserName][
            'timeSpentForEachMatch'
          ].concat(p1timeSpentArray);
          var median = calcMedian(
            statsData[match.playerOneUserName]['timeSpentForEachMatch']
          );
          statsData[match.playerOneUserName]['median'] = median;
          statsData[match.playerOneUserName]['timespent'] =
            statsData[match.playerOneUserName]['timespent'] + minutes;
          statsData[match.playerOneUserName].totalmatches =
            statsData[match.playerOneUserName].totalmatches + 1;
          statsData[match.playerOneUserName]['averagetimeSpent'] =
            statsData[match.playerOneUserName]['timespent'] /
            statsData[match.playerOneUserName].totalmatches;
        } else {
          statsData[match.playerOneUserName] = {};

          p1timeSpentArray.push(minutes);
          statsData[match.playerOneUserName][
            'timeSpentForEachMatch'
          ] = p1timeSpentArray;
          var median1 = calcMedian(
            statsData[match.playerOneUserName]['timeSpentForEachMatch']
          );
          statsData[match.playerOneUserName]['median'] = median1;
          statsData[match.playerOneUserName]['timespent'] = minutes;
          statsData[match.playerOneUserName]['totalmatches'] = 1;
          statsData[match.playerOneUserName]['averagetimeSpent'] =
            statsData[match.playerOneUserName]['timespent'];
        }

        if (statsData[match.playerTwoUserName]) {
          p2timeSpentArray.push(minutes);
          statsData[match.playerTwoUserName][
            'timeSpentForEachMatch'
          ] = statsData[match.playerTwoUserName][
            'timeSpentForEachMatch'
          ].concat(p2timeSpentArray);
          var median = calcMedian(
            statsData[match.playerTwoUserName]['timeSpentForEachMatch']
          );
          statsData[match.playerTwoUserName]['median'] = median;
          statsData[match.playerTwoUserName]['timespent'] =
            statsData[match.playerTwoUserName]['timespent'] + minutes;
          statsData[match.playerTwoUserName].totalmatches =
            statsData[match.playerTwoUserName].totalmatches + 1;
          statsData[match.playerTwoUserName]['averagetimeSpent'] =
            statsData[match.playerTwoUserName]['timespent'] /
            statsData[match.playerTwoUserName].totalmatches;
        } else {
          statsData[match.playerTwoUserName] = {};

          p2timeSpentArray.push(minutes);
          statsData[match.playerTwoUserName][
            'timeSpentForEachMatch'
          ] = p2timeSpentArray;
          var median2 = calcMedian(
            statsData[match.playerTwoUserName]['timeSpentForEachMatch']
          );
          statsData[match.playerTwoUserName]['median'] = median2;
          statsData[match.playerTwoUserName]['timespent'] = minutes;
          statsData[match.playerTwoUserName]['totalmatches'] = 1;
          statsData[match.playerTwoUserName]['averagetimeSpent'] =
            statsData[match.playerTwoUserName]['timespent'];
        }
      });

      Object.size = function (statsData) {
        var size = 0,
          key;
        for (key in statsData) {
          if (statsData.hasOwnProperty(key)) size++;
        }
        return size;
      };

      Player.find({ accountType: 'normal' }, { password: 0 }, function (
        err,
        result
      ) {
        if (result) {
          var result = JSON.parse(JSON.stringify(result));
          var playerDataSize = Object.size(result);
          var counter = 0;
          Object.entries(result).forEach(([playerKey, value], playerIndex) => {
            Object.entries(statsData).forEach(([key, value], index) => {
              ++counter;
              console.log(
                result[playerIndex].userName,
                key,
                result[playerIndex].userName == key,
                !result[playerIndex].userName == key
              );
              if (result[playerIndex].userName == key) {
                console.log(result[playerIndex].userName);

                result[playerKey]['timespent'] = statsData[key]['timespent'];
                result[playerKey]['median'] = statsData[key]['median'];
                result[playerKey]['totalmatches'] =
                  statsData[key]['totalmatches'];
                result[playerKey]['averagetimeSpent'] =
                  statsData[key]['averagetimeSpent'];
                result[playerKey]['timeSpentForEachMatch'] =
                  statsData[key]['timeSpentForEachMatch'];

                //This condition is wrong, this will always be false...
              } else if (!result[playerIndex].userName == key) {
                console.log('Not a single mismatch in else');
                result[playerKey]['timespent'] = 0;
                result[playerKey]['median'] = 0;
                result[playerKey]['totalmatches'] = 0;
                result[playerKey]['averagetimeSpent'] = 0;
                result[playerKey]['timeSpentForEachMatch'] = 0;
              }
            });
          });
          res.status(200).send({
            status: 200,
            message: 'players stats data found',
            data: result,
            counter,
          });
        } else {
          res.status(400).send({
            status: 400,
            message: 'No data found',
          });
        }
      });
    });
  });

  function calcMedian(ar1) {
    var half = Math.floor(ar1.length / 2);

    ar1.sort(function (a, b) {
      return a - b;
    });

    if (ar1.length % 2) {
      return ar1[half];
    } else {
      return (ar1[half - 1] + ar1[half]) / 2.0;
    }
  }
};

/*
 * --------------------------------------------------------------------------
 * Time spent on each match by each Player API start
 * This is the replica of of the above logic but optimized. For a certain data set above one ran 5124 loops, for same this runs 84
 * ---------------------------------------------------------------------------
 */
exports.playerStatsOptimized = (req, res) => {
  func.checkUserAuthentication(req, res, function (payload) {
    var statsData = {};
    var counter = 0;
    Match.find({ matchStatus: 'finished', bettingCompanyId: payload.admin.bettingCompanyId }).exec((err, matchData) => {
      console.log('Match Data length', matchData.length);
      matchData.forEach((match) => {
        ++counter;
        let diff = new Date(match.updatedAt - match.createdAt);
        var hours = diff.getUTCHours();
        var minutes = diff.getUTCMinutes();
        var seconds = diff.getUTCSeconds();

        var p1timeSpentArray = [];
        var p2timeSpentArray = [];

        if (statsData[match.playerOneUserName]) {
          // console.log('in p1 user found')
          p1timeSpentArray.push(minutes);
          statsData[match.playerOneUserName][
            'timeSpentForEachMatch'
          ] = statsData[match.playerOneUserName][
            'timeSpentForEachMatch'
          ].concat(p1timeSpentArray);
          var median = calcMedian(
            statsData[match.playerOneUserName]['timeSpentForEachMatch']
          );
          statsData[match.playerOneUserName]['median'] = median;
          statsData[match.playerOneUserName]['timespent'] =
            statsData[match.playerOneUserName]['timespent'] + minutes;
          statsData[match.playerOneUserName].totalmatches =
            statsData[match.playerOneUserName].totalmatches + 1;
          statsData[match.playerOneUserName]['averagetimeSpent'] =
            statsData[match.playerOneUserName]['timespent'] /
            statsData[match.playerOneUserName].totalmatches;
        } else {
          statsData[match.playerOneUserName] = {};

          p1timeSpentArray.push(minutes);
          statsData[match.playerOneUserName][
            'timeSpentForEachMatch'
          ] = p1timeSpentArray;
          var median1 = calcMedian(
            statsData[match.playerOneUserName]['timeSpentForEachMatch']
          );
          statsData[match.playerOneUserName]['median'] = median1;
          statsData[match.playerOneUserName]['timespent'] = minutes;
          statsData[match.playerOneUserName]['totalmatches'] = 1;
          statsData[match.playerOneUserName]['averagetimeSpent'] =
            statsData[match.playerOneUserName]['timespent'];
        }

        if (statsData[match.playerTwoUserName]) {
          p2timeSpentArray.push(minutes);
          statsData[match.playerTwoUserName][
            'timeSpentForEachMatch'
          ] = statsData[match.playerTwoUserName][
            'timeSpentForEachMatch'
          ].concat(p2timeSpentArray);
          var median = calcMedian(
            statsData[match.playerTwoUserName]['timeSpentForEachMatch']
          );
          statsData[match.playerTwoUserName]['median'] = median;
          statsData[match.playerTwoUserName]['timespent'] =
            statsData[match.playerTwoUserName]['timespent'] + minutes;
          statsData[match.playerTwoUserName].totalmatches =
            statsData[match.playerTwoUserName].totalmatches + 1;
          statsData[match.playerTwoUserName]['averagetimeSpent'] =
            statsData[match.playerTwoUserName]['timespent'] /
            statsData[match.playerTwoUserName].totalmatches;
        } else {
          statsData[match.playerTwoUserName] = {};

          p2timeSpentArray.push(minutes);
          statsData[match.playerTwoUserName][
            'timeSpentForEachMatch'
          ] = p2timeSpentArray;
          var median2 = calcMedian(
            statsData[match.playerTwoUserName]['timeSpentForEachMatch']
          );
          statsData[match.playerTwoUserName]['median'] = median2;
          statsData[match.playerTwoUserName]['timespent'] = minutes;
          statsData[match.playerTwoUserName]['totalmatches'] = 1;
          statsData[match.playerTwoUserName]['averagetimeSpent'] =
            statsData[match.playerTwoUserName]['timespent'];
        }
      });

      Object.size = function (statsData) {
        var size = 0,
          key;
        for (key in statsData) {
          if (statsData.hasOwnProperty(key)) size++;
        }
        return size;
      };
       console.log(typeof payload.admin.bettingCompanyId);
      Player.find({ accountType: 'normal', bettingCompanyId: payload.admin.bettingCompanyId }, { password: 0 }, function (
        err,
        result
      ) {
        if (result) {
          var result = JSON.parse(JSON.stringify(result));

          Object.entries(result).forEach(([playerKey, value], playerIndex) => {
            ++counter;
            const userName = result[playerIndex].userName;
            const dataByUserName = statsData[userName];
            result[playerKey]['timespent'] = _.get(
              dataByUserName,
              ['timespent'],
              0
            );
            result[playerKey]['median'] = _.get(dataByUserName, ['median'], 0);
            result[playerKey]['totalmatches'] = _.get(
              dataByUserName,
              ['totalmatches'],
              0
            );
            result[playerKey]['averagetimeSpent'] = _.get(
              dataByUserName,
              ['averagetimeSpent'],
              0
            );
            result[playerKey]['timeSpentForEachMatch'] = _.get(
              dataByUserName,
              ['timeSpentForEachMatch'],
              0
            );
          });
          res.status(200).send({
            status: 200,
            message: 'Players stats data found',
            data: result,
            counter,
          });
        } else {
          res.status(400).send({
            status: 400,
            message: 'No data found',
          });
        }
      });
    });
  });

  function calcMedian(ar1) {
    var half = Math.floor(ar1.length / 2);

    ar1.sort(function (a, b) {
      return a - b;
    });

    if (ar1.length % 2) {
      return ar1[half];
    } else {
      return (ar1[half - 1] + ar1[half]) / 2.0;
    }
  }
};
