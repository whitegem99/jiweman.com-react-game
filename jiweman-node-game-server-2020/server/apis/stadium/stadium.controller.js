/*
* --------------------------------------------------------------------------
* Created by Barquecon Technologies on 26/04/2019 by Dipak Adsul
* ---------------------------------------------------------------------------
*/

let func = require('../common/commonfunction');
let sendResponse = require('../common/sendresponse');
let logger = require('../../logger/log');
var mongoose = require('mongoose');
var ObjectID = require('mongodb').ObjectID;
let Stadiums = require('./stadium.model').Gamestadium;
let PlayerStadiums = require('./stadium.model').PlayerStadiums;

 /*
* --------------------------------------------------------------------------
* Select player stadium by playerId and stadiumId
* ---------------------------------------------------------------------------
*/

exports.selectStadiums = function (req, res) {
    let requestBody = req.body;
    let loggedInplayerId;
    if ( !requestBody ) {
      let msg = '';
      sendResponse.sendErrorMessage( msg , res);
    }
    else {
        func.checkUserAuthentication(req, res, function (payload) {
           playerId = requestBody.playerId;
           let stadiumsId = requestBody.stadiumsId; 
           loggedInplayerId = payload.sub.toObjectId();
           Stadiums.findOne({ _id: stadiumsId }, function(err, singleStadiums) {
            if ( err ){
              sendResponse.sendDataNotFound('No such formation exist', res);
            }
            if (singleStadiums) {
              PlayerStadiums.findOneAndUpdate(
                { 
                  playerId: loggedInplayerId
                },
                {
                  playerId: loggedInplayerId,
                  stadiumsId: stadiumsId
                },
                {
                  upsert: true,
                  new: true,
                  useFindAndModify: false
                },function(err, result) {
                if(!err) {
                  sendResponse.sendSuccessData(result, res);
                }
                else {
                  let msg = '';
                  sendResponse.sendDataNotFound(msg, res);
                }
            });
            }
          });
        });
    }
    }

    /*
* --------------------------------------------------------------------------
* 1. Get All Stadiums if playerId is not passed in query param
* 2. Get single Stadium by playerId if passed in query param
* ---------------------------------------------------------------------------
*/

exports.stadiums = function (req, res) {
    let playerId;
      func.checkUserAuthentication(req, res, function (payload) {
        if(req.query.playerId){
           pid = req.query.playerId;
           console.log()
           PlayerStadiums.find({ playerId: pid }, function(err, result) {
            if (err){
              let msg = '';
              sendResponse.sendErrorMessage(msg, res);
            }
            else if(result.length > 0){
              sendResponse.sendSuccessData(result, res);
            }else if (result.length === 0){
              let msg = '';
              sendResponse.sendDataNotFound(msg, res);
            }
          });
        } else {
          var loggedInplayerId = payload.sub.toObjectId();
          Stadiums.find( function (err, data) {
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
  
  