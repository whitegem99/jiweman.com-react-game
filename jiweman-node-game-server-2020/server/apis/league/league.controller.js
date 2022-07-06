let func = require('../common/commonfunction');
let sendResponse = require('../common/sendresponse');
let logger = require('../../logger/log');
var mongoose = require('mongoose');
var config = require('../../config');
let Player = require('../playerAuth/player.model').Player;
let Role = require('../playerAuth/player.model').Role;
var ObjectID = require('mongodb').ObjectID;
const { League, LeagueWinners } = require('../league/league.model');
var randomize = require('randomatic');
var _ = require('lodash');
var fs = require('fs');
var mime = require('mime');
var shortId = require('shortid');
const { LeaderBoard } = require('../leaderboard/leaderboard.model');
const { debitFromWallet, creditToWallet } = require('../paymentAPIs/wallet/wallet.service');
const { addToWallet } = require('../paymentAPIs/wallet/wallet.controller');
var playerLeague = require('../playerLeague/playerLeague.model').playerLeague;
var Counter = require('../settings/settings.model').Counter;
var Image = require('../settings/image.model').Image;
var Collections = require('../paymentAPIs/collections/collections.model').Collection;

// var moment = require('moment');
// moment().format();

/*
 * --------------------------------------------------------------------------
 * adding leagues API start
 * ---------------------------------------------------------------------------
 */
exports.addLeague = (req, res) => {
  console.log('inside addLeague');

  func.checkUserAuthentication(req, res, async function (payload) {
    let user = payload.sub;
    let leagueData = req.body;
    let date = new Date();
    let ISOdate = date.getTime();
    console.log("payload")
    console.log(payload)
    if (leagueData.entryFee) {
      leagueData.origianlEntryFee = leagueData.entryFee;
    }
    if (leagueData.type_of_business == 'business_first') {
      leagueData = await func.calculatePrize_1(leagueData, 'league');
    }
    else if (leagueData.type_of_business == 'customer_first') {
      leagueData = await func.calculatePrize_2(leagueData, 'league');
    }
    console.log("data>>>>>>>>>>>")
    console.log(leagueData);
    try {
      if (!req.body) {
        return res.status(200).send({ message: 'Bad Request', status: false });
      } else {
        var league = new League();

        if (!leagueData.startDate) {
          throw new Error('startDate not defined.');
        }
        if (leagueData.startDate != '' && leagueData.startDate != undefined) {
          // var startDate = func.stringToDate(leagueData.startDate);
          var startDate = new Date(leagueData.startDate).getTime();
        }

        if (!leagueData.endDate) {
          throw new Error('endDate not defined.');
        }
        if (leagueData.endDate != '' && leagueData.endDate != undefined) {
          // var endDate = func.stringToDate(leagueData.endDate);
          var endDate = new Date(leagueData.endDate).getTime();
        }

        if (!leagueData.startSaleDate) {
          throw new Error('start sale date not defined.');
        }

        if (
          leagueData.startSaleDate != '' &&
          leagueData.startSaleDate != undefined
        ) {
          // var startSaleDate = func.stringToDate(leagueData.startSaleDate);
          var startSaleDate = new Date(leagueData.startSaleDate).getTime();
        }

        if (!leagueData.endSaleDate) {
          throw new Error('endt sale date not defined.');
        }

        if (
          leagueData.endSaleDate != '' &&
          leagueData.endSaleDate != undefined
        ) {
          //var endSaleDate = func.stringToDate(leagueData.endSaleDate);
          var endSaleDate = new Date(leagueData.endSaleDate).getTime();
          console.log(endSaleDate);
        }

        if (req.body.startTime != '' && req.body.startTime != undefined) {
          var startTime = new Date(startDate);
          let getSplitTime = func.splittime(req.body.startTime);
          startTime.setHours(getSplitTime[0], getSplitTime[1]);
        }

        if (req.body.endTime != '' && req.body.endTime != undefined) {
          var endTime = new Date(endDate);
          var getSplitTime = func.splittime(req.body.endTime);
          endTime.setHours(getSplitTime[0], getSplitTime[1]);
        }

        if (startDate <= ISOdate && endDate >= ISOdate) {
          league.leagueStatus = 'active';
        } else if (startDate < ISOdate && endDate < ISOdate) {
          league.leagueStatus = 'closed';
        } else if (startDate > ISOdate && endDate > ISOdate) {
          league.leagueStatus = 'upcoming';
        }

        // startDate: "2020-10-21T00:00"
        // startSaleDate: "2020-10-10T10:00"
        // endDate: "2020-10-29T23:00"
        // endSaleDate: "2020-10-20T23:00"
        // with the given data set, the condition which was written was incorrect. Please verify again. I have changed the condition.
        if (startSaleDate > endSaleDate) {
          return res.status(200).send({
            message: 'start sale Date must be less than end sale Date',
            status: false,
          });
        }
        if (startSaleDate >= endDate) {
          return res.status(200).send({
            message: 'start sale date must be less than league end Date',
            status: false,
          });
        }

        if (endSaleDate > endDate) {
          return res.status(200).send({
            message: 'end sale date must be less than league end Date',
            status: false,
          });
        }

        // if (endSaleDate > startDate) {
        //   return res.status(400).send({
        //     message: 'end sale date must be less than league start Date',
        //     status: false,
        //   });
        // }

        if (!leagueData.numberOfGoalsToWin) {
          return res.status(200).send({
            message: 'please enter number of goals to win the match',
            status: false,
          });
        }

        if (!leagueData.leagueCardImageUrl) {
          return res.status(200).send({
            message: 'please upload league image card',
            status: false,
          });
        }

        if (startDate < endDate) {
          // if (
          //   leagueData.prizeDistributionPercentages.length ==
          //   leagueData.numberOfPrizes
          // ) {
            var leagueI1 = 'Top players will get exciting prizes and please see leaderboard for more information.';
            var leagueI2 = leagueData.numberOfGoalsToWin + ' goals to win';

          league.leagueInfo.push(leagueI1);
          league.leagueInfo.push(leagueI2);

          league.startDate = startDate;
          league.endDate = endDate;
          // (league.startTime = startTime),
          // (league.endTime = endTime),
          league.leagueName = leagueData.leagueName;
          league.brandId = leagueData.brandId;
          league.leagueType = leagueData.leagueType;
          league.numberOfPrizes = leagueData.numberOfPrizes;
          // league.prizeDistributionPercentages =
          //   leagueData.prizeDistributionPercentages;
          league.gameCount = leagueData.gameCount;
          league.entryFee = leagueData.entryFee;
          league.leagueCardImageUrl = leagueData.leagueCardImageUrl;
          // league.imageId = shortId.generate();
          league.leagueInfo = league.leagueInfo;
          league.numberOfGoalsToWin = leagueData.numberOfGoalsToWin;
          league.startSaleDate = new Date(req.body.startSaleDate);
          league.endSaleDate = new Date(req.body.endSaleDate);
          league.leagueMessage = leagueData.leagueMessage
            ? leagueData.leagueMessage
            : '';
          // (league.leagueStatus = leagueData.leagueStatus, leagueI1);
          league.currencyConversionRisk = leagueData.currencyConversionRisk;
          league.allowedCountries = leagueData.allowedCountries;
          league.sponsorPrizeAmount = leagueData.sponsorPrizeAmount;
          league.prizePoolPercentage = leagueData.prizePoolPercentage;
          league.jiwemanCommisionPercentage =
            leagueData.jiwemanCommisionPercentage;
          league.prizeDistributionType = leagueData.prizeDistributionType;
          league.gameRegionType = leagueData.gameRegionType;
          league.gameCurrency = leagueData.gameCurrency;
          league.prizePercentage = leagueData.prizePercentage;
          league.minimumReward = leagueData.minimumReward;
          league.bettingCompanyCommisionPercentage = leagueData.bettingCompanyCommisionPercentage;
          league.stakeAmount = leagueData.stakeAmount;
          league.salesTax = leagueData.salesTax;
          league.winningTax = leagueData.winningTax;
          league.taxOnStakeOfBet = leagueData.taxOnStakeOfBet;
          league.taxOnGrossSale = leagueData.taxOnGrossSale;
          league.taxOnBettingStake = leagueData.taxOnBettingStake;
          league.bettingCompanyCommission = leagueData.bettingCompanyCommission;
          league.gameplayWinningsAmountToBeWonPerBet = leagueData.gameplayWinningsAmountToBeWonPerBet;
          league.jiwemanCommision = leagueData.jiwemanCommision;
          league.bettingCompanyId = payload.admin.bettingCompanyId;
          league.type_of_business = leagueData.type_of_business;
          // } else {
          //   res.status(400).send({
          //     message: 'numberOfPrizes should be equal to total prizes count',
          //     status: false,
          //   });
          // }
        } else {
          res.status(200).send({
            message: 'endDate must be greater than startDate',
            status: false,
          });
        }
        console.log('league', league);

        League.find({ leagueName: leagueData.leagueName }, function (
          err,
          docs
        ) {
          if (docs.length) {
            res.status(200).send({
              message: 'This league is already added',
              status: false,
            });
          } else {
            league.save().then(function (data, err) {
              if (err) {
                console.log(err);
                let msg = 'some error occurred';
                sendResponse.sendErrorMessage(msg, res);
              } else {
                console.log(data);
                func.updateLeaguePrize(data).then(() => {
                  res.json({
                    status: 200,
                    message: 'Data saved',
                    data: data,
                  });
                });
              }
            });
          }
        });
      }
    } catch (e) {
      return res.status(200).send({
        message: e.message,
        status: false,
      });
    }
  });
};

