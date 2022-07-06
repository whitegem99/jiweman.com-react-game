/*
 * --------------------------------------------------------------------------
 * Created by Barquecon Technologies on 12/03/2019 by Dipak Adsul
 * ---------------------------------------------------------------------------
 */

let func = require('../common/commonfunction');
let sendResponse = require('../common/sendresponse');
let logger = require('../../logger/log');
let Formation = require('./formations.model').Formation;
let PlayerGameData = require('../playerAuth/player.model').PlayerGameData;
var mongoose = require('mongoose');
var ObjectID = require('mongodb').ObjectID;
/*
 * --------------------------------------------------------------------------
 * 1. Get All Formation if playerId is not passed in query param
 * 2. Get single formation by playerId if passed in query param
 * ---------------------------------------------------------------------------
 */

exports.formations = function(req, res) {
    let playerId;
    func.checkUserAuthentication(req, res, function(payload) {
    if (req.query.playerId) {
        pid = req.query.playerId;

        PlayerFormation.find({ playerId: pid }, function(err, result) {
            if (err) {
                let msg = '';
                sendResponse.sendErrorMessage(msg, res);
            } else if (result.length > 0) {
                sendResponse.sendSuccessData(result, res);
            } else if (result.length === 0) {
                let msg = '';
                sendResponse.sendDataNotFound(msg, res);
            }
        });
    } else {
        // var loggedInplayerId = payload.sub.toObjectId();
        Formation.find(function(err, data) {
            if (err) {
                logger.error(err);
                let msg = '';
                sendResponse.sendErrorMessage(msg, res)
            } else {
                if (data.length == 0) {
                    let msg = '';
                    sendResponse.sendDataNotFound(msg, res);
                } else {
                    sendResponse.sendSuccessData(data, res);
                }
            }
        });
    }
    });
}


/*
 * --------------------------------------------------------------------------
 * Select player formation by playerId and formationId
 * ---------------------------------------------------------------------------
 */

exports.selectFormations = function(req, res) {
    let requestBody = req.body;
    let loggedInplayerId;
    if (!requestBody) {
        let msg = '';
        sendResponse.sendErrorMessage(msg, res);
    } else {
        func.checkUserAuthentication(req, res, async function(payload) {
            userName = requestBody.userName;
            let indexNumber = parseInt(requestBody.indexNumber);
            loggedInplayerId = payload.sub.toObjectId();
            Formation.findOne({ indexNumber: indexNumber }, '-_id', {lean: true}, function(err, singleFormation) {
                if (err) {
                    sendResponse.sendDataNotFound('No such formation exist', res);
                }
                if (singleFormation) {

                    var playerForm = {};
                    playerForm = Object.assign(singleFormation, singleFormation._doc);
                    delete playerForm._id;
                    playerForm.playerId = loggedInplayerId;
                    playerForm.userName = userName;
                    // playerForm = singleFormation;
                    // console.log(playerForm)
                    PlayerGameData.findOneAndUpdate(
                        {
                            playerId: loggedInplayerId
                        },
                        playerForm ,
                        {
                            upsert: true ,
                            new: true,
                            useFindAndModify: false
                        },function(err, data) {
                        if (err) {
                            let msg = "some error occurred"
                            sendResponse.sendErrorMessage(msg, res);
                        } else {
                            sendResponse.sendSuccessData(data, res);
                        }
                    });

                }
            });
        });
    }
}
