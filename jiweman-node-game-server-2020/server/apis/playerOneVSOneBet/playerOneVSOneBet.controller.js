let func = require("../common/commonfunction");
let sendResponse = require("../common/sendresponse");
let logger = require("../../logger/log");
var mongoose = require("mongoose");
var config = require('../../config');
var ObjectID = require("mongodb").ObjectID;
const { playerBet } = require('./playerOneVSOneBet.model');
const { LeaderBoard } = require('../leaderboard/leaderboard.model');
let Player = require('../playerAuth/player.model').Player;
let _ = require('lodash');
const OneonOne = require('../oneonone/oneonone.model').OneOnOne;

/*
 * --------------------------------------------------------------------------
 * get playerBets API start
 * ---------------------------------------------------------------------------
 */

exports.playerBets = (req, res) => {
    console.log('inside playerBets');

    func.checkUserAuthentication(req, res, async function (payload) {

        try {

            playerBet
                .find({})
                .populate({ path: "userId", select: "userName" })
                .populate({ path: "gameId", select: "gameName" })
                .exec((err, data) => {
                    console.log("inside exec");

                    if (err) {
                        console.log(err);
                        res.send("fail");
                    } else {
                        console.log("data", data);
                        res.send({
                            status: true,
                            message: "success",
                            data: data,
                        });
                    }
                });

        } catch (e) {
            next(e);
        }
    });
}

exports.updateplayerBets = (req, res) => {
    console.log('inside updateplayerBets');

    func.checkUserAuthentication(req, res, async function (payload) {

        try {

            var userId = payload.sub;
            var query = {}
            if (req.body.ticket) {
                query = {
                    gameId: req.body.gameId,
                    userId: userId,
                    ticket: req.body.ticket
                }
            }
            else {
                query = {
                    gameId: req.body.gameId,
                    userId: userId,
                }
            }


            let getPlayerBetInfo = await playerBet.find(query).sort({ _id: -1 })

            if (getPlayerBetInfo[0].ticketFlag == false) {
                playerBet
                    .update({ _id: getPlayerBetInfo[0]._id }, { "$set": { ticketFlag: true } }, { new: true })
                    .exec((err, data) => {
                        if (err) {
                            res.status(400).send({ status: false, message: err })
                        } else {
                            res.send({
                                status: true,
                                message: "Bet purchase verified",
                                data: data,
                            });
                        }
                    });
            }
            else {
                if (parseInt(getPlayerBetInfo[0].remaining) == parseInt(getPlayerBetInfo[0].totalAllowed)) {
                    return res.status(400).send({ status: false, message: "you are done with all your game play chances please purchase the league again to play more games" })
                }
                else {
                    let remaining;
                    if (parseInt(getPlayerBetInfo[0].remaining) == 0) {
                        remaining = getPlayerBetInfo[0].totalAllowed;
                    }
                    else {
                        remaining = getPlayerBetInfo[0].remaining;
                    }

                    return res.send({
                        status: true,
                        message: `you have ${remaining} number of game play chances`,
                        data: {
                            "totalAllowed": getPlayerBetInfo[0].totalAllowed,
                            "remaining": getPlayerBetInfo[0].remaining
                        }
                    });
                }

            }


        } catch (e) {
            next(e);
        }
    });
}

exports.getBetAvailability = (req, res, next) => {

    console.log('inside getBetAvaliablity');

    func.checkUserAuthentication(req, res, async function (payload) {

        try {
            let userId = payload.sub;
            let gameId = req.query.gameId;
            let userName = req.query.userName;
            let query = {}

            if (_.isEmpty(gameId)) {
                let response = {
                    message: "please specify gameId",
                    status: false
                  }
                  let statusCode = 400
                  func.log("getBetAvailability",req.body,statusCode,response)
                  return res
                    .status(statusCode)
                    .send(response)
            }

            let data;
            query = {
                gameId: ObjectID(gameId),
                userId: ObjectID(userId),
            }

            if (userName) {
                let opponentData = await Player.findOne({ userName: userName }).lean();
                opponentId = opponentData._id;

                console.log('opponentData', opponentData);

                query = {
                    gameId: ObjectID(gameId),
                    userId: ObjectID(opponentId)
                }
            }

            getPlayerBetInfo = await playerBet.find(query).sort({ _id: -1 }).populate('gameId').lean();
            betInfo = await OneonOne.find({"_id":ObjectID(gameId)}).lean();

            console.log("###145####",betInfo);
         
            if(_.isEmpty(getPlayerBetInfo)){
                return res.status(200).send({
                    message: 'game data not found',
                    status: false,
                  });          
                 }
        
                // return res.send({
                //     status: true,
                //     message: `you have ${getPlayerBetInfo[0].remaining} number of game play chances`,
                //     data: {
                //         "totalAllowed": getPlayerBetInfo[0].totalAllowed,
                //         "remaining": getPlayerBetInfo[0].remaining,
                //         "numberOfGoalsToWin": betInfo[0].numberOfGoalsToWin,
            betInfo = await OneonOne.find({ "_id": ObjectID(gameId) }).lean();

            console.log("###145####", betInfo);

            if (_.isEmpty(getPlayerBetInfo)) {
                let response = {
                    message: "game data not found",
                    status: false
                  }
                  let statusCode = 200
                  func.log("getBetAvailability",req.body,statusCode,response)
                  return res
                    .status(statusCode)
                    .send(response)
            }

            let response = {
                status: true,
                message: `you have ${getPlayerBetInfo[0].remaining} number of game play chances`,
                data: {
                    "totalAllowed": getPlayerBetInfo[0].totalAllowed,
                    "remaining": getPlayerBetInfo[0].remaining,
                    "numberOfGoalsToWin": betInfo[0].numberOfGoalsToWin,
                    "freeBets": getPlayerBetInfo[0].freeBets

                }
            }
            statusCode = 200

            func.log("getBetAvailability", req.body, statusCode, response)
            return res
                .status(statusCode)
                .send(response)

        } catch (e) {
            let response = {
                message: e.message,
                status: false
            }
            let statusCode = 400
            func.log("getBetAvailability", req.body, statusCode, response)
            return res
                .status(statusCode)
                .send(response)
        }
    });
}