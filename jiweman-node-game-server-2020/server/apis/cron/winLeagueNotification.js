let CronJob = require("cron").CronJob;
async_lib = require("async");
let Player = require('../playerAuth/player.model').Player;
var League = require("../league/league.model").League;
common = require("../common/commonfunction");


module.exports = function () {
    // var job = new CronJob({
    //     cronTime: "* * * * * ", //every 5 second
    //     onTick: function() {
    //       console.log("----- Manager Cron ------");
    //       startCron();
    //     },
    //     start: true,
    //     timeZone: "America/Los_Angeles"
    //   });startCron

    //   job.start();




    startCron = async () => {
        try {
            var getLeagueData = await League.find({ leagueStatus: 'closed' }).sort({ startDate: -1 }).limit(2).exec();
            var getPlayerList = await Player.find({ registrationStatus: "verified" })
            async_lib.each(getPlayerList, function (userInfo, callback) {
                let body = `<div style="width: 680px; margin: 0 auto;">
        <div style="background: #504482; height: 80px;">
        <h3 style="color: #fff; font-size: 36px; font-weight: normal; padding: 18px 0 0 70px; margin: 0;">Welcome to Joga Bonito</h3>
        </div>
        <div style="background: #fff; padding: 23px 70px 20px 70px;">
        <h4 style="font-size: 24px; color: #504482; margin: 20px 0 30px;">Hello ${userName},</h4>
        <div style="color: #8b8382; font-size: 15px;">
        <p>Congratulations, you&rsquo;ve won the {prize} Prize in our &lsquo; {leagueName}!</p>
        <p>To claim your prize, please follow these steps:</p>
        <p>Confirm that you meet all of the entry requirements all seeps</p>
        <p>Cheers,</p>
        <div style="display: block; margin: 90px 0;">&nbsp;</div>
        </div>
        </div>
        <div style="height: 52px; background: #dfdfdf;">&nbsp;</div>
        </div>`

                // common.sendEmail()

            })



        }
        catch (e) {
            console.log("error")
            console.log(e)
        }
    }
    startCron()
}
