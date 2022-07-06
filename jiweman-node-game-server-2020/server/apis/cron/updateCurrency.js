let CronJob = require("cron").CronJob;
async_lib = require("async");
let Player = require('../playerAuth/player.model').Player;
var League = require("../league/league.model").League;
common = require("../common/commonfunction");
playerLeague = require('../playerLeague/playerLeague.model').playerLeague;
currencydata = require('../playerLeague/playerLeague.model').currencydata;
const { bettingCompany } = require('../bettingCompany/bettingCompany.model');
const moment = require('moment-timezone');
const ct = require('countries-and-timezones');
const _ = require('lodash');
const axios = require('axios').default;

module.exports = function () {

    var job = new CronJob({
        cronTime: "*/30 * * * *", //every 30 min
        onTick: function () {
            console.log("----- update currency rate Cron ------");
            startCron();
        },
        start: true,
        timeZone: "America/Los_Angeles"
    }); 

    job.start();

    var startCron = async () => {
        try {
            const result = await bettingCompany.findOne({status:'Active'})
            const apiToken = result.apiToken

            beynoicAmountCoversionData = await axios.get(
                `https://app.beyonic.com/api/currencies`,
                {
                  headers: {
                    authorization: `Token ${apiToken}`,
                  },
                }
              );

            if(beynoicAmountCoversionData && beynoicAmountCoversionData.data &&  beynoicAmountCoversionData.data.length){

                beynoicAmountCoversionData.data.map(async function(country){

                    await currencydata.findOneAndUpdate({
                        id: country.id
                    }, {
                        usd_rate: country.usd_rate
                    }, {
                        upsert: true
                    })

                    console.log(ountry.id)
    

                })

                


            }
        }
        catch (e) {
            console.log("error")
            console.log(e)
        }
    }

    // startCron();

}
