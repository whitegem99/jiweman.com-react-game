let CronJob = require("cron").CronJob;
async_lib = require("async");
_ = require('lodash')
let Player = require('../playerAuth/player.model').Player;
var League = require("../league/league.model").League;
common = require("../common/commonfunction");
var moment = require('moment-timezone');
const ct = require('countries-and-timezones');



module.exports = function () {
    var job = new CronJob({
        cronTime: "0 0 8 * * *", //every day at 8
        onTick: function () {
            console.log("----- Update league notification Cron ------");
            startCron();
        },
        start: true,
        timeZone: "Africa/Nairobi"
    });

    job.start();
    startCron = async () => {
        console.log("hello")
        try {
            console.log("try")
            var getUTCTime = new Date();
            getUTCTime = getUTCTime.toUTCString();

            let nextDate = new Date();
            let endDate = nextDate.setDate(nextDate.getDate() + 1);
            endDate = new Date(endDate);
            endDate = endDate.toUTCString();

            console.log({ leagueStatus: 'upcoming', startSaleDate: { $gte: getUTCTime, $lte: endDate } })
            var getLeagueData = await League.find({ leagueStatus: 'upcoming', startSaleDate: { $gte: getUTCTime, $lte: endDate } }).sort({ startDate: 1 }).limit(2).exec();
            console.log(getLeagueData);

            if (_.isEmpty(getLeagueData)) {
                console.log("getLeague data not found");
                return;
            }

            const countries = await ct.getAllCountries();
            var getPlayerList = await Player.find({ registrationStatus: "verified", email: { $in: ["ruchikapawar7@gmail.com", "ruchikapawar771@gmail.com", "ruchika.pawar@jiweman.com", "pandeashish233@gmail.com"] } })



            if (_.isEmpty(getPlayerList)) {
                console.log("getPlayerList data not found");
                return;
            }

            async_lib.each(getPlayerList, function (userInfo, callback) {
                let getZone;
                let startDateFirst;
                let startDateSecond;
                let content;
                // console.log(userInfo.userName);
                // console.log(userInfo.countryOfRecidence);
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

                console.log(getZone);
                console.log(userInfo.email)
                if (getZone) {
                    if (getLeagueData.length == 2) {
                        startDateFirst = moment(getLeagueData[0].startDate).tz(getZone[0]).format('Do MMM YYYY [at] h:mmA');
                        startDateSecond = moment(getLeagueData[1].startDate).tz(getZone[0]).format('Do MMM YYYY [at] h:mmA');
                        content = `<p>You can now purchase tickets for the Most awaited upcoming <strong>${getLeagueData[0].leagueName}</strong> 
                        and <strong>${getLeagueData[1].leagueName}</strong> league CASH leader board competitions which
                        are starting on ${startDateFirst} and ${startDateSecond} dates respectively. </p>`;

                    }
                    else {
                        startDateFirst = moment(getLeagueData[0].startDate).tz(getZone[0]).format('Do MMM YYYY [at] h:mmA');
                        content = `<p>You can now purchase ticket for the Most awaited upcoming <strong>${getLeagueData[0].leagueName}</strong> CASH leader board competitions which are starting on ${startDateFirst}.</p>`
                    }
                }

                if (!content) {
                    return callback();
                }

                let subject = 'Joga-Bonito – Introducing upcoming League'

                let body = `<div style="width: 680px;margin: 0 auto;"> 
            <div style="background:#504482;height: 80px;"> 
            <h3 style="color: #fff;font-size: 36px;font-weight: normal;padding: 18px 0 0 70px;margin: 0;"> Welcome to Joga Bonito </h3> 
            </div> 
            <div style="background: #fff;padding:23px 70px 20px 70px;"> 
            <h4 style="font-size: 24px; color: #504482; margin: 20px 0 30px;">Hello ${userInfo.userName}, </h4> 
            <div style="color: #8b8382; font-size: 15px;"> 
            <p>Congratulations, Here we have great news for you!</p>
            ${content}
            <p>Hurry Up!!! Advance Purchasing is open now!!!</p>
            <p>Let's play FANTASTIC Games together!!!</p>
            <p>Cheers!!!</p>
            <div style="display:block;margin: 90px 0;"> 
            </div> 
            </div> 
            </div>  
            <div style="height: 52px;background:#dfdfdf;"></div> 
            </div>`
                common.sendEmail(userInfo.email, body, subject);
                callback();
            })

        }
        catch (e) {
            console.log("error")
            console.log(e)
        }
    }


}