/*
 * --------------------------------------------------------------------------
 * updating leagues API start
 * ---------------------------------------------------------------------------
 */
exports.updateLeague = (req, res) => {
  console.log('inside updateLeague');

  func.checkUserAuthentication(req, res, async function (payload) {
    let leagueId = req.params.leagueId;
    let leagueData = req.body;
    let date = new Date();
    let ISOdate = date.getTime();
    let startSaleDate, endSaleDate;
    var league = {};
    var getLeagueData = await League.findOne({ _id: leagueId },).lean();


    if (_.isEmpty(req.body.type_of_business)) {
      type = leagueData.type_of_business;
    }
    else {
      type = req.body.type_of_business;
    }

    leagueData = { ...getLeagueData, ...req.body };

    // console.log(leagueData);
    if (leagueData.entryFee) {
      leagueData.origianlEntryFee = leagueData.entryFee;
    }

    if (type == 'business_first') {
      leagueData = await func.calculatePrize_1(leagueData, 'league');
    }
    else if (type == 'customer_first') {
      leagueData = await func.calculatePrize_2(leagueData, 'league');
    }

    console.log('leagueData 308',leagueData);
    if (!leagueData.startDate) {
      throw new Error('startDate not defined.');
    }
    if (leagueData.startDate != '' && leagueData.startDate != undefined) {
      // var startDate = func.stringToDate(leagueData.startDate);
      var startDate = new Date(leagueData.startDate).getTime();
    }
    if (!leagueData.endDate) {
      throw new Error('endDate not defined.');
    }
    if (leagueData.endDate != '' && leagueData.endDate != undefined) {
      // var endDate = func.stringToDate(leagueData.endDate);
      var endDate = new Date(leagueData.endDate).getTime();
    }

    // if (!leagueData.startTime) {
    //     throw new Error('startTime not defined.');
    // }

    // if (req.body.startTime != '' && req.body.startTime != undefined) {
    //   var startTime = new Date(startDate);
    //   var a = func.splittime(req.body.startTime);
    //   startTime.setHours(a[0], a[1]);
    // }

    // if (req.body.endTime != '' && req.body.endTime != undefined) {
    //   var endTime = new Date(endDate);
    //   var b = func.splittime(req.body.endTime);
    //   endTime.setHours(b[0], b[1]);
    // }

    if (
      leagueData.startSaleDate != '' &&
      leagueData.startSaleDate != undefined
    ) {
      startSaleDate = new Date(leagueData.startSaleDate).getTime();
    }

    if (!leagueData.endSaleDate) {
      throw new Error('endt sale date not defined.');
    }

    if (leagueData.endSaleDate != '' && leagueData.endSaleDate != undefined) {
      endSaleDate = new Date(leagueData.endSaleDate).getTime();
    }

    if (startDate <= ISOdate && endDate >= ISOdate) {
      league.leagueStatus = 'active';
    } else if (startDate < ISOdate && endDate < ISOdate) {
      league.leagueStatus = 'closed';
    } else if (startDate > ISOdate && endDate > ISOdate) {
      league.leagueStatus = 'upcoming';
    }

    if (startSaleDate > endSaleDate) {
      return res.status(200).send({
        message: 'start sale Date must be less than end sale Date',
        status: false,
      });
    }
    if (startSaleDate > endDate) {
      return res.status(200).send({
        message: 'start sale date must be less than league end Date',
        status: false,
      });
    }

    if (endSaleDate >= endDate) {
      return res.status(200).send({
        message: 'end sale date must be less than league end Date',
        status: false,
      });
    }

    // if (endSaleDate < startDate) {
    //   return res.status(400).send({
    //     message: 'end sale date must be greater than league start Date',
    //     status: false,
    //   });
    // }

    if (!leagueData.numberOfGoalsToWin) {
      return res.status(200).send({
        message: 'please enter number of goals to win the match',
        status: false,
      });
    }

    if (!leagueData.leagueCardImageUrl) {
      return res.status(200).send({
        message: 'please upload league image card',
        status: false,
      });
    }


    if (startDate < endDate) {

      // if (leagueData.numberOfPrizes)
      var leagueI1 = 'Top players will get exciting prizes and please see leaderboard for more information.';
      var leagueI2 = leagueData.numberOfGoalsToWin + 'goals to win';

      league = { leagueInfo: [] };

      league.leagueInfo.push(leagueI1);
      league.leagueInfo.push(leagueI2);

      league.startDate = startDate;
      league.endDate = endDate;

      league.leagueName = leagueData.leagueName;
      league.brandId = leagueData.brandId;
      league.leagueType = leagueData.leagueType;
      league.numberOfPrizes = leagueData.numberOfPrizes;
      league.numberOfGoalsToWin = leagueData.numberOfGoalsToWin;

      if (leagueData.leagueCardImageUrl) {
        league.leagueCardImageUrl = leagueData.leagueCardImageUrl;
      }
      league.leagueInfo = league.leagueInfo;
      league.gameCount = leagueData.gameCount;
      league.entryFee = leagueData.entryFee;
      league.currencyConversionRisk = leagueData.currencyConversionRisk;
      league.startSaleDate = startSaleDate;
      league.endSaleDate = endSaleDate;

      league.allowedCountries = leagueData.allowedCountries;
      league.sponsorPrizeAmount = leagueData.sponsorPrizeAmount;
      league.prizePoolPercentage = leagueData.prizePoolPercentage;
      league.jiwemanCommisionPercentage = leagueData.jiwemanCommisionPercentage;
      league.prizeDistributionType = leagueData.prizeDistributionType;
      league.leagueMessage = leagueData.leagueMessage
        ? leagueData.leagueMessage
        : '';
      league.gameRegionType = leagueData.gameRegionType;
      league.gameCurrency = leagueData.gameCurrency;
      league.bettingCompanyCommisionPercentage = leagueData.bettingCompanyCommisionPercentage;
      league.type_of_business = leagueData.type_of_business;
      league.prizePercentage = leagueData.prizePercentage;
      league.stakeAmount = leagueData.stakeAmount;
      league.minimumReward = leagueData.minimumReward;
      league.salesTax = leagueData.salesTax;
      league.winningTax = leagueData.winningTax;
      league.taxOnStakeOfBet = leagueData.taxOnStakeOfBet;
      league.taxOnGrossSale = leagueData.taxOnGrossSale;
      league.taxOnBettingStake = leagueData.taxOnBettingStake;
      league.bettingCompanyCommission = leagueData.bettingCompanyCommission;
      league.gameplayWinningsAmountToBeWonPerBet = leagueData.gameplayWinningsAmountToBeWonPerBet;
      league.jiwemanCommision = leagueData.jiwemanCommision;

      league = { ...leagueData };
      console.log("443>>>>>>>>>>>>>>>")
      // console.log(league);
    } else {
      res.status(200).send({
        message: 'endDate must be greater than startDate',
        status: false,
      });
    }

    if (leagueId) {
      League.findOneAndUpdate(
        {
          _id: leagueId,
        },
        league,
        {
          upsert: true,
          new: true,
          useFindAndModify: false,
        },
        async function (err, updated) {
          console.log('updated', updated);
          // console.log('error', err);
          // ctr++;
          if (err) {
            console.log("err",err)
            let msg = 'some error occurred';
            return res.status(400).json({
              status: false,
              message: 'some error occurred'
            })
            // sendResponse.sendErrorMessage(msg);
          } else {
            await func.updateLeaguePrize(updated);
            const updatedLeague = await League.findById(leagueId);
            sendResponse.sendSuccessData(updatedLeague, res);
          }
        }
      );
    } else {
      let msg = 'Send league Id';
      sendResponse.sendErrorMessage(msg, res);
    }
  });
};
/*
 * ---------------------------------------------------------------------------
 * getting leagues API start
 * ------------------------------playerLeague---------------------------------------------
 */

