let CronJob = require('cron').CronJob;
async_lib = require('async');
let Player = require('../playerAuth/player.model').Player;
var League = require('../league/league.model').League;
var common = require('../common/commonfunction');
playerLeague = require('../playerLeague/playerLeague.model').playerLeague;
const moment = require('moment-timezone');
const _ = require('lodash');

module.exports = function () {
  var job = new CronJob({
    cronTime: '*/20 * * * *', //every 20 min
    onTick: function () {
      console.log('----- Update leage prize Cron ------');
      startCron();
    },
    start: true,
    timeZone: 'America/Los_Angeles',
  });

  job.start();
  console.log('In Update League Prize Cron');

  var startCron = async () => {
    try {
      let getLeagueDataFoFinalPrizeUpdate = await League.find({
        lastPrizeEvaluated: {
          $in: [null, false],
        },
        endSaleDate: { $lte: new Date() },
      }).exec();
      if (_.isEmpty(getLeagueDataFoFinalPrizeUpdate)) {
        return;
      }
      for (const league of getLeagueDataFoFinalPrizeUpdate) {
        common.updateLeaguePrize(league, true);
      }
    } catch (e) {
      console.log('error');
      console.log(e);
    }
  };
};
