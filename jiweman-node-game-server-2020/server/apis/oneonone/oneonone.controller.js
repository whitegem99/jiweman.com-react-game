const func = require('../common/commonfunction');
const config = require('../../config');
const OneonOne = require('./oneonone.model').OneOnOne;
const OneOnOneData = require('./oneonone.model').OneOnOneData;
const { League, LeagueWinners } = require('../league/league.model');
const { creditToWallet,debitFromWallet,getBalance } = require('../paymentAPIs/wallet/wallet.service');
let Player = require('../playerAuth/player.model').Player;
let LeaderBoard = require("../leaderboard/leaderboard.model").LeaderBoard;
let Match = require("../matchPlay/matchplay.model").Match;
const { playerBet } = require('../playerOneVSOneBet/playerOneVSOneBet.model');
const async_lib = require('async');
const _ = require('lodash')
var ObjectID = require("mongodb").ObjectID;
let moment = require('moment');

exports.create = async (req, res, next) => {
    func.checkUserAuthentication(req, res, async (payload)=> {
        try{
            var data = req.body;
            let date = new Date();
            let ISOdate = date.getTime();

            if (!data.startDate) {
              throw new Error('startDate not defined.');
            }
            if (data.startDate != '' && data.startDate != undefined) {
              // var startDate = func.stringToDate(data.startDate);
              var startDate = new Date(data.startDate).getTime();
            }
    
            if (!data.endDate) {
              throw new Error('endDate not defined.');
            }
            if (data.endDate != '' && data.endDate != undefined) {
              // var endDate = func.stringToDate(data.endDate);
              var endDate = new Date(data.endDate).getTime();
            }

            data.startDate = startDate;
            data.endDate = endDate;

            if (startDate <= ISOdate && endDate >= ISOdate) {
              data.status = 'active';
            } else if (startDate < ISOdate && endDate < ISOdate) {
              data.status = 'ended';
            }

            data.gameInfo = [`${data.numberOfGoalsToWin} goals to win`, 'Top players will get exciting prizes and please see leaderboard for more information.'];   
            data.bettingCompanyId = payload.bettingCompanyId;

           if(data.entryFee){
             data.origianlEntryFee = data.entryFee;
           }
            if (!data.cardImage) {
              return res.status(400).send({
                message: 'please upload image card',
                status: false,
              });
            }

            if(data.type_of_business=='business_first'){
              data = await func.calculatePrize_1(data,'oneonone'); 
            }
            else if(data.type_of_business=='customer_first'){
              data = await func.calculatePrize_2(data,'oneonone'); 
            }
            // data = await func.calculatePrize_2(data,'oneonone');
            console.log('31',data); 
            var oneononeData = await OneonOne.find({"gameName":data.gameName}).lean();
            
            if (oneononeData.length) {
              return res.status(400).send({
                message: 'please select unique game name',
                status: false,
              });
            }

        if (startDate < endDate) {
            var obj = new OneonOne(data);
            obj.save(function(err,result){
              if(err){
                throw err;
              }
                res.json({
                    status: 200,
                    message: 'Data saved',
                    data: result,
                  });
            })
          } else {
            res.status(200).send({
              message: 'endDate must be greater than startDate',
              status: false,
            });
          }
        }
        catch(e){
            return res.status(400).send({
                message: e.message,
                status: false,
              });
        }
    })
}

exports.show = async (req,res,next)=> {
  func.checkUserAuthentication(req, res, async (payload) =>{
    try{
      var userData = await Player.findOne({_id:payload.sub}).lean();
        let playerCountry = userData.countryOfRecidence;
        var getData = await OneonOne.find({
            allowedCountries: {
              $in: playerCountry,
            }, status:'active'
          }).lean();
    
         if(_.isEmpty(getData)){
            return res.status(200).send({
                message: 'one on one data not found',
                status: false,
              });
        }
          res.json({
            status: 200,
            message: 'Data found',
            data: getData,
          });
    }
    catch(e){
        return res.status(200).send({
            message: e.message,
            status: false,
          });
    }
})

}