exports.leagues = (req, res, next) => {
  console.log('inside leagues');
  try {
    let date = new Date();
    let ISOdate = date.toISOString();
    let leaguesArray = [];
    func.checkUserAuthentication(req, res, async function (payload) {
      var query = { leagueStatus: { $in: ['active', 'upcoming'] } };

      var getPlayerCountry = await Player.findOne(
        { _id: payload.sub },
        { countryOfRecidence: 1 }
      );
      var playerCountry = [];
      if (getPlayerCountry.countryOfRecidence) {
        _.extend(query, {
          allowedCountries: {
            $in: getPlayerCountry.countryOfRecidence,
          },
        });
        playerCountry.push(getPlayerCountry.countryOfRecidence)
      }

      console.log('query', query);
      console.log("payload", payload);
      // var allLeagues = await League.find(query).lean();
      // if (allLeagues) {
      //   for (const league of allLeagues) {
      //     await func.updateLeaguePrize(league);
      //   }
      // } else {
      //   return res.send({
      //     status: false,
      //     message: 'No leagues',
      //   });
      // }

      var userId = payload.sub;

      var docs = await League.find({
        $and: [
          { startDate: { $lte: ISOdate } },
          { endDate: { $lte: ISOdate } },
        ],
        allowedCountries: { $in: playerCountry },
        bettingCompanyId: payload.bettingCompanyId
      })
        .sort({ endDate: -1 })
        .limit(5)
        .lean();

      if (docs.length) {
        docs.forEach((Element) => {
          leaguesArray.push(Element);
        });
        // leaguesArray.push(docs);
      }

      League.find({
        $and: [
          { startDate: { $lte: ISOdate } },
          { endDate: { $gte: ISOdate } },
        ],
        allowedCountries: { $in: playerCountry },
        bettingCompanyId: payload.bettingCompanyId
      })
        .lean()
        .exec((err, docs1) => {
          if (err) {
            // console.log(err)
            let msg = 'some error occurred';
            sendResponse.sendErrorMessage(msg, res);
          } else {
            if (docs1.length) {
              docs1.forEach((Element) => {
                leaguesArray.push(Element);
              });
            }

            League.find({
              $and: [
                { startDate: { $gte: ISOdate } },
                { endDate: { $gte: ISOdate } },
              ],
              allowedCountries: { $in: playerCountry },
              bettingCompanyId: payload.bettingCompanyId
            })
              .sort({ startDate: 1 })
              .limit(2)
              .lean()
              .exec(async (err, docs2) => {
                if (err) {
                  // console.log(err)
                  let msg = 'some error occurred';
                  sendResponse.sendErrorMessage(msg, res);
                } else {
                  console.log('doc length');
                  console.log(docs2.length);
                  if (docs2.length) {
                    docs2.forEach((Element) => {
                      leaguesArray.push(Element);
                    });
                  }
                  var leagueIds = leaguesArray.map((info) => info._id);
                  console.log(leagueIds);
                  console.log(userId);
                  let getPlayerLeagueData = await playerLeague
                    .find({
                      userId: userId,
                      leagueId: { $in: leagueIds },
                      remaining: {
                        $gt: 0,
                      },
                    })
                    .lean();

                  _.forEach(leaguesArray, (e) => {
                    console.log('641>>>>', e.leagueStatus);
                    var findData = _.find(getPlayerLeagueData, {
                      leagueId: e._id,
                    });
                    console.log(findData);
                    console.log('>>>>>>>>>>>>>>>');
                    if (findData && e.leagueStatus == 'active') {
                      console.log(e._id);
                      _.extend(e, { leagueEnable: true });
                      console.log(e);
                    } else {
                      console.log('else part');
                      _.extend(e, { leagueEnable: false });
                    }
                  });

                  func.addIsLeagueValidAndLocalCurrency(
                    leaguesArray,
                    payload,
                    (modifiedLeaguesArray) => {
                      res.json({
                        status: 200,
                        message: 'Data found',
                        data: modifiedLeaguesArray,
                      });
                    }
                  );

                  // res.json({
                  //   status: 200,
                  //   message: 'Data found',
                  //   data: leaguesArray,
                  // });
                }
              });
          }
        });
      //  }
      //  });
    });
  } catch (e) {
    next(e);
  }
};

