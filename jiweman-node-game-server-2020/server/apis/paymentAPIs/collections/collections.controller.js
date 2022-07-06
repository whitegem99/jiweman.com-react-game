let func = require('../../common/commonfunction');
let sendResponse = require('../../common/sendresponse');
let logger = require('../../../logger/log');
var mongoose = require('mongoose');
let config = require('../../../config');
let request = require('request');
var Collections = require('../collections/collections.model').Collection;
let Player = require('../../playerAuth/player.model').Player;
var _ = require('lodash');
const { v4: uuidv4 } = require('uuid');
var League = require('../../league/league.model').League;
var shortId = require('shortid');
const {
  updateWalletStatus,
  debitFromWallet,
} = require('../wallet/wallet.service');
var playerLeague = require('../../playerLeague/playerLeague.model')
  .playerLeague;
/*
 * --------------------------------------------------------------------------
 * Start of check Collection API
 * ---------------------------------------------------------------------------
 */

exports.collections = async (req, res) => {
  console.log('inside collections');
  func.checkUserAuthentication(req, res, async function (payload) {
    var requestData = req.body;
    let currency;
    var leagueId = requestData.leagueId;

    console.log('----------------');
    delete requestData.leagueId;
    let leagueData = await League.findById(leagueId);
    const conversionData = await func.getLocalCurrencyCoversionDetails(payload);
    console.log(leagueData);
    if (_.isEmpty(leagueData)) {
      return res
        .status(400)
        .send({ message: 'League is invalid', status: false });
    } else if (leagueData.entryFee <= 0) {
      return res
        .status(400)
        .send({ message: 'Amount must be greter than 0', status: false });
    } else {
      if (requestData.currency == 'BXC') {
        currency = 'BXC';
      } else {
        currency = conversionData.code;
      }

      //_.extend(requestData,{currency:currency});
      const apiToken = await func.getBeyonicAPIToken(payload.bettingCompanyId)
      request(
        {
          headers: {
            //'secret-key': config.PAYMENT_SECRET_KEY
            Authorization: `Token ${apiToken}`,
            'Postman-Token': 'c2248877-6307-d12e-f412-5413db619062',
          },
          method: 'POST',
          uri: `https://app.beyonic.com/api/collectionrequests`,
          json: requestData,
          gzip: true,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
        async function (error, response, body) {
          if (error) {
            console.error(error);
            return res.status(400).send({ error: error, status: false });
          } else {
            let collectionObj = new Collections({
              apiResponse: body,
              status: body.status,
              collectionId: body.id,
              userId: payload.sub,
              bettingCompanyId: payload.bettingCompanyId,
              leagueId: leagueId,
              phoneNumber: req.body.phonenumber,
              collectionType: 'league',
            });

            collectionObj.save((error, result) => {
              if (error) {
                return res.status(400).send({ error: error, status: false });
              }
              res.send(body);
            });
          }
        }
      );
    }
  });
};

/*
 * --------------------------------------------------------------------------
 * Start of check Collection API
 * ---------------------------------------------------------------------------
 */

exports.collectionUpdate = async (req, res, next) => {
  console.log(req.body);
  try {
    Collections.findOneAndUpdate(
      {
        collectionId: req.body.data.id,
      },
      {
        $set: {
          status: req.body.data.status,
          amount: req.body.data.amount,
          currency: req.body.data.currency,
        },
      },
      { new: true }
    ).exec(async function (err, data) {
      if (err) {
        return res.status(400).send({ error: err, status: false });
      } else {
        if (req.body.data.status == 'successful') {
          if (data.collectionType === 'league') {
            // let totalAllowed = 0;
            // let remaining = 0;
            // var getLeagueData = await League.findOne({
            //   _id: data.leagueId,
            // }).lean();
            // if (getLeagueData) {
            //   totalAllowed = getLeagueData.gameCount;
            //   remaining = getLeagueData.gameCount;
            // }
            // let ticket = shortId.generate();
            // var getPrevData = await playerLeague
            //   .find({ userId: data.userId, leagueId: data.leagueId })
            //   .sort({ _id: -1 })
            //   .limit(1);
            // console.log('join free league');
            // if (getPrevData.length > 1) {
            //   if (getPrevData[0].remaining == getPrevData[0].totalAllowed) {
            //     return res.status(400).send({
            //       message: 'You have already joined this league',
            //       status: false,
            //     });
            //   }
            // }
            // var obj = {
            //   userId: data.userId,
            //   leagueId: data.leagueId,
            //   ticket: ticket,
            //   collectionId: req.body.data.id,
            //   totalAllowed: totalAllowed,
            //   remaining: remaining,
            // };
            // var playerLeagueObj = new playerLeague(obj);
            // console.log('playerLeagueObj');
            // console.log(playerLeagueObj);
            // await playerLeagueObj.save();
            // var playerData = await Player.findOne({
            //   _id: playerLeagueObj.userId,
            // });
            // var leagueData = await League.findOne({
            //   _id: playerLeagueObj.leagueId,
            // });
            // console.log(playerData);
            // console.log(leagueData);
            // if (leagueData.leagueStatus == 'active') {
            //   let subject = `Joga-Bonito – ${leagueData.leagueName} Ticket Purchase Receipt`;
            //   let body = `<div style="width: 680px; margin: 0 auto;">
            //         <div style="background: #504482; height: 80px;">
            //         <h3 style="color: #fff; font-size: 36px; font-weight: normal; padding: 18px 0 0 70px; margin: 0;">Welcome to Joga Bonito</h3>
            //         </div>
            //         <div style="background: #fff; padding: 23px 70px 20px 70px;">
            //         <h4 style="font-size: 24px; color: #504482; margin: 20px 0 30px;">Hi ${playerData.userName},</h4>
            //         <div style="color: #8b8382; font-size: 15px;">
            //         <p>Congratulations, You have successfully purchased the ticket for <strong>${leagueData.leagueName}</strong>!</p>
            //         <p>Please, find below the ticket to get entry in the <strong>${leagueData.leagueName}</strong></p>
            //         <p><strong>${playerLeagueObj.ticket}</strong></p>
            //         <p>Please, find below the transaction ID for your reference. Please save this at your side.</p>
            //         <p><strong>${playerLeagueObj.collectionId}</strong></p>
            //         <p>Let's play FANTASTIC Games together!!!</p>
            //         <p>Cheers!!!</p>
            //         <div style="display: block; margin: 90px 0;">&nbsp;</div>
            //         </div>
            //         </div>
            //         <div style="height: 52px; background: #dfdfdf;">&nbsp;</div>
            //         </div>`;
            //   //send ticket to player who purchased the league via Email
            //   func.sendEmail(playerData.email, body, subject);
            //   console.log('ticket email Sent');
            // } else {
            //   console.log('league status' + leagueData.leagueStatus);
            // }
            // func.updateLeaguePrize(getLeagueData);
          }

          if (data.collectionType === 'ADD_TO_WALLET') {
            try {
              const creditResponse = await updateWalletStatus(
                data.walletId,
                'successful',
                true
              );
            } catch (error) {
              console.log(error);
            }
          } else if (data.collectionType === 'PAY_LEAGUE_VIA_WALLET_ADD') {
            const creditResponse = await updateWalletStatus(
              data.walletId,
              'successful',
              true
            );

            var getLeagueData = await League.findOne({
              _id: req.body.data.metadata.leagueId,
            }).lean();

            const walletResponse = await debitFromWallet(
              data.userId,
              req.body.data.metadata.originalAmount,
              req.body.data.metadata.originalAmount,
              '',
              'Purchased League: ' + getLeagueData.leagueName,
              'successful',
              false
            );

            const playerLeague = await func.registerLeagueSuccessfulPurchase(
              req.body.data.metadata.leagueId,
              data.userId,
              walletResponse.wallet.id
            );

            walletResponse.wallet.reference = playerLeague._id;
            walletResponse.wallet.reason +=
              ' (Ticket:' + playerLeague.ticket + ')';
            await walletResponse.wallet.save();
          }
        }
        return res.json({ message: 'payment status updated' });
      }
    });
  } catch (e) {
    next(e);
  }
};

exports.collectionStatus = async (req, res) => {
  func.checkUserAuthentication(req, res, async function (payload) {
    console.log(req.params.id);
    console.log(payload.sub);

    Collections.findOne({ collectionId: req.params.id }).exec(function (
      err,
      data
    ) {
      if (err) {
        return res.status(400).send({ error: err, status: false });
      } else {
        playerLeague
          .findOne({ collectionId: data.wallet_id })
          .exec(function (playerErr, playerData) {
            let obj = {
              userId: data.userId,
              status: data.status,
              leagueId: data.leagueId,
              ticket: playerData && playerData.ticket ? playerData.ticket : '',
            };
            return res.json(obj);
          });
      }
    });
  });
};

exports.getPaymentOptions = function (req, res) {
  console.log('inside /getPaymentOptions');
  func.checkUserAuthentication(req, res, async function (payload) {
    var country = config.COUNTRY_SUPPORT;
    var userData = await Player.findOne({ _id: payload.sub });
    console.log(userData);

    var getCountry = _.find(country, { name: userData.countryOfRecidence });
    if (getCountry) {
      res.json({
        status: true,
        message: 'Country Found',
        paymentMethod: getCountry.method,
      });
    } else {
      return res
        .status(400)
        .send({ status: false, message: 'Country not found' });
    }
  });
};

exports.joinFreeLeague = (req, res, next) => {
  func.checkUserAuthentication(req, res, async function (payload) {
    try {
      let leagueId = req.body.leagueId;
      let userId = payload.sub;

      const getLeagueData = await League.findOne({ _id: leagueId });
      const conversionData = await func.getLocalCurrencyCoversionDetails(
        payload
      );
      const playerData = await Player.findOne({ _id: userId });

      if (getLeagueData) {
        totalAllowed = getLeagueData.gameCount;
        remaining = getLeagueData.gameCount;
      }

      if (getLeagueData && getLeagueData.entryFee == 0) {
        let ticket = shortId.generate();
        var obj = {
          userId: userId,
          leagueId: leagueId,
          ticket: ticket,
          totalAllowed: totalAllowed,
          remaining: remaining,
        };

        var getPrevData = await playerLeague
          .find({ userId: userId, leagueId: leagueId })
          .sort({ _id: -1 })
          .limit(1);

        console.log('join free league');

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

        var collObj = {
          userId: userId,
          bettingCompanyId: playerData.bettingCompanyId,
          status: 'successful',
          leagueId: leagueId,
          currency: conversionData.code,
          amount: getLeagueData.entryFee,
          phoneNumber: _.isEmpty(playerData.mobile) ? '' : playerData.mobile,
        };
        var collectionObj = new Collections(collObj);
        var playerLeagueObj = new playerLeague(obj);

        await playerLeagueObj.save();
        await collectionObj.save();
        return res.json({ message: 'League joined successfully' });
      } else {
        return res.status(400).send({
          message: "Something went wrong! You can't join this league",
          status: false,
        });
      }
    } catch (e) {
      next(e);
    }
  });
};