exports.showCards = async (req, res, next) => {
    func.checkUserAuthentication(req, res, async (payload) =>{
        try{
            var getPlayerCountry = await Player.findOne(
                { _id: payload.sub },
                { countryOfRecidence: 1,
                  bettingCompanyId:1 }
              );
              let playerCountry = getPlayerCountry.countryOfRecidence;

              
            var getData = await OneonOne.find({
              allowedCountries: {
                  $in: playerCountry
                },status:'active',
                bettingCompanyId:getPlayerCountry.bettingCompanyId
              }).lean();

             if(_.isEmpty(getData)){
              let response = {
                message: "one on one data not found",
                status: false
              }
              let statusCode = 200
              func.log("getOneonOneCards",req.body,statusCode,response)
              return res
                .status(statusCode)
                .send(response)
            }
          var beyonicCurrencyData = await func.getLocalCurrencyCoversionDetails(
                payload
              );

              console.log(beyonicCurrencyData)

             await Promise.all(getData.map(async info=>{
                if(beyonicCurrencyData == null) {
                    beyonicCurrencyData['usd_rate'] = 1;
                  }

                  beyonicCurrencyData = await func.getLocalCurrencyConversionDetailsAsPerGameRegionType(info, beyonicCurrencyData)

                  
                  info.conversionRate = beyonicCurrencyData['usd_rate'];
                  info.localCurrency = beyonicCurrencyData.code;

                  info['localEntryFee'] = Math.ceil(info.entryFee * beyonicCurrencyData['usd_rate']);

                  info.prize = info.prize.map(info=> info *beyonicCurrencyData['usd_rate'])

                  //  if(info.allowedCountries.length == 1) {
                    // info['entryFeeWithCommission'] = Math.ceil((((info.jiwemanCommisionPercentage)/100) * info['entryFee']) + info['entryFee']);
                    // info['localEntryFee'] = Math.ceil(info.entryFee * beyonicCurrencyData['usd_rate']);
                    // info['localEntryFeeWithCommission']= Math.ceil((((info.jiwemanCommisionPercentage)/100) * info['localEntryFee']) + info['localEntryFee']); 
                    // info.supportedNetworks = beyonicCurrencyData.country.supportedNetworks;
                    //info.commission = (((info.jiwemanCommisionPercentage)/100) * info['localEntryFee'])
                // }
              
              }))
              func.addIsOneOnOneBetAlreadyActiveForTheUser(
                getData,
                payload,
                (remodifiedLeaguesArray) => {
                  let response = {
                    message: "Data found",
                    status: true,
                    data: remodifiedLeaguesArray
                  }
                  statusCode = 200
      
                  func.log("getOneonOneCards", req.body, statusCode, response)
                  return res
                    .status(statusCode)
                    .send(response)
                  
                }
              );

              // res.json({
              //   status: 200,
              //   message: 'Data found',
              //   data: getData,
              // });
        }
        catch(e){
          let response = {
            message: e.message,
            status: false
          }
          let statusCode = 400
          func.log("getOneonOneCards",req.body,statusCode,response)
          return res
            .status(statusCode)
            .send(response)
        }
   })

}

/*
 * --------------------------------------------------------------------------
 * get getOneonOneCardForPWFMode API start
 * ---------------------------------------------------------------------------
 */

exports.returnCardForpwfMode = async (req,res,next)=> {
  console.log('inside returnCardForpwfMode');
  func.checkUserAuthentication(req, res, async (payload) =>{

    let gameId = req.query.gameId;

    if(_.isEmpty(gameId)){
      let response = {
        message: 'please specify gameId',
        status: false
      }
      let statusCode = 400
      func.log("getOneonOneCardForPWFMode", req.body, statusCode, response)
      return res
        .status(statusCode)
        .send(response)
    }

    try{
      // const projection = {gameName: 1, entryFee: 1, numberOfGoalsToWin: 1, betType: 1};
      
        var getData = await OneonOne.findOne({
          _id: gameId
          },{gameName: 1, entryFee: 1, numberOfGoalsToWin: 1, betType: 1, gameCurrency: 1}).lean();
    
         if(_.isEmpty(getData)){
          let response = {
            message: 'one on one data not found',
            status: false
          }
          let statusCode = 400
          func.log("getOneonOneCardForPWFMode", req.body, statusCode, response)
          return res
            .status(statusCode)
            .send(response)
        }
        let response = {
          status: true,
          message: 'Data found',
          data: getData,
        }

        statusCode = 200

        func.log("getOneonOneCardForPWFMode", req.body, statusCode, response)
        res
          .status(statusCode)
          .send(response)
    }
    catch(e){
      let response = {
        message: err.message,
        status: false
      }
      let statusCode = 400
      func.log("getOneonOneCardForPWFMode", req.body, statusCode, response)
      return res
        .status(statusCode)
        .send(response)
    }
})

}
exports.getGameListForAdmin = async (req, res, next) => {
  func.checkUserAuthentication(req, res, async (payload) => {
    try {
      let query = {}
      if (!payload.admin.isSuperAdmin) {
        query.bettingCompanyId = payload.admin.bettingCompanyId
      }

      var getData = await OneonOne.find(query).lean();
      res.json({
        status: 200,
        message: 'Data found',
        data: getData,
      });
    } catch (e) {
      return res.status(400).send({
        message: e.message,
        status: false,
      });
    }
  });
};

exports.destroy = async (req, res, next) => {
  func.checkUserAuthentication(req, res, async function (payload) {
  try {
    var id = req.params.id;
    OneonOne.deleteOne({ _id: id }, function (err, result) {
      res.json({
        status: 200,
        message: 'One on One data deleted',
      });
    });
  } catch (e) {
    return res.status(400).send({
      message: e.message,
      status: false,
    });
  }
    })
};