/*
 * ---------------------------------------------------------------------------
 * getting leagues API start FOR PLAYERS
 * ---------------------------------------------------------------------------
 */

exports.leaguesForPlayers = (req, res, next) => {
  console.log('inside leagues');

  try {
    let date = new Date();
    let ISOdate = date.toISOString();
    let leaguesArray = [];

    func.checkUserAuthentication(req, res, async (payload) => {
      var query = { leagueStatus: { $in: ['active', 'upcoming'] } };

      var getPlayerCountry = await Player.findOne(
        { _id: payload.sub },
        {
          countryOfRecidence: 1,
          bettingCompanyId: 1
        }
      );
      var playerCountry = [];
      if (getPlayerCountry.countryOfRecidence) {
        _.extend(query, {
          allowedCountries: { $in: getPlayerCountry.countryOfRecidence },
        });
        playerCountry.push(getPlayerCountry.countryOfRecidence);
      }

      console.log('query', query);

      var docs = await League.find({
        $and: [
          { startDate: { $lte: ISOdate } },
          { endDate: { $lte: ISOdate } },
        ],
        allowedCountries: { $in: playerCountry }, bettingCompanyId: payload.bettingCompanyId
      })
        .sort({ endDate: -1 })
        .limit(1)
        .lean();

      if (docs.length) {
        leaguesArray.push(docs[0]);
      }

      League.find({
        $and: [
          { startDate: { $lte: ISOdate } },
          { endDate: { $gte: ISOdate } },
        ],
        allowedCountries: { $in: playerCountry }, bettingCompanyId: payload.bettingCompanyId
      })
        .lean()
        .exec((err, docs1) => {
          if (err) {
            // console.log(err)
            let msg = 'some error occurred';
            sendResponse.sendErrorMessage(msg, res);
          } else {
            if (docs1.length) {
              docs1.forEach((Element) => {
                leaguesArray.push(Element);
              });
            }

            League.find({
              $and: [
                { startDate: { $gte: ISOdate } },
                { endDate: { $gte: ISOdate } },
              ],
              allowedCountries: { $in: playerCountry }, bettingCompanyId: payload.bettingCompanyId
            })
              .sort({ startDate: 1 })
              .limit(2)
              .lean()
              .exec((err, docs2) => {
                if (err) {
                  // console.log(err)
                  let msg = 'some error occurred';
                  sendResponse.sendErrorMessage(msg, res);
                } else {
                  if (docs2.length) {
                    docs2.forEach((Element) => {
                      leaguesArray.push(Element);
                    });
                  }
                  func.addIsLeagueValidAndLocalCurrency(
                    leaguesArray,
                    payload,
                    (modifiedLeaguesArray) => {
                      // modifiedLeaguesArray.forEach(info=>{
                      //   var i =0;
                      //   if(info.allowedCountries.length==1){
                      //     var prizeLimit = info.numberOfPrizes;
                      //     var prizes = info.prize;
                      //     // info['currency']= info.localCurrency;
                      //       while (i != prizeLimit) {
                      //       info.prize[i] = parseInt(prizes[i] * info.conversionRate);
                      //       i++;
                      //     }
                      //   }
                      //   else{
                      //    //  info['currency']= '$'
                      //     var i=0;
                      //     var prizeLimit = info.numberOfPrizes;
                      //     var prizes = info.prize;
                      //     while (i != prizeLimit) {
                      //       info.prize[i] = parseInt(prizes[i]);
                      //       i++;
                      //     }
                      //   }
                      // })

                      func.addIsLeagueAlreadyActiveForTheUser(
                        modifiedLeaguesArray,
                        payload,
                        (remodifiedLeaguesArray) => {
                          res.json({
                            status: 200,
                            message: 'Data found',
                            data: remodifiedLeaguesArray,
                          });
                        }
                      );
                    }
                  );
                }
              });
          }
        });
      // }
      // });
    });
  } catch (e) {
    console.log(e);
    next(e);
  }
};

