let CronJob = require('cron').CronJob;
async_lib = require('async');
let Player = require('../playerAuth/player.model').Player;
var League = require('../league/league.model').League;
var common = require('../common/commonfunction');
var playerLeague = require('../playerLeague/playerLeague.model').playerLeague;
const moment = require('moment-timezone');
const _ = require('lodash');
const { Statistics } = require('../analytics/analytics.model');
let Match = require('../matchPlay/matchplay.model').Match;
let Download = require('../analytics/analytics.model').Download;

module.exports = function () {
  var job = new CronJob({
    cronTime: '0 */45 * * * *', //every 45 min
    onTick: function () {
      console.log('----- Analytics Cron ------');
      startCron();
    },
    start: true,
    timeZone: 'America/Los_Angeles',
  });

  job.start();
  console.log('In Statistics Calculation');

  var startCron = async () => {
    try {
      var statsData = {};

      Match.find({ matchStatus: 'finished' }).exec(function (err, matches) {
        var totalMatchesPlayed = matches.length;
        statsData['totalMatches'] = totalMatchesPlayed;

        let totalGoals = matches.reduce((s, f) => {
          return s + parseInt(f.playerOneGoal); // return the sum of the accumulator and the current time, as the the new accumulator
        }, 0);
        statsData['totalGoals'] = totalGoals;
        statsData['macthesCount'] = _.countBy(matches, 'matchType');
        statsData['totalTimeSpent'] = 0;
        statsData['femaleTimeSpent'] = 0;
        statsData['maleTimeSpent'] = 0;
        statsData['18-21'] = 0;
        statsData['22-25'] = 0;
        statsData['26+'] = 0;

        League.find().exec(function (err, leagues) {
          var onGoingLeagues = _.filter(leagues, function (item, index) {
            return item.startDate < new Date() && item.endDate > new Date();
          });
          statsData['onGoingLeagues'] = onGoingLeagues.length;
          Player.find().exec(function (err, players) {
            Object.entries(players).forEach(
              ([playerKey, value], playerIndex) => {
                Object.entries(matches).forEach(([key, value], index) => {
                  let diff = new Date(
                    matches[index].updatedAt - matches[index].createdAt
                  );
                  var hours = diff.getUTCHours();
                  var minutes = diff.getUTCMinutes();
                  var seconds = diff.getUTCSeconds();

                  if (
                    players[playerIndex].userName ==
                      matches[index].playerOneUserName ||
                    (players[playerIndex].userName ==
                      matches[index].playerTwoUserName &&
                      players[playerIndex].gender == 'female')
                  ) {
                    statsData['femaleTimeSpent'] =
                      statsData['femaleTimeSpent'] + minutes;
                  } else if (
                    players[playerIndex].userName ==
                      matches[index].playerOneUserName ||
                    (players[playerIndex].userName ==
                      matches[index].playerTwoUserName &&
                      players[playerIndex].gender == 'male')
                  ) {
                    statsData['maleTimeSpent'] =
                      statsData['maleTimeSpent'] + minutes;
                  }

                  if (
                    players[playerIndex].userName ==
                      matches[index].playerOneUserName ||
                    players[playerIndex].userName ==
                      matches[index].playerTwoUserName
                  ) {
                    if (
                      players[playerIndex].age <= 21 &&
                      players[playerIndex].age >= 18
                    ) {
                      console.log('inside 18-21');
                      statsData['18-21'] = statsData['18-21'] + minutes;
                    }
                  }

                  if (
                    players[playerIndex].userName ==
                      matches[index].playerOneUserName ||
                    players[playerIndex].userName ==
                      matches[index].playerTwoUserName
                  ) {
                    if (
                      players[playerIndex].age <= 25 &&
                      players[playerIndex].age >= 22
                    ) {
                      console.log('inside 22-25');
                      statsData['22-25'] = statsData['22-25'] + minutes;
                    }
                  }

                  if (
                    players[playerIndex].userName ==
                      matches[index].playerOneUserName ||
                    players[playerIndex].userName ==
                      matches[index].playerTwoUserName
                  ) {
                    if (players[playerIndex].age >= 26) {
                      statsData['26+'] = statsData['26+'] + minutes;
                    }
                  }
                });
              }
            );

            matches.forEach((match) => {
              if ((match.matchStatus = 'finished')) {
                let diff = new Date(match.updatedAt - match.createdAt);
                var hours = diff.getUTCHours();
                var minutes = diff.getUTCMinutes();
                var seconds = diff.getUTCSeconds();
                statsData['totalTimeSpent'] =
                  statsData['totalTimeSpent'] + minutes;
              }
            });

            var totalPlayersOnboarded = players.length;
            statsData['totalPlayersOnboarded'] = totalPlayersOnboarded;

            var statsByGender = _.countBy(players, 'gender');
            statsData['statsByGender'] = statsByGender;

            var statsByCountry = _.countBy(players, 'countryOfRecidence');
            statsData['statsByCountry'] = statsByCountry;
            statsData['agewise'] = {};
            var player18_21 = players.filter(function (o) {
              // check value is within the range
              // remove `=` if you don't want to include the range boundary

              return o.age <= 21 && o.age >= 18;
            });
            statsData['agewise']['18-21'] = player18_21.length;

            var player22_25 = players.filter(function (o) {
              // check value is within the range
              // remove `=` if you don't want to include the range boundary

              return o.age <= 25 && o.age >= 22;
            });
            statsData['agewise']['22-25'] = player22_25.length;
            var player26Above = players.filter(function (o) {
              // check value is within the range
              // remove `=` if you don't want to include the range boundary

              return o.age >= 26;
            });
            statsData['agewise']['26+'] = player26Above.length;
            Download.find().exec(async function (err, downloads) {
              if (err) {
                console.log(err);
              } else {
                if (downloads.length > 0)
                  statsData['downloads'] = downloads[0]['totalDownload'];
                else statsData['downloads'] = 0;
                await Statistics.deleteMany({});
                await Statistics.create(statsData);
                // sendResponse.sendSuccessData(statsData, res);
              }
            });
          });
        });
      });
    } catch (e) {
      console.log('error');
      console.log(e);
    }
  };
};
