let CronJob = require("cron").CronJob;
async_lib = require("async");
let Player = require('../playerAuth/player.model').Player;
var League = require("../league/league.model").League;
common = require("../common/commonfunction");
playerLeague = require('../playerLeague/playerLeague.model').playerLeague;
const moment = require('moment-timezone');
const ct = require('countries-and-timezones');
const _ = require('lodash');
module.exports = function () {
    var job = new CronJob({
        cronTime: "0 */30 * * * *", //every 30 min
        onTick: function () {
            console.log("----- update league Cron ------");
            startCron();
        },
        start: true,
        timeZone: "America/Los_Angeles"
    }); 

    job.start();

    var startCron = async () => {
        try {

            var allLeagues = await League.find({}).lean();

            let date = new Date();
            let ISOdate = date.getTime();

            allLeagues.forEach(async (league) => {
                if (
                    league.startDate.toISOString() <= ISOdate &&
                    league.endDate.toISOString() >= ISOdate &&
                    league.leagueStatus != 'active'
                ) {
                    League.updateMany(
                        {
                            _id: league._id,
                        },
                        {
                            leagueStatus: 'active',
                        },
                        { multi: true }
                    ).exec((err, updatedLeague) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                } else if (
                    league.startDate.toISOString() < ISOdate &&
                    league.endDate.toISOString() < ISOdate &&
                    league.leagueStatus != 'closed' &&
                    league.leagueStatus != 'ended'
                ) {
                    League.updateMany(
                        {
                            _id: league._id,
                        },
                        {
                            leagueStatus: 'closed',
                        },
                        { multi: true }
                    ).exec((err, updatedLeague) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                } else if (
                    league.startDate.toISOString() > ISOdate &&
                    league.endDate.toISOString() > ISOdate &&
                    league.leagueStatus != 'upcoming'
                ) {
                    console.log('upcoming');
                    League.updateMany(
                        {
                            _id: league._id,
                        },
                        {
                            leagueStatus: 'upcoming',
                        },
                        { multi: true }
                    ).exec((err, updatedLeague) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                }
            });

        }
        catch (e) {
            console.log("error")
            console.log(e)
        }
    }

}