/*
 * ---------------------------------------------------------------------------
 * getting leagues API start FOR ADMIN
 * ---------------------------------------------------------------------------
 */

exports.leaguesForAdmin = (req, res) => {
  console.log('inside leagues');

  let date = new Date();
  let ISOdate = date.toISOString();
  let leaguesArray = [];
  var allLeagueArray = [];

  func.checkUserAuthentication(req, res, async function (payload) {
    // var query = { leagueStatus: { $in: ['active', 'upcoming'] } };
    // var allLeagues = await League.find(query).lean();

    //Comment this, after running once.
    // var allLeagues2 = await League.find({}).lean();
    // for (const league of allLeagues2) {
    //   await func.updateLeaguePrize(league);
    // }
    // Till here

    let query = {}
    if (!payload.admin.isSuperAdmin) {
      query.bettingCompanyId = payload.admin.bettingCompanyId
    }

    League.find(query).exec((err, allLeagues) => {
      if (err) {
        res.send({
          status: false,
          message: 'something went wrong',
        });
      } else if (allLeagues === undefined || allLeagues.length === 0) {
        res.send({
          status: false,
          message: 'No leagues',
          data: [],
        });
      } else if (allLeagues.length) {
        allLeagues.forEach((league) => {
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
                res.send({
                  status: false,
                  message: 'something went wrong',
                });
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
                res.send({
                  status: false,
                  message: 'something went wrong',
                });
              } else {
                allLeagueArray.push(updatedLeague);
              }
            });
          } else if (
            league.startDate.toISOString() > ISOdate &&
            league.endDate.toISOString() > ISOdate &&
            league.leagueStatus != 'upcoming'
          ) {
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
                res.send({
                  status: false,
                  message: 'something went wrong',
                });
              } else {
                allLeagueArray.push(updatedLeague);
              }
            });
          }
        });
      }
    });

    // func.checkUserAuthentication(req, res, function(payload) {

    let leagueQuery = [{ leagueStatus : { $ne: "ended" } }]
    if (!payload.admin.isSuperAdmin) {
      leagueQuery.push({bettingCompanyId : payload.admin.bettingCompanyId})
    }

    League.find({
      $and: leagueQuery,
    })
      .sort({ endDate: -1 })
      .limit(10)
      .exec((err, docs) => {
        if (err) {
          // console.log(err)
          let msg = 'some error occurred';
          sendResponse.sendErrorMessage(msg, res);
        } else {

          if (docs.length) {
            docs.forEach((Element) => {
              leaguesArray.push(Element);
            });
            // leaguesArray.push(docs);
          }

          res.json({
            status: 200,
            message: 'Data found',
            data: leaguesArray,
          });

        }
      });
  });
};

/*
 * ---------------------------------------------------------------------------
 * getting ended leagues API start
 * ---------------------------------------------------------------------------
 */
exports.endedLeagues = (req, res) => {
  console.log('inside endedLeagues');
  func.checkUserAuthentication(req, res, function (payload) {
    try {
      League.find({ leagueStatus: 'ended' }).exec((err, closedLeagues) => {
        // console.log('closedLeagues',closedLeagues);

        if (err) {
          res.send({
            status: false,
            message: 'something went wrong',
          });
        } else if (closedLeagues === undefined || closedLeagues.length === 0) {
          res.send({
            status: false,
            message: 'No leagues',
          });
        } else if (closedLeagues.length) {
          res.json({
            status: 200,
            message: 'Data found',
            data: closedLeagues,
          });
        }
      });
    } catch (e) {
      next(e);
    }
  });
};

/*
 * ---------------------------------------------------------------------------
 * deleting leagues API start
 * ---------------------------------------------------------------------------
 */