exports.edit = async (req, res, next) => {
    func.checkUserAuthentication(req, res,async function (payload) {
        try{
            var id=req.params.id;
            var type_of_business;
            var getData = await OneonOne.findOne({_id:id}).lean();
            if(req.body.entryFee){
              req.body.origianlEntryFee=req.body.entryFee;
            }

            if(_.isEmpty(req.body.type_of_business)){
              type_of_business=getData.type_of_business;
            }
            else{
              type_of_business=req.body.type_of_business;
            }

            var data = {...getData,...req.body}; 

            let date = new Date();
            let ISOdate = date.getTime();

            if (!data.startDate) {
              throw new Error('startDate not defined.');
            }
            if (data.startDate != '' && data.startDate != undefined) {
              // var startDate = func.stringToDate(data.startDate);
              var startDate = new Date(data.startDate).getTime();
            }
    
            if (!data.endDate) {
              throw new Error('endDate not defined.');
            }
            if (data.endDate != '' && data.endDate != undefined) {
              // var endDate = func.stringToDate(data.endDate);
              var endDate = new Date(data.endDate).getTime();
            }

            data.startDate = startDate;
            data.endDate = endDate;

            if (startDate <= ISOdate && endDate >= ISOdate) {
              data.status = 'active';
            } else if (startDate < ISOdate && endDate < ISOdate) {
              data.status = 'ended';
            }
            
            console.log(data);
            console.log("??????????????>>>>>>>>>>>>>>>");
            // console.log(data);
            console.log(data);
           if(type_of_business=='business_first'){
            data = await func.calculatePrize_1(data,'oneonone'); 
           }
           else if(type_of_business=='customer_first'){
             data = await func.calculatePrize_2(data,'oneonone');
           }
           
            console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");

            console.log(data);

            OneonOne.findOneAndUpdate({_id:id},{$set:data},{new:true},(err,updated)=>{
              
                res.json({
                    status: 200,
                    message: 'One on One data updated',
                    data: updated,
                  });
            })

        }
        catch(e){
          return res.status(200).send({
            message: e.message,
            status: false,
          });
        }
    })
}

exports.checkBalance = (req, res, next) => {
  func.checkUserAuthentication(req, res, async function (payload) {
    const response = await getBalance(payload.sub);
    var oneononeData = req.params.oneonone;
    var getData = await OneonOne.findOne({_id:oneononeData}).lean();    
    var beyonicCurrencyData = await func.getLocalCurrencyCoversionDetails(
      payload
    );

    beyonicCurrencyData = await func.getLocalCurrencyConversionDetailsAsPerGameRegionType(getData, beyonicCurrencyData)
    
     let localEntryFee = Math.ceil(getData.entryFee * beyonicCurrencyData['usd_rate']);
     //let localEntryFeeWithCommission = Math.ceil((((getData.jiwemanCommisionPercentage)/100) * localEntryFee) + localEntryFee);

    if(response.balance >=localEntryFee ){
      res.json({message:'sufficient balance',balance:response.balance});
    }
    else{
      res.json({message:"insufficent balance",balance:response.balance})
    }
  })
}

exports.createMatch= async (req,res,next)=> {
func.checkUserAuthentication(req, res, async function (payload) {
  try{
    var data= req.body;

    if (data.matchType == 'oneononeBet') {
      if(_.isEmpty(data.oneonone)) {
        return res.status(400).send({
          message: "Please specify oneonone bet ID",
          status: false
        });
      }
    }

    
  data.bettingCompanyId = payload.bettingCompanyId;
   var obj = new Match(data);
   obj.save(async function(err,result){
    if(err){
      return res.status(200).send({ "message": "something went wrong", status: false })
    }
    else{

     var getUserData = await userBettingData(data.playerOneUserName,data.playerTwoUserName,data.oneonone);
     console.log(">>>>>>>>>>>>>>"); 
      result= {...getUserData,result}
      res.json({
        status: true,
        message: "New match created",
        data: result
      })
    }
    
   })
  }
  catch(e){
    return res.status(200).send({
      message: e.message,
      status: false,
    });
  }
  })
}

