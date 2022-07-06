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
        cronTime: "0 */20 * * * *", //every 20 min
        onTick: function () {
            console.log("----- League notification Cron ------");
            startCron();
        },
        start: true,
        timeZone: "America/Los_Angeles"
    }); 

    job.start();
    console.log("in start league cron")



   var  startCron = async () => {
        console.log("startLeagueNotification>>>>")
        try {
            const countries = ct.getAllCountries();
            var getUTCDate = new Date();
            getUTCDate = getUTCDate.toUTCString();
            console.log(getUTCDate);
            let getLeagueData = await League.find({ leagueStatus: "upcoming", startDate: { $gte: getUTCDate } }).sort({ startDate: 1 }).limit(1).exec();

            console.log("getLeagueData")
            console.log(getLeagueData)
            if (_.isEmpty(getLeagueData)) {
                console.log("getLeagueData data not found")
                return;
            }

            let getPlayerLeague = await playerLeague.find({ leagueId: getLeagueData[0]._id }).exec();

            console.log("getPlayerLeague")
            console.log(getPlayerLeague)

            if (_.isEmpty(getPlayerLeague)) {
                console.log("getPlayerLeague data not found")
                return;
            }

            let getUserIdList = getPlayerLeague.map(info => info.userId);
            let getPlayerList = await Player.find({ registrationStatus: "verified", _id: { $in: getUserIdList } })

            console.log("getPlayerList")
            console.log(getPlayerList);

            if (_.isEmpty(getPlayerList)) {
                console.log("(getPlayerList data not found")
                return;
            }

            async_lib.each(getPlayerList, function (userInfo, callback) {

                let getZone;
                let startDate;
                let currentDate;

                _.forEach(countries, function (info) {
                    if (userInfo.countryOfRecidence) {
                        if (info.name.toLowerCase() == (userInfo.countryOfRecidence.toLowerCase())) {
                            getZone = moment.tz.zonesForCountry(info.id);

                        }
                        else {
                            getZone = moment.tz.zonesForCountry("KE");
                        }
                    }
                    else {
                        getZone = moment.tz.zonesForCountry("KE");
                    }
                })

                let hours;
                let minutes;


                if (getZone) {
                    startDate = moment(getLeagueData[0].startDate).tz(getZone[0]);
                    currentDate = moment().tz(getZone[0]);
                    hours = startDate.diff(currentDate, "hours");
                    minutes = startDate.diff(currentDate, "minutes");
                }
                console.log(hours);
                console.log(minutes);
                console.log(startDate);
                console.log(currentDate);

                let getTicket = _.find(getPlayerLeague, { leagueId: getLeagueData[0]._id, userId: userInfo._id, ticketFlag: true })
                console.log("ticket")
                            

                if (getTicket && getTicket.ticket && minutes >=0 && minutes <= 60) {

                    let subject = `Joga-Bonito –  ${getLeagueData[0].leagueName} is starting in an hour`;
                    let body = `<div style="width: 680px; margin: 0 auto;">
                            <div style="background: #504482; height: 80px;">
                            <h3 style="color: #fff; font-size: 36px; font-weight: normal; padding: 18px 0 0 70px; margin: 0;">Welcome to Joga Bonito</h3>
                            </div>
                            <div style="background: #fff; padding: 23px 70px 20px 70px;">
                            <h4 style="font-size: 24px; color: #504482; margin: 20px 0 30px;">Hi ${userInfo.userName},</h4>
                            <div style="color: #8b8382; font-size: 15px;">
                            <p>Hey, Congratulations, Your waiting will over soon!!! Joga-Bonito <strong>${getLeagueData[0].leagueName}</strong>! is starting in an hour.</p>
                            <p>You have successfully purchased the ticket for <strong>${getLeagueData[0].leagueName}</strong>!</p>
                            <p>Please, find below the ticket to get entry in the <strong>${getLeagueData[0].leagueName}</strong></p>
                            <p><strong>${getTicket.ticket}</strong></p>
                            <p>Let's play FANTASTIC Games together!!!</p>
                            <p>Cheers!!!</p>
                            <div style="display: block; margin: 90px 0;">&nbsp;</div>
                            </div>
                            </div>
                            <div style="height: 52px; background: #dfdfdf;">&nbsp;</div>
                            </div>`;
                    common.sendEmail(userInfo.email, body, subject);
                    callback();

                }
                else {
                    console.log("hours" + hours);
                    console.log("minutes", minutes);
                    callback();
                }

            })
        }
        catch (e) {
            console.log("error")
            console.log(e)
        }
    }
  
}