exports.deleteLeague = (req, res) => {
  console.log('inside deleteLeague');
  func.checkUserAuthentication(req, res, function (payload) {
    var leagueId = req.query.leagueId;

    League.find({
      _id: leagueId,
    }).deleteOne(function (err, data) {
      if (err) {
        return res.status(404).send({
          message: 'Something went wrong',
          status: false,
        });
      } else if (data.deletedCount == 0) {
        return res.status(400).send({
          message: 'Can not delete league as it is not present',
          status: true,
        });
      } else {
        return res.status(200).send({
          message: 'League deleted successfully',
          status: true,
        });
      }
    });
  });
};

/*
 * ---------------------------------------------------------------------------
 * uploading league image
 * ---------------------------------------------------------------------------
 */

exports.uploadFile = async (req, res, next) => {
  // to declare some path to store your converted image
  var matches = req.body.base64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
    response = {};
  if (matches.length !== 3) {
    return new Error('Invalid input string');
  }

  response.type = matches[1];
  response.data = new Buffer(matches[2], 'base64');
  let decodedImg = response;
  let imageBuffer = decodedImg.data;
  let type = decodedImg.type;
  let extension = mime.getExtension(type);
  let fileName = `${new Date().getTime()}_${req.body.name}`;

  try {
    var imageData = await Image.findOne({ base: imageBuffer });

    if (imageData) {
      return res.json({ success: 'true', url: imageData.url });
    } else {
      var getCount = await Counter.findOne({ name: 'league' });
      var obj = {};
      fileName = `card-${getCount.value}.${extension}`;
      let url = `${config.BASE_URL.replace(
        'api',
        ''
      )}uploads/images/${fileName}`;
      fs.writeFileSync(
        '../server/public/uploads/images/' + fileName,
        imageBuffer,
        'utf8'
      );
      getCount.value = getCount.value + 1;
      getCount.save();

      var imgObj = new Image({
        base: imageBuffer,
        url: url,
        name: fileName,
      });
      imgObj.save();
      return res.json({ success: 'true', url: url });
    }
  } catch (e) {
    next(e);
  }
};

/*
 * ---------------------------------------------------------------------------
 * Process League Winners
 * ---------------------------------------------------------------------------
 */

exports.processLeagueWinners = async (req, res, next) => {
  func.checkUserAuthentication(req, res, async function (payload) {
    const { leagueId } = req.body;

    const leagueData = await League.findById(leagueId);

    if (!leagueData) {
      return res.status(200).json({
        status: false,
        message: 'Invalid League',
      });
    }

    if (leagueData.leagueStatus !== 'closed') {
      return res.status(200).json({
        status: false,
        message: 'Cannot process a league, its not in closed state',
      });
    }

    var result = await LeaderBoard.find({
      leagueId,
    })
      .sort({
        points: -1,
        win: -1,
        avgPointsPerMinute: -1,
        cleanSheet: -1,
        highestWinStreak: -1,
        goalDiff: -1,
        goalFor: -1,
        goalAgainst: 1,
      })
      .limit(leagueData.numberOfPrizes);


      console.log("========")
      console.log(result)
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


    const winnerList = [];
    let index = 0;
    for (const value of result) {
      const player = await Player.findOne({
        userName: value.playerName,
      });

      let conversionData;
      let stakeAmount = leagueData.stakeAmount;
      if (leagueData.gameRegionType === 'local') {
        conversionData = {
          usd_rate: 1
        }
      } else {
        conversionData = await func.getLocalCurrencyCoversionDetailsByCurrency(player.userCurrency);
      }


      const winningAmount = parseFloat(
        leagueData.prize[index] -
        leagueData.currencyConversionRisk * 0.01 * leagueData.prize[index]
      ).toFixed(2);


      let localWinningAmount = parseFloat(winningAmount * conversionData.usd_rate).toFixed(2);
      let localStakeAmount = parseFloat(stakeAmount * conversionData.usd_rate).toFixed(2);
      let bettingTax = leagueData.winningTax / 100

      // 1st method 
      //  let temp = winningAmount * index;
      //  if(temp>leagueData.stakeAmount){
      //   winningTax = bettingTax *  (temp-leagueData.stakeAmount);   
      //  }

      //   for(i=0;i<=n;i++){
      //     let temp = i * prize;
      //    // console.log("temp",temp);
      //     if(temp>data.stakeAmount){
      //       let winTax = (data.winningTax/100) * (temp - data.stakeAmount)
      //         data.prize[i]= temp - winTax;
      //     } 
      //     else{
      //         data.prize[i] = temp;
      //     }      
      // }


      // 2nd method   
      let calculateTax = (localWinningAmount - localStakeAmount) * bettingTax;
      let winningTax = 0;
      if (calculateTax < 0) {
        winningTax = 0
      }
      else {
        winningTax = calculateTax;
      }

      localWinningAmount = localWinningAmount - winningTax;

      console.log('localWinningAmount',localWinningAmount);
      console.log('winningTax',winningTax);

      const id = new ObjectID();

      const walletResponse = await creditToWallet(
        player._id,
        player.bettingCompanyId,
        localWinningAmount,
        localWinningAmount,
        id,
        'Won League: ' + leagueData.leagueName,
        'successful',
        true
      );

      console.log('walletResponse',walletResponse);

      winnerList.push({
        _id: id,
        leaderboard: value._id,
        league: leagueId,
        user: player._id,
        bettingCompanyId: player.bettingCompanyId,
        leagueWinnerPosition: index + 1,
        amount: winningAmount,
        hasClaimed: true,
        state: 'successful',
        paymentResponse: walletResponse.wallet
      });

      ++index;
    }

    const insertedResult = await LeagueWinners.insertMany(winnerList);

    // When the league is proccessed, league should be ENDED.
    leagueData.leagueStatus = 'ended';
    await leagueData.save();

    const populatedResult = await LeagueWinners.find({
      _id: {
        $in: insertedResult.map(({ _id }) => _id),
      },
    })
      .populate({
        path: 'leaderboard',
        model: 'LeaderBoard',
      })
      .populate({
        path: 'user',
        model: 'User',
      })
      .populate({
        path: 'league',
        model: 'League',
      });

    return res.json({
      status: 200,
      message: 'Processed Successfully',
      data: populatedResult,
    });
  });
};

