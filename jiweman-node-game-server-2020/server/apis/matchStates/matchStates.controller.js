let sendResponse = require('../common/sendresponse');
let logger = require('../../logger/log');
let Match = require('../matchPlay/matchplay.model').Match;
let MatchState = require('./matchStates.model').MatchState;
let func = require('../common/commonfunction');
const async_lib = require('async');
const _ = require('lodash')

/*
 * --------------------------------------------------------------------------
 * Update Match States API start
 * ---------------------------------------------------------------------------
 */

exports.updateMatchState = async (req, res) => {

    console.log('inside updateMatchState');

    func.checkUserAuthentication(req, res, async function (payload) {
        let matchStateData = req.body;

        if (_.isEmpty(matchStateData)) {

            let response = {
                message: "Bad Request",
                status: false
            }
            let statusCode = 400
            func.log("UpdateMatchState", req.body, statusCode, response)
            return res
                .status(statusCode)
                .send(response)

        } else {
            try {
                // let query = {
                //     matchId: matchStateData.matchId,
                //     senderId: matchStateData.senderId
                // }

                let getMatchStateData = await MatchState.find({
                    matchId: matchStateData.matchId,
                    senderId: matchStateData.senderId
                }).lean();

                if (_.isEmpty(getMatchStateData)) {

                    let newMatchState = new MatchState(matchStateData);

                    newMatchState.save(async (err, result) => {

                        if (err) {
                            console.log('err', err);
                            let response = {
                                message: "something went wrong",
                                status: false
                            }
                            let statusCode = 400
                            func.log("UpdateMatchState", req.body, statusCode, response)
                            return res
                                .status(statusCode)
                                .send(response)
                        } else {
                            response = {
                                status: true,
                                message: "Match state data saved",
                                data: result
                            }
                            statusCode = 200

                            func.log("UpdateMatchState", req.body, statusCode, response)
                            return res
                                .status(statusCode)
                                .send(response)

                        }
                    })

                } else if (getMatchStateData) {

                    MatchState.findOneAndUpdate({
                        matchId: matchStateData.matchId,
                        senderId: matchStateData.senderId
                    }, {
                        p1Goal: matchStateData.p1Goal,
                        p2Goal: matchStateData.p2Goal,
                        p1Duration: matchStateData.p1Duration,
                        p2Duration: matchStateData.p2Duration,
                        turn: matchStateData.turn,
                        matchDuration: matchStateData.matchDuration,
                        state: matchStateData.state
                    }, {
                        upsert: false,
                        new: true,
                        useFindAndModify: false
                    }, (err, updated) => {
                        if (updated == null) {
                            let response = {
                                message: "Enter valid matchId and senderId",
                                status: false
                            }
                            let statusCode = 400
                            func.log("UpdateMatchState", req.body, statusCode, response)
                            return res
                                .status(statusCode)
                                .send(response)
                        } else if (err) {
                            let response = {
                                message: err,
                                status: false
                            }
                            let statusCode = 400
                            func.log("UpdateMatchState", req.body, statusCode, response)
                            return res
                                .status(statusCode)
                                .send(response)
                        } else {

                            console.log('updated Match state Result', updated);

                            response = {
                                status: true,
                                message: "Match state data updated",
                                data: updated
                            }
                            statusCode = 200

                            func.log("UpdateMatchState", req.body, statusCode, response)
                            return res
                                .status(statusCode)
                                .send(response)

                        }
                    });
                }
            } catch (error) {
                let response = {
                    message: error.message,
                    status: false
                }
                let statusCode = 400
                func.log("UpdateMatchState", req.body, statusCode, response)
                return res
                    .status(statusCode)
                    .send(response)
            }
        }
    })
}