const bettingCompany = require('../bettingCompany/bettingCompany.model').bettingCompany;
let CronJob = require("cron").CronJob;
var playerLeague = require('../playerLeague/playerLeague.model').playerLeague;
const { playerBet } = require('../playerOneVSOneBet/playerOneVSOneBet.model');
const { invoice } = require('../invoice/invoice.model');
var ObjectID = require('mongodb').ObjectID;
let moment = require('moment');

module.exports = function () {
    // var job = new CronJob({
    //     cronTime: "0 8 * * * *", //every 30 min
    //     onTick: function () {
    //         console.log("----- Generate Invoices Cron ------");
    //         startCron();
    //     },
    //     start: true,
    //     timeZone: "America/Los_Angeles"
    // });

    // job.start();
    // var startCron = async () => {
        
    //     let result = await bettingCompany.find({status: 'Active'}).lean();
    //     let endTime = moment().endOf('day').subtract(1, 'days').toDate();
        

    //     result.map(async function(company){

    //         // console.log(company)
    //         console.log(endTime)

    //         let query = { bettingCompanyId:ObjectID(company._id) }

    //         if (company.lastTimeInvoiceGenerated){

    //             query.createdAt =  {$gte: lastTimeInvoiceGenerated, $lte: endTime} 

    //         }else{

    //             query.createdAt =  {$lte: endTime} 

    //         }

    //         const leagueAmount = await playerLeague.aggregate([
    //             { $match: query },
    //             { $group: { _id: null, amount: { $sum: "$jiwemanCommision" } } }
    //         ])

    //         const oneOnOneAmount = await playerBet.aggregate([
    //             { $match: query },
    //             { $group: { _id: null, amount: { $sum: "$jiwemanCommision" } } }
    //         ])

    //         let invoiceObj = new invoice();

    //         invoiceObj.leagueAmount = leagueAmount && leagueAmount.length ? leagueAmount[0].amount : 0
    //         invoiceObj.oneOnOneAmount = oneOnOneAmount && oneOnOneAmount.length ? oneOnOneAmount[0].amount : 0
    //         invoiceObj.bettingCompanyName = company.name
    //         invoiceObj.bettingCompanyId = company._id
    //         invoiceObj.serverAmount = 200
    //         invoiceObj.extraAmount = 0
    //         invoiceObj.totalAmount = invoiceObj.leagueAmount + invoiceObj.oneOnOneAmount + invoiceObj.serverAmount + invoiceObj.extraAmount
    //         invoiceObj.status = "Generated"
    //         invoiceObj.startTime = company.lastTimeInvoiceGenerated ? company.lastTimeInvoiceGenerated : company.createdAt
    //         invoiceObj.endTime = endTime

    //         invoiceObj.save()


    //         console.log(leagueAmount)
    //         console.log(oneOnOneAmount)

    //     });

    // }
}