/*
 * ---------------------------------------------------------------------------
 * Get League Winners
 * ---------------------------------------------------------------------------
 */

exports.getLeagueWinners = async (req, res, next) => {
  func.checkUserAuthentication(req, res, async function (payload) {
    const { leagueId } = req.body;

    const leagueData = await League.findById(leagueId);

    if (!leagueData) {
      return res.status(200).json({
        status: false,
        message: 'Invalid League',
      });
    }

    var result = await LeaderBoard.find({
      leagueId,
      // win: {
      //   $gt: 0,
      // },
    })
      .sort({
        points: -1,
        win: -1,
        avgPointsPerMinute: -1,
        cleanSheet: -1,
        highestWinStreak: -1,
        goalDiff: -1,
        goalFor: -1,
        goalAgainst: 1,
      })
      .limit(leagueData.numberOfPrizes);

      console.log("========")
      console.log(result)
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


    const winnerList = await Promise.all(
      result.map(async (value, index) => {
        const player = await Player.findOne({
          userName: value.playerName,
        });

        return {
          leaderboard: value,
          league: leagueData,
          user: player,
          leagueWinnerPosition: index + 1,
          prizeAmount: leagueData.prize[index],
          amount: parseFloat(
            leagueData.prize[index] -
            leagueData.currencyConversionRisk * 0.01 * leagueData.prize[index]
          ).toFixed(2),
        };
      })
    );

    return res.json({
      status: 200,
      message: 'Data found',
      data: winnerList,
    });
  });
};

/*
 * ---------------------------------------------------------------------------
 * Get Player League Winning History
 * ---------------------------------------------------------------------------
 */

exports.getPlayerLeagueWinningHistory = async (req, res, next) => {
  func.checkUserAuthentication(req, res, async function (payload) {
    const { userId } = req.body;

    const player = await Player.findById(userId);

    if (!player) {
      return res.status(200).json({
        status: false,
        message: 'Invalid Player',
      });
    }

    let populatedResult = await LeagueWinners.find({
      user: userId,
    })
      .populate({
        path: 'leaderboard',
        model: 'LeaderBoard',
      })
      // .populate({
      //   path: 'user',
      //   model: 'User',
      // })
      .populate({
        path: 'league',
        model: 'League',
      });

    if (_.isEmpty(populatedResult)) {
      return res.status(200).json({
        status: false,
        message: 'no data found',
      });
    }

    const conversionData = await func.getLocalCurrencyCoversionDetails(payload);


    populatedResult = (await Promise.all(populatedResult.map(async (ob) => {
      console.log('winnerob', ob);
      if (!ob.league) {
        return null
      }
      const leagueConversionData = await func.getLocalCurrencyConversionDetailsAsPerGameRegionType(ob.league, conversionData)

      return {
        ...ob.toJSON(),
        localAmount: parseFloat(ob.amount * leagueConversionData.usd_rate).toFixed(2),
        localCurrency: leagueConversionData.code,
        conversionRate: leagueConversionData.usd_rate,
        amountWithPGCommission: parseFloat(
          ob.amount
        ).toFixed(2),
        localAmountWithPGCommission: parseFloat(
          ob.amount * leagueConversionData.usd_rate
        ).toFixed(2),
      };
    }))).filter((ob) => ob !== null);

    console.log(populatedResult);
    return res.json({
      status: 200,
      message: 'Data found',
      data: populatedResult,
      conversionData,
    });
  });
};

exports.getprizepoolAmount = async (req, res, next) => {
  func.checkUserAuthentication(req, res, async function (payload) {
    try {
      var leagueId = req.query.leagueId;
      console.log(leagueId);
      if (_.isEmpty(leagueId)) {
        return res.status(400).json({
          status: false,
          message: 'league id not found',
        });
      }
      var getLeagueData = await League.findOne({ _id: leagueId }).lean();

      if (_.isEmpty(getLeagueData)) {
        return res.status(400).send({
          message: 'league data not found',
          status: false,
        });
      }

      var beyonicCurrencyData = await func.getLocalCurrencyCoversionDetails(
        payload
      );

      if (beyonicCurrencyData == null) {
        beyonicCurrencyData['usd_rate'] = 1;
      } else {
        beyonicCurrencyData = await func.getLocalCurrencyConversionDetailsAsPerGameRegionType(getLeagueData, beyonicCurrencyData)
      }

      var prizepoolAmount, currency;
      if (getLeagueData.allowedCountries.length == 1) {
        prizepoolAmount =
          getLeagueData.prizepoolAmount *
          parseFloat(beyonicCurrencyData.usd_rate);
        currency = beyonicCurrencyData.code;
      } else {
        prizepoolAmount = getLeagueData.prizepoolAmount;
        currency = 'USD';
      }
      res.json({
        status: 200,
        message: 'Data found',
        prizepoolAmount: prizepoolAmount,
        currency: currency,
      });

      // var getPoolPriceAmount = await func.updateLeaguePrize(getLeagueData);

      //  func.addIsLeagueValidAndLocalCurrency(
      //     [getLeagueData],
      //     payload,
      //     (modifiedLeaguesArray) => {
      //       var prizepoolAmount;
      //       var currency;
      //       console.log(modifiedLeaguesArray);
      //       console.log(getLeagueData.allowedCountries.length);
      //       if (getLeagueData.allowedCountries.length == 1) {
      //         prizepoolAmount = modifiedLeaguesArray[0].localPrizePoolAmount;
      //         currency = modifiedLeaguesArray[0].localCurrency;
      //       } else {
      //         prizepoolAmount = getPoolPriceAmount.prizepoolAmount;
      //         currency = 'USD';
      //       }
      //       console.log(prizepoolAmount);
      //       res.json({
      //         status: 200,
      //         message: 'Data found',
      //         prizepoolAmount: prizepoolAmount,
      //         currency: currency,
      //       });
      //     }
      //   );
    } catch (e) {
      next(e);
    }
  });
};