exports.updateOneOnOneLeaderBoardData = (req, res) => {
  console.log('inside oneonone update');
  func.checkUserAuthentication(req, res, async function (payload) {
    let winLoseData = req.body;
    console.log('winLoseData 404',winLoseData);
    if (!req.body) {
      console.log('empty body 406');
      let response = {
        message: 'Bad Request',
        status: false
      }
      let statusCode = 400
      func.log("updateoneononmatch", req.body, statusCode, response)
      return res
        .status(statusCode)
        .send(response)
    } else {

      if(winLoseData.isGameValid == false) {

        var updateGamePlayChanceP1 = await func.addOneOnOneFreeBetsCount(winLoseData.playerOneUserName, winLoseData.oneonone);
        var updateGamePlayChanceP2 = await func.addOneOnOneFreeBetsCount(winLoseData.playerTwoUserName, winLoseData.oneonone);

        var matchDataUpdate = await Match.findOneAndUpdate({
          // roomName: winLoseData.roomName,
          matchStatus: 'active',
          _id: winLoseData.matchId
        }, {
          isGameValid: winLoseData.isGameValid,
          matchStatus: 'invalid'
        }, {
          upsert: false,
          new: true,
          useFindAndModify: false
        })
        // console.log(matchDataUpdate);
        if (_.isEmpty(matchDataUpdate)) {
          console.log('matchupdate 430');
          let response = {
            message: 'Enter valid matchId or roomName',
            status: false
          }
          // let statusCode = 400
          // func.log("updateoneononmatch", req.body, statusCode, response)
          // return res
          //   .status(statusCode)
          //   .send(response)

          // return res.status(200).send({ message: 'invalid match', status: true });
          return res
            .status(statusCode)
            .send(response)

        } else {
          return res.status(200).send({ message: 'invalid match', status: true });

        }

      }

      let player1FinalData = await LeaderBoard.findOne({playerName:winLoseData.playerOneUserName,matchId:winLoseData.matchId}).exec();
      let player2FinalData = await LeaderBoard.findOne({playerName:winLoseData.playerTwoUserName,matchId:winLoseData.matchId}).exec();

      console.log(player1FinalData)
      console.log(player2FinalData)

      if (player1FinalData && player2FinalData) {

        let response = {
          status: true,
          message: 'Data fetched succesfully',
          data: {
            player1data: player1FinalData,
            player2data: player2FinalData
          }
        }

        statusCode = 200

        func.log("updateoneononmatch", req.body, statusCode, response)
        res
          .status(statusCode)
          .send(response)



      } else if(winLoseData.senderId != 'obs1'){

        let currTime = moment().unix();

        await OneOnOneData.updateOne({
            senderId:winLoseData.senderId,
            matchId:winLoseData.matchId
          },
          winLoseData,
          {
            upsert: true,
          });

        console.log(currTime)

        while((!player1FinalData || !player2FinalData) && moment().unix() < currTime+17){

          player1FinalData = await LeaderBoard.findOne({playerName:winLoseData.playerOneUserName,matchId:winLoseData.matchId}).exec();
          player2FinalData = await LeaderBoard.findOne({playerName:winLoseData.playerTwoUserName,matchId:winLoseData.matchId}).exec();

        }

        if(player1FinalData && player2FinalData){

          let response = {
            status: true,
            message: 'Data fetched succesfully',
            data: {
              player1data: player1FinalData,
              player2data: player2FinalData
            }
          }
  
          statusCode = 200
  
          func.log("updateoneononmatch", req.body, statusCode, response)
          res
            .status(statusCode)
            .send(response)

        }else{

          let response = {
            status: true,
            message: 'Timed out',
            data: {
              player1data: player1FinalData,
              player2data: player2FinalData
            }
          }
  
          statusCode = 200
  
          func.log("updateoneononmatch", req.body, statusCode, response)
          res
            .status(statusCode)
            .send(response)


        }

      }else{

        try {
          // console.log("match update")
          var matchDataUpdate = await Match.findOneAndUpdate({
            // roomName: winLoseData.roomName,
            matchStatus: 'active',
            _id: winLoseData.matchId
          }, {
            winnerName: winLoseData.winnerName,
            playerOneGoal: winLoseData.playerOneGoal,
            playerTwoGoal: winLoseData.playerTwoGoal,
            playerOneMatchDuration: winLoseData.playerOneMatchDuration,
            playerTwoMatchDuration: winLoseData.playerTwoMatchDuration,
            matchDuration: winLoseData.matchDuration,
            matchStatus: 'finished'
          }, {
            upsert: false,
            new: true,
            useFindAndModify: false
          })
          // console.log(matchDataUpdate);
          if (_.isEmpty(matchDataUpdate)) {
            console.log('matchupdate 430');
            let response = {
              message: 'Enter valid matchId or roomName',
              status: false
            }
            let statusCode = 400
            func.log("updateoneononmatch", req.body, statusCode, response)
            return res
              .status(statusCode)
              .send(response)
          }
     // var id = winLoseData.matchId;
     
          let p1Obj = {};
          let p2Obj = {};
          var winPoints = 5;
          var lossPoints = -0.25;
          var goalPoints = 1;
          var goalLosePoints = -0.5;
          var goalDiffPoints = 1.5;
          var cSpoints = 3;
          var matchPlayPoints = 1;
  
          let matchData = winLoseData;
  
          var p1winCount = 0;
          var p1winPoints = 0;
          var p1winStreak = 0;
          var p2winCount = 0;
          var p2winPoints = 0;
          var p2winStreak = 0;
  
          var p1lossCount = 0;
          var p1lossPoints = 0;
          var p2lossCount = 0;
          var p2lossPoints = 0;
  
          var p1goalFor = 0;
          var p1GFpts = 0;
          var p2goalFor = 0;
          var p2GFpts = 0;
  
  
          var p1goalAgainst = 0;
          var p1GApts = 0;
          var p2goalAgainst = 0;
          var p2GApts = 0;
  
          var p1cleanSheet = 0;
          var p1CsPoints = 0;
          var p2cleanSheet = 0;
          var p2CsPoints = 0;
  
          var p1matchesPlayed = 0;
          var p1GPpts = 0;
          var p2matchesPlayed = 0;
          var p2GPpts = 0;
  
          var p1goalDiff = 0;
          var p1GDPoints = 0;
          var p2goalDiff = 0;
          var p2GDPoints = 0;
  
          var p1totalPoints = 0;
          var p2totalPoints = 0;
  
         
          if (matchData.playerTwoGoal != 0 || matchData.playerOneGoal != 0) {
            if (matchData.playerTwoGoal == 0) {
              p1cleanSheet++;
              p1CsPoints = p1CsPoints + cSpoints;
            }
          } else {
            p1cleanSheet = p1cleanSheet + p1cleanSheet;
          }
  
          if (matchData.playerTwoGoal != 0 || matchData.playerOneGoal != 0) {
            if (matchData.playerOneGoal == 0) {
              p2cleanSheet++;
              p2CsPoints = p2CsPoints + cSpoints;
            }
          } else {
            p2cleanSheet = p2cleanSheet + p2cleanSheet;
          }
  
          if (matchData.winnerName == matchData.playerOneUserName) {
            p1winStreak++;
            p2winStreak = 0;
            p1winCount++;
            p1winPoints = p1winPoints + winPoints;
          }
  
          if (matchData.winnerName == matchData.playerTwoUserName) {
            p2winStreak++;
            p1winStreak = 0;
            p2winCount++;
            p2winPoints = p2winPoints + winPoints;
          }
  
          if (matchData.winnerName == matchData.playerOneUserName) {
            p2lossCount++;
            p2lossPoints = p2lossPoints + lossPoints;
          }
  
          if (matchData.winnerName == matchData.playerTwoUserName) {
            p1lossCount++;
            p1lossPoints = p1lossPoints + lossPoints;
          }
  
  
          p1goalAgainst =
            parseInt(p1goalAgainst) + parseInt(matchData.playerTwoGoal);
  
          p2goalAgainst =
            parseInt(p2goalAgainst) + parseInt(matchData.playerOneGoal);
  
          p1goalFor = parseInt(p1goalFor) + parseInt(matchData.playerOneGoal);
  
          p2goalFor = parseInt(p2goalFor) + parseInt(matchData.playerTwoGoal);
  
          p1goalDiff = p1goalFor - p1goalAgainst;
  
          p1GDPoints = p1goalDiff * goalDiffPoints;
  
          p2goalDiff = p2goalFor - p2goalAgainst;
  
          p2GDPoints = p2goalDiff * goalDiffPoints;
  
          p1matchesPlayed = p1winCount + p1lossCount;
  
          p2matchesPlayed = p2winCount + p2lossCount;
  
          p1Obj.gameId = matchData.oneonone;
          p1Obj.gameType = matchData.matchType;
          p1Obj.playerName = matchData.playerOneUserName;
          p1Obj.win = p1winCount;
          p1Obj.loss = p1lossCount;
          p1Obj.goalFor = p1goalFor;
          p1Obj.goalAgainst = p1goalAgainst;
          p1Obj.cleanSheet = p1cleanSheet;
          p1Obj.goalDiff = p1goalDiff;
          p1Obj.matchesPlayed = p1matchesPlayed;
          p1Obj.winPoints = p1winPoints;
          p1Obj.lossPoints = p1lossPoints;
          p1Obj.cSpoints = p1CsPoints;
          p1Obj.winStreak = p1winStreak;
          p1Obj.currentWinStreak = p1winStreak;
          p1Obj.matchId = winLoseData.matchId;
        
          var firstPlayer = await Player.findOne({userName : p1Obj.playerName}).lean();
  
          p1Obj.bettingCompanyId = firstPlayer.bettingCompanyId;
          console.log('p1Obj.bettingCompanyId 578',p1Obj.bettingCompanyId);
  
          // p1Obj.highestWinStreak = p1Obj.currentWinStreak;
  
          p2Obj.gameId = matchData.oneonone;
          p2Obj.gameType = matchData.matchType;
          p2Obj.playerName = matchData.playerTwoUserName;
          p2Obj.win = p2winCount;
          p2Obj.loss = p2lossCount;
          p2Obj.goalFor = p2goalFor;
          p2Obj.goalAgainst = p2goalAgainst;
          p2Obj.cleanSheet = p2cleanSheet;
          p2Obj.goalDiff = p2goalDiff;
          p2Obj.matchesPlayed = p2matchesPlayed;
          p2Obj.winPoints = p2winPoints;
          p2Obj.lossPoints = p2lossPoints;
          p2Obj.cSpoints = p2CsPoints;
          p2Obj.winStreak = p2winStreak;
          p2Obj.currentWinStreak = p2winStreak;
          p2Obj.matchId = winLoseData.matchId;
  
          var secondPlayer = await Player.findOne({userName : p2Obj.playerName}).lean();
  
          p2Obj.bettingCompanyId = secondPlayer.bettingCompanyId;
          console.log('p2Obj.bettingCompanyId 600',p2Obj.bettingCompanyId);
          // p2Obj.highestWinStreak = p2Obj.currentWinStreak;
  
          var updatedPlayer1 = p1Obj;
          var updatedPlayer2 = p2Obj;
  
          if (p1Obj.matchesPlayed >= 1) {
            p1GPpts = p1GPpts + p1Obj.matchesPlayed * matchPlayPoints;
          } else {
            p1GPpts = p1GPpts;
          }
  
          if (p2Obj.matchesPlayed >= 1) {
            p2GPpts = p2GPpts + p2Obj.matchesPlayed * matchPlayPoints;
          } else {
            p2GPpts = p2GPpts;
          }
  
          if (p1Obj.goalFor >= 1) {
            p1GFpts = p1GFpts + p1Obj.goalFor * goalPoints;
          } else {
            p1GFpts = p1GFpts;
          }
  
          if (p2Obj.goalFor >= 1) {
            p2GFpts = p2GFpts + p2Obj.goalFor * goalPoints;
          } else {
            p2GFpts = p2GFpts;
          }
  
          if (p1Obj.goalAgainst >= 1) {
            p1GApts = p1GApts + p1Obj.goalAgainst * goalLosePoints;
          } else {
            p1GApts = p1GApts;
          }
  
          if (p2Obj.goalAgainst >= 1) {
            p2GApts = p2GApts + p2Obj.goalAgainst * goalLosePoints;
          } else {
            p2GApts = p2GApts;
          }
  
          p1totalPoints =
            p1totalPoints +
            (p1winPoints +
              p1lossPoints +
              p1CsPoints +
              p1GFpts +
              p1GApts +
              p1GPpts +
              p1GDPoints);
  
          p1Obj.GFpts = p1GFpts;
          p1Obj.GApts = p1GApts;
          p1Obj.GPpts = p1GPpts;
          p1Obj.GDpts = p1GDPoints;
          p1Obj.points = p1totalPoints;
  
          p2totalPoints =
            p2totalPoints +
            (p2winPoints +
              p2lossPoints +
              p2CsPoints +
              p2GFpts +
              p2GApts +
              p2GPpts +
              p2GDPoints);
  
          p2Obj.GFpts = p2GFpts;
          p2Obj.GApts = p2GApts;
          p2Obj.GPpts = p2GPpts;
          p2Obj.GDpts = p2GDPoints;
          p2Obj.points = p2totalPoints;
  
          p1durationInSeconds = parseFloat(matchData.playerOneMatchDuration ? matchData.playerOneMatchDuration : 0);
          p2durationInSeconds = parseFloat(matchData.playerTwoMatchDuration ? matchData.playerTwoMatchDuration : 0);
  
          p1Obj.pointsPerMinute = !isNaN(p1Obj.pointsPerMinute) ? p1Obj.pointsPerMinute : 0
          p2Obj.pointsPerMinute = !isNaN(p2Obj.pointsPerMinute) ? p2Obj.pointsPerMinute : 0
  
          var searchP1Obj = {
            playerName: p1Obj.playerName,
            gameType: p1Obj.gameType
          };
  
          var searchP2Obj = {
            playerName: p2Obj.playerName,
            gameType: p2Obj.gameType
          };
  
          if (p1Obj.gameId) {
            searchP1Obj = await func.checkAuthorizedPlayerForBet(p1Obj,1,matchData.winnerName);
          }
  
          if (p2Obj.gameId) {
            searchP2Obj = await func.checkAuthorizedPlayerForBet(p2Obj,2,matchData.winnerName)
          }
  
          var playerOneData = await LeaderBoard.findOne(searchP1Obj.searchObj).exec();
          var playerTwoData = await LeaderBoard.findOne(searchP2Obj.searchObj).exec();
          // var player1FinalData, player2FinalData;
          var p1PPM, p2PPM;
  
  
          if (playerTwoData) {
            if (p2winStreak == 0) {
              playerTwoData.currentWinStreak = 0;
            } else {
              playerTwoData.currentWinStreak = p2winStreak + playerTwoData.currentWinStreak;
              if (playerTwoData.currentWinStreak == 2) {
                playerTwoData.highestWinStreak = playerTwoData.currentWinStreak + playerTwoData.highestWinStreak;
              }
              else if (playerTwoData.currentWinStreak > 2 && p2winStreak == 1) {
                playerTwoData.highestWinStreak = playerTwoData.highestWinStreak + 1;
              }
            }
            playerTwoData = await func.assignPlayerData(playerTwoData, updatedPlayer2, p2GFpts, p2GApts, p2GPpts, p2GDPoints, p2totalPoints)
          }
  
          if (playerOneData) {
            if (p1winStreak == 0) {
              playerOneData.currentWinStreak = 0;
            } else {
              playerOneData.currentWinStreak = p1winStreak + playerOneData.currentWinStreak;
              if (playerOneData.currentWinStreak == 2) {
                playerOneData.highestWinStreak = playerOneData.currentWinStreak + playerOneData.highestWinStreak;
              }
              else if (playerOneData.currentWinStreak > 2 && p1winStreak == 1) {
                playerOneData.highestWinStreak = playerOneData.highestWinStreak + 1;
              }
            }
            playerOneData = await func.assignPlayerData(playerOneData, updatedPlayer1, p1GFpts, p1GApts, p1GPpts, p1GDPoints, p1totalPoints)
  
          }
  
          let p1Data = _.isEmpty(playerOneData) ? p1matchesPlayed : playerOneData.matchesPlayed;
          let p2Data = _.isEmpty(playerTwoData) ? p2matchesPlayed : playerTwoData.matchesPlayed;
  
          p1Obj.points = _.isEmpty(playerOneData) ? p1Obj.points : playerOneData.points;
          p2Obj.points = _.isEmpty(playerTwoData) ? p2Obj.points : playerTwoData.points;
  
  
          var temp = await func.calculatePPM(p1durationInSeconds, p2durationInSeconds, p1Data, p2Data, p1Obj, p2Obj, matchData);
  
          p1PPM = temp.p1;
          p2PPM = temp.p2;
  
          if (playerOneData && playerOneData.matchesPlayed > 1) {
            let tmp = (playerOneData.pointsPerMinute + parseFloat(p1PPM)) / playerOneData.matchesPlayed;
            playerOneData.avgPointsPerMinute = tmp.toFixed(4);
            playerOneData.pointsPerMinute = playerOneData.pointsPerMinute + parseFloat(p1PPM);
            playerOneData.matchId = winLoseData.matchId;
            player1FinalData = await playerOneData.save();
          }
          else {
            p1Obj.pointsPerMinute = p1PPM;
            p1Obj.avgPointsPerMinute = p1PPM.toFixed(4);
            var leaderBoard = new LeaderBoard(p1Obj);
            player1FinalData = await leaderBoard.save();
          }
  
  
          if (playerTwoData && playerTwoData.matchesPlayed > 1) {
            let temp = (playerTwoData.pointsPerMinute + parseFloat(p2PPM)) / playerTwoData.matchesPlayed;
            playerTwoData.avgPointsPerMinute = (temp).toFixed(4);
            playerTwoData.pointsPerMinute = playerTwoData.pointsPerMinute + parseFloat(p2PPM);
            playerTwoData.matchId = winLoseData.matchId;
            player2FinalData = await playerTwoData.save();
          }
          else {
            p2Obj.pointsPerMinute = p2PPM;
            p2Obj.avgPointsPerMinute = p2PPM.toFixed(4);
            var leaderBoard = new LeaderBoard(p2Obj);
            player2FinalData = await leaderBoard.save()
          }
  
          console.log('775 winLoseData',winLoseData);
          
          var getData = await OneonOne.findOne({_id:winLoseData.oneonone}).lean();
  
          console.log('getData 777',getData);
  
          if(searchP1Obj.winCount + searchP1Obj.lossCount == getData.gameCount){
            let beyonicCurrencyData = await func.getLocalCurrencyCoversionDetails(
            payload
          );
              beyonicCurrencyData = await func.getLocalCurrencyConversionDetailsAsPerGameRegionType(getData, beyonicCurrencyData)
             let prize = getData.prize[searchP1Obj.winCount]
                 prize = prize * beyonicCurrencyData['usd_rate'];
              if (prize > 0){
                await creditToWallet(searchP1Obj.player._id,searchP1Obj.player.bettingCompanyId,prize,prize,winLoseData.matchId, 'Won OneOnOne '+getData.gameName, 'successful',true)
              }
            }
       
          if(searchP2Obj.winCount + searchP2Obj.lossCount == getData.gameCount){
              let beyonicCurrencyData = await func.getLocalCurrencyCoversionDetails(
            payload
          );
                 beyonicCurrencyData = await func.getLocalCurrencyConversionDetailsAsPerGameRegionType(getData, beyonicCurrencyData)
                let prize = getData.prize[searchP2Obj.winCount]
                    prize = prize * beyonicCurrencyData['usd_rate'];
                if (prize > 0){   
                   await creditToWallet(searchP2Obj.player._id,searchP2Obj.player.bettingCompanyId,prize,prize,winLoseData.matchId, 'Won OneOnOne '+getData.gameName, 'successful',true)
                }
            }
  
           // add price in winner player
          // var findWinnerData = await Player.findOne({userName:winLoseData.winnerName})
          // var getData = await OneonOne.findOne({_id:winLoseData.oneonone}).lean();    
          // var beyonicCurrencyData = await func.getLocalCurrencyCoversionDetails(
          //   payload
          // );
  
        // check stake value 
  
  
          // beyonicCurrencyData = await func.getLocalCurrencyConversionDetailsAsPerGameRegionType(getData, beyonicCurrencyData)
  
          // let localEntryFee = Math.ceil(getData.entryFee * beyonicCurrencyData['usd_rate']); 
          // //let localEntryFeeWithCommission = Math.ceil((((getData.jiwemanCommisionPercentage)/100) * localEntryFee) + localEntryFee); 
          // let amount = localEntryFee * 2;
          //     reference = getData._id;
  
          // // Verify the amount which is being credited to the user wallet.
          //  await creditToWallet(findWinnerData._id,amount,amount,winLoseData.matchId, 'Won OneOnOne '+getData.gameName, 'successful')
         
          let response = {
            status: true,
            message: 'Match end  and Leader board data updated',
            data: {
            player1data: player1FinalData,
            player2data: player2FinalData
            }
          }
  
          statusCode = 200
  
          func.log("updateoneononmatch", req.body, statusCode, response)
          res
            .status(statusCode)
            .send(response)
  
        } catch (error) {
          console.log('catch 837', error);
          let response = {
            message: error.message,
            status: false
          }
          let statusCode = 400
          func.log("updateoneononmatch", req.body, statusCode, response)
          return res
            .status(statusCode)
            .send(response)

        }
        
      }



  
    }
  });
};
exports.purchaseBet = async (req, res, next) => {
  func.checkUserAuthentication(req, res, async function (payload) {

    let userId = payload.sub;
    let gameData = await OneonOne.findById(req.body.gameId).lean();
    let getReward;
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
    console.log(payload)
    if(payload.player.referBy){
      getReward = await func.rewardFriend(payload,'oneononebet');
      console.log("780>>>")
    }   
    console.log("getRewards")
    console.log(getReward);

    if (_.isEmpty(gameData)) {
      let response = {
        message: "Game is invalid",
        status: false
      }
      let statusCode = 400
      func.log("purchaseBet",req.body,statusCode,response)
      return res
        .status(statusCode)
        .send(response)

    } else if (gameData) {

      var getPrevData = await playerBet
      .find({ userId: userId, gameId: req.body.gameId })
      .sort({ _id: -1 })
      .limit(1);

      if (getPrevData) {
        if (
          getPrevData[0] &&
          getPrevData[0].remaining == getPrevData[0].totalAllowed
        ) {
          let response = {
            message: "You have already purchased this bet",
            status: false
          }
          let statusCode = 400
          func.log("purchaseBet",req.body,statusCode,response)
          return res
            .status(statusCode)
            .send(response)

        }
      }

    if(req.body.mode !== 'wallet' && req.body.mode !== 'walletFromPG') {
      let response = {
        message: "please enter valid mode",
        status: false
      }
      let statusCode = 400
      func.log("purchaseBet",req.body,statusCode,response)
      return res
        .status(statusCode)
        .send(response)
        
    }

    let walletResponse;

    if (req.body.mode === 'wallet') {
      try {
        walletResponse = await debitFromWallet(
          payload.sub,
          gameData.entryFee,
          gameData.entryFee,
          gameData.id,
          'Purchased Bet: ' + gameData.gameName,
          'successful',
          false
        );
      } catch (error) {
        console.log(error)
        let response = {
          message: "Insufficient Balance",
          status: false
        }
        let statusCode = 400
        func.log("purchaseBet",req.body,statusCode,response)
        return res
          .status(statusCode)
          .send(response)
      }


      //Initiate the Creation of purchase successfull flow...
      const playerBet = await func.registerBetSuccessfulPurchase(
        req.body.gameId,
        payload.sub,
        walletResponse.wallet.id
      );

      walletResponse.wallet.reference = playerBet._id;
      walletResponse.wallet.reason += ' (Ticket:' + playerBet.ticket + ')';
      await walletResponse.wallet.save();

      response = {
        mode: req.body.mode,
        status: true,
        message: 'Payment Successful from wallet, Game On...!',
        data: playerBet,
        reward:getReward
    }
    statusCode = 200

    func.log("purchaseBet", req.body, statusCode, response)
    return res
        .status(statusCode)
        .send(response)

    } else if (req.body.mode === 'walletFromPG') {
      //  * If it is PG, accept more info from the user, initiate collection request, do add to wallet, once successful, do the stuff in condition 1.

      req.body.metadata = {
        type: 'PAY_BET_VIA_WALLET_ADD',
        gameId: req.body.gameId,
        userId: payload.sub,
        originalAmount: req.body.amount,
      };

      addToWallet(req, res, next);
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


var userBettingData = async function(playerOne,playerTwo,gameId){

return new Promise(async (resolve,reject)=>{
var data ={};
 var getUserData = await Player.find({userName:{$in:[playerOne,playerTwo]}}).lean();
 var getGameData = await OneonOne.findOne({_id:gameId}).lean();


 const modifiedList = await Promise.all(
  getUserData.map(async (info) => {
    
    query = {
      gameId: getGameData._id,
      userId: info._id,
   }

   var getPlayerBetInfo = await playerBet.find(query).sort({ _id: -1 }).lean();
   console.log(getPlayerBetInfo);
   if(info.userName==playerOne){
    if(getPlayerBetInfo[0].totalAllowed != getPlayerBetInfo[0].remaining){
      data.playerOneAmount = getGameData.prize[getPlayerBetInfo[0].win+1] - getGameData.prize[getPlayerBetInfo[0].win] 
      // data.playerOneAmount = data.playerOneAmount - getGameData.prize[getPlayerBetInfo[0].win]
    }
    else{
      
      data.playerOneAmount = getGameData.prize[getPlayerBetInfo[0].win+getPlayerBetInfo[0].loss+1];
      data.playerOneAmount = data.playerOneAmount - getGameData.prize[getPlayerBetInfo[0].win]
   
    }
   }
   else{

    if(getPlayerBetInfo[0].totalAllowed != getPlayerBetInfo[0].remaining && info.userName==playerTwo){
      data.playerTwoAmount = getGameData.prize[getPlayerBetInfo[0].win+1] - getGameData.prize[getPlayerBetInfo[0].win] 
   }
    else{
      data.playerTwoAmount = getGameData.prize[getPlayerBetInfo[0].win+getPlayerBetInfo[0].loss+1];
      data.playerTwoAmount = data.playerTwoAmount - getGameData.prize[getPlayerBetInfo[0].win]
    }
  
   }
  
  
  })
);
console.log(data);
resolve(data);

})
}

