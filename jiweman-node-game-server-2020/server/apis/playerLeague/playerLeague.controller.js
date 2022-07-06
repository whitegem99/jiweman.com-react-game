let func = require("../common/commonfunction");
let sendResponse = require("../common/sendresponse");
let logger = require("../../logger/log");
var mongoose = require("mongoose");
var config = require('../../config');
var ObjectID = require("mongodb").ObjectID;
var playerLeague = require('./playerLeague.model').playerLeague;
const { LeaderBoard } = require('../leaderboard/leaderboard.model');
let Player = require('../playerAuth/player.model').Player;
let _ = require('lodash');
let moment = require('moment');

/*
 * --------------------------------------------------------------------------
 * get playerleagues API start
 * ---------------------------------------------------------------------------
 */

exports.playerLeagues = (req, res) => {
    console.log('inside playerLeagues');

    func.checkUserAuthentication(req, res, async function (payload) {

        try {

            playerLeague
                .find({})
                .populate({ path: "userId", select: "userName" })
                .populate({ path: "leagueId", select: "leagueName" })
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


exports.updateplayerLeagues = (req, res) => {
    console.log('inside updateplayerLeagues');

    func.checkUserAuthentication(req, res, async function (payload) {

        try {

            var userId = payload.sub;
            var query = {}
            if (req.body.ticket) {
                query = {
                    leagueId: req.body.leagueId,
                    userId: userId,
                    ticket: req.body.ticket
                }
            }
            else {
                query = {
                    leagueId: req.body.leagueId,
                    userId: userId,
                }
            }


            let getPlayerLeagueInfo = await playerLeague.find(query).sort({ _id: -1 })

            if (getPlayerLeagueInfo[0].ticketFlag == false) {
                playerLeague
                    .update({ _id: getPlayerLeagueInfo[0]._id }, { "$set": { ticketFlag: true } }, { new: true })
                    .exec((err, data) => {
                        if (err) {
                            res.status(400).send({ status: false, message: err })
                        } else {
                            res.send({
                                status: true,
                                message: "League purchase verified",
                                data: data,
                            });
                        }
                    });
            }
            else {
                if (parseInt(getPlayerLeagueInfo[0].remaining) == parseInt(getPlayerLeagueInfo[0].totalAllowed)) {
                    return res.status(400).send({ status: false, message: "you are done with all your game play chances please purchase the league again to play more games" })
                }
                else {
                    let remaining;
                    if (parseInt(getPlayerLeagueInfo[0].remaining) == 0) {
                        remaining = getPlayerLeagueInfo[0].totalAllowed;
                    }
                    else {
                        remaining = getPlayerLeagueInfo[0].remaining;
                    }

                    return res.send({
                        status: true,
                        message: `you have ${remaining} number of game play chances`,
                        data: {
                            "totalAllowed": getPlayerLeagueInfo[0].totalAllowed,
                            "remaining": getPlayerLeagueInfo[0].remaining
                        }
                    });
                }

            }


        } catch (e) {
            next(e);
        }
    });
}


exports.getLeagueAvaliablity = (req, res, next) => {

    console.log('inside getLeaguAvaliablity');

    func.checkUserAuthentication(req, res, async function (payload) {

        try {
            let userId = payload.sub;
            let userRank = 0;
            let totalRankCount = 0
            let leagueId = req.query.leagueId;
            let query = {}
            let roundCount;
            let data;
            query = {
                leagueId: ObjectID(leagueId),
                userId: ObjectID(userId),
            }

            // console.log('<><><><><><><>'+query.leagueId);
            getPlayerLeagueInfo = await playerLeague.find(query).sort({ _id: 1 }).populate('leagueId', 'numberOfGoalsToWin').lean();

            if(_.isEmpty(getPlayerLeagueInfo)){
                return res.status(400).send({
                    message: 'league data not found',
                    status: false,
                  });          
                 }

                // console.log(getPlayerLeagueInfo.length);
                const player = await Player.findOne({
                    _id: userId
                });

                roundCount = getPlayerLeagueInfo.length;    
           
            if (getPlayerLeagueInfo.length >= 1) {
                data = getPlayerLeagueInfo[getPlayerLeagueInfo.length - 1];
                if(data.totalAllowed == data.remaining){
                    roundCount =getPlayerLeagueInfo.length-1;
                }
            }
            else {
                data = getPlayerLeagueInfo[0];
                if(data.totalAllowed == data.remaining){
                    roundCount =getPlayerLeagueInfo.length;
                }
                
            }

            var numberOfGoalsToWin = data.leagueId.numberOfGoalsToWin
            var result = await LeaderBoard.find({
                leagueId: leagueId,
                gameType: "leagueGamePlay"
            })
                .sort({
                    points: -1,
                    win: -1,
                    avgPointsPerMinute: -1,
                    cleanSheet: -1,
                    highestWinStreak: -1,
                    goalDiff: -1,
                    goalFor: -1,
                    goalAgainst: 1
                }).lean();

         
            // console.log("rankCount",leagueLeaders.length);

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

            
            totalRankCount = result.length;
            // console.log(player.userName);
            var getUser = _.findIndex(result,(e)=>{  return e.playerName ==player.userName && e.leagueRound == roundCount })
                // console.log(typeof getUser);
                // console.log(getUser)
                // console.log("getUser");
            if (getUser>-1) {
                       userRank = getUser+ 1;
            }
            else{
                userRank=0;
            }
        
                return res.send({
                    status: true,
                    message: `you have ${data.remaining} number of game play chances`,
                    data: {
                        "totalAllowed": data.totalAllowed,
                        "remaining": data.remaining,
                        "round":getPlayerLeagueInfo.length,
                        "userRank": userRank,
                        "totalRankCount": totalRankCount,
                        "numberOfGoalsToWin": numberOfGoalsToWin
                    }
                });
           // }

        } catch (e) {
            console.log("error");
            console.log(e)
            next(e);
        }
    });
}