exports.getWinningTransactionForAdmin = async (req, res, next) => {
  func.checkUserAuthentication(req, res, async function (payload) {
    console.log('in winning transaction..');
    var page = _.isEmpty(req.query.page) ? 1 : parseInt(req.query.page);
    var limit = _.isEmpty(req.query.limit) ? 2 : parseInt(req.query.limit);
    let query = {}
      if (!payload.admin.isSuperAdmin) {
        query.bettingCompanyId = payload.admin.bettingCompanyId
      }
    var options = {
      sort: { date: -1 },
      populate: 'league user',
      lean: true,
      offset: page * limit,
      limit: limit,
    };

    console.log(options);
    LeagueWinners.paginate(query, options).then(async (data) => {
      res.json(data);
    });
  });
};

exports.purchaseLeague = async (req, res, next) => {
  func.checkUserAuthentication(req, res, async function (payload) {
    let userId = payload.sub;
    let entryFeeWithCommission;
    // console.log("1865",payload);
    let leagueId = req.body.leagueId;
    let leagueData = await League.findById(leagueId);

    const conversionData = await func.getLocalCurrencyCoversionDetails(
      payload
    );

    let currencyConversionRisk =
      (leagueData.currencyConversionRisk || 0) * 0.01;

    entryFeeWithCommission = Math.ceil(parseFloat(
      leagueData.entryFee + leagueData.entryFee * currencyConversionRisk // This is for PG Comission
    ));

    let getReward;
    if (_.isEmpty(leagueData)) {
      return res
        .status(400)
        .send({ message: 'League is invalid', status: false });
    }
    else if (leagueData) {

      var getPrevData = await playerLeague
        .find({ userId: userId, leagueId: leagueId })
        .sort({ _id: -1 })
        .limit(1);

      if (getPrevData) {
        if (
          getPrevData[0] &&
          getPrevData[0].remaining == getPrevData[0].totalAllowed
        ) {
          return res.status(400).send({
            message: 'You have already joined this league',
            status: false,
          });
        }
      }

      if (payload.player.referBy) {
        getReward = await func.rewardFriend(payload, 'league')
      }

      if (entryFeeWithCommission == 0) {

        let totalAllowed = leagueData.gameCount;
        let remaining = leagueData.gameCount;

        // const conversionData = await func.getLocalCurrencyCoversionDetails(
        //   payload
        // );

        // console.log("1907",conversionData);

        let ticket = shortId.generate();
        var obj = {
          userId: userId,
          leagueId: leagueId,
          ticket: ticket,
          totalAllowed: totalAllowed,
          remaining: remaining,
        };

        var collObj = {
          userId: userId,
          bettingCompanyId: payload.bettingCompanyId,
          status: 'successful',
          leagueId: leagueId,
          currency: conversionData.code,
          amount: leagueData.entryFee,
          phoneNumber: _.isEmpty(payload.player.mobile) ? '' : payload.player.mobile,
        };
        var collectionObj = new Collections(collObj);
        var playerLeagueObj = new playerLeague(obj);

        await playerLeagueObj.save();
        await collectionObj.save();

        return res.json({
          success: true,
          message: 'League joined successfully',
          reward: getReward
        });

      }
      else if (req.body.mode !== 'wallet' && req.body.mode !== 'walletFromPG') {
        return res
          .status(400)
          .send({ message: 'please pass valid mode to purchase paid leagues', status: false });
      }
      else {
        let walletResponse;
        if (req.body.mode === 'wallet') {
          try {
            walletResponse = await debitFromWallet(
              payload.sub,
              entryFeeWithCommission,
              entryFeeWithCommission,
              '',
              'Purchased League: ' + leagueData.leagueName,
              'successful',
              false
            );
          } catch (error) {
            console.log(error)
            return res.status(400).json({
              status: false,
              message: 'Insufficient Balance'
            })
          }


          //Initiate the Creation of purchase successfull flow...
          const playerLeague = await func.registerLeagueSuccessfulPurchase(
            req.body.leagueId,
            payload.sub,
            walletResponse.wallet.id
          );

          walletResponse.wallet.reference = playerLeague._id;
          walletResponse.wallet.reason += ' (Ticket:' + playerLeague.ticket + ')';
          await walletResponse.wallet.save();

          return res.json({
            mode: req.body.mode,
            success: true,
            message: 'Payment Successful from wallet, Game On...!',
            data: playerLeague,
            reward: getReward
          });
        } else if (req.body.mode === 'walletFromPG') {
          //  * If it is PG, accept more info from the user, initiate collection request, do add to wallet, once successful, do the stuff in condition 1.

          req.body.metadata = {
            type: 'PAY_LEAGUE_VIA_WALLET_ADD',
            leagueId: req.body.leagueId,
            userId: payload.sub,
            originalAmount: req.body.amount,
          };

          addToWallet(req, res, next);
        }
      }
    }
  });

  // Check Request, if it is from wallet or PG(Add to wallet and then minus)

  /**
   * If the request is for Wallet, call the pay from wallet, if success, use the flow which happens on success of PG...
   * If it is PG, accept more info from the user, do add to wallet, once successful, do the stuff in condition 1.
   */

  //  const req = {
  //   phonenumber,
  //   leagueId: paymentDialog.data._id,
  //   amount: paymentDialog.data.localEntryFeeWithCommission,
  //   currency: paymentDialog.data.localCurrency,
  //   mode: 'wallet' // or 'pgtowallet'
  //  }
};
