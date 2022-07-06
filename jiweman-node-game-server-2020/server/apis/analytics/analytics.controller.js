let func = require('../common/commonfunction');
let sendResponse = require('../common/sendresponse');
let logger = require('../../logger/log');
let Download = require('./analytics.model').Download;
let Role = require('../playerAuth/player.model').Role;
let Player = require('../playerAuth/player.model').Player;
let Match = require('../matchPlay/matchplay.model').Match;
let League = require('../league/league.model').League;
let LeaderBoard = require('../leaderboard/leaderboard.model').LeaderBoard;
var randomize = require('randomatic');
let Wallet = require('../paymentAPIs/wallet/wallet.model').Wallet;
var bcrypt = require('bcryptjs');
var _ = require('underscore');
var ObjectID = require('mongodb').ObjectID;
const { Statistics } = require('../analytics/analytics.model');
const { concatSeries } = require('async');
const { filter, last } = require('underscore');
const { query } = require('winston');

/*
 * --------------------------------------------------------------------------
 * Stats API
 * ---------------------------------------------------------------------------
 */
exports.getAllStats = async function (req, res, next) {
  func.checkUserAuthentication(req, res, function (payload) {
    var statsData = {};

    Match.find({ matchStatus: 'finished' }).exec(function (err, matches) {
      var totalMatchesPlayed = matches.length;
      statsData['totalMatches'] = totalMatchesPlayed;

      let totalGoals = matches.reduce((s, f) => {
        return s + parseInt(f.playerOneGoal); // return the sum of the accumulator and the current time, as the the new accumulator
      }, 0);
      statsData['totalGoals'] = totalGoals;
      statsData['macthesCount'] = _.countBy(matches, 'matchType');
      statsData['totalTimeSpent'] = 0;
      statsData['femaleTimeSpent'] = 0;
      statsData['maleTimeSpent'] = 0;
      statsData['18-21'] = 0;
      statsData['22-25'] = 0;
      statsData['26+'] = 0;

      League.find().exec(function (err, leagues) {
        var onGoingLeagues = _.filter(leagues, function (item, index) {
          return item.startDate < new Date() && item.endDate > new Date();
        });
        statsData['onGoingLeagues'] = onGoingLeagues.length;
        Player.find().exec(function (err, players) {
          Object.entries(players).forEach(([playerKey, value], playerIndex) => {
            Object.entries(matches).forEach(([key, value], index) => {
              let diff = new Date(
                matches[index].updatedAt - matches[index].createdAt
              );
              var hours = diff.getUTCHours();
              var minutes = diff.getUTCMinutes();
              var seconds = diff.getUTCSeconds();

              if (
                players[playerIndex].userName ==
                  matches[index].playerOneUserName ||
                (players[playerIndex].userName ==
                  matches[index].playerTwoUserName &&
                  players[playerIndex].gender == 'female')
              ) {
                statsData['femaleTimeSpent'] =
                  statsData['femaleTimeSpent'] + minutes;
              } else if (
                players[playerIndex].userName ==
                  matches[index].playerOneUserName ||
                (players[playerIndex].userName ==
                  matches[index].playerTwoUserName &&
                  players[playerIndex].gender == 'male')
              ) {
                statsData['maleTimeSpent'] =
                  statsData['maleTimeSpent'] + minutes;
              }

              if (
                players[playerIndex].userName ==
                  matches[index].playerOneUserName ||
                players[playerIndex].userName ==
                  matches[index].playerTwoUserName
              ) {
                if (
                  players[playerIndex].age <= 21 &&
                  players[playerIndex].age >= 18
                ) {
                  console.log('inside 18-21');
                  statsData['18-21'] = statsData['18-21'] + minutes;
                }
              }

              if (
                players[playerIndex].userName ==
                  matches[index].playerOneUserName ||
                players[playerIndex].userName ==
                  matches[index].playerTwoUserName
              ) {
                if (
                  players[playerIndex].age <= 25 &&
                  players[playerIndex].age >= 22
                ) {
                  console.log('inside 22-25');
                  statsData['22-25'] = statsData['22-25'] + minutes;
                }
              }

              if (
                players[playerIndex].userName ==
                  matches[index].playerOneUserName ||
                players[playerIndex].userName ==
                  matches[index].playerTwoUserName
              ) {
                if (players[playerIndex].age >= 26) {
                  statsData['26+'] = statsData['26+'] + minutes;
                }
              }
            });
          });

          matches.forEach((match) => {
            if ((match.matchStatus = 'finished')) {
              let diff = new Date(match.updatedAt - match.createdAt);
              var hours = diff.getUTCHours();
              var minutes = diff.getUTCMinutes();
              var seconds = diff.getUTCSeconds();
              statsData['totalTimeSpent'] =
                statsData['totalTimeSpent'] + minutes;
            }
          });

          var totalPlayersOnboarded = players.length;
          statsData['totalPlayersOnboarded'] = totalPlayersOnboarded;

          var statsByGender = _.countBy(players, 'gender');
          statsData['statsByGender'] = statsByGender;

          var statsByCountry = _.countBy(players, 'countryOfRecidence');
          statsData['statsByCountry'] = statsByCountry;
          statsData['agewise'] = {};
          var player18_21 = players.filter(function (o) {
            // check value is within the range
            // remove `=` if you don't want to include the range boundary

            return o.age <= 21 && o.age >= 18;
          });
          statsData['agewise']['18-21'] = player18_21.length;

          var player22_25 = players.filter(function (o) {
            // check value is within the range
            // remove `=` if you don't want to include the range boundary

            return o.age <= 25 && o.age >= 22;
          });
          statsData['agewise']['22-25'] = player22_25.length;
          var player26Above = players.filter(function (o) {
            // check value is within the range
            // remove `=` if you don't want to include the range boundary

            return o.age >= 26;
          });
          statsData['agewise']['26+'] = player26Above.length;
          Download.find().exec(async function (err, downloads) {
            if (err) {
              console.log(err);
              sendResponse.sendErrorMessage(err, res);
            } else {
              if (downloads.length > 0)
                statsData['downloads'] = downloads[0]['totalDownload'];
              else statsData['downloads'] = 0;

              await Statistics.deleteMany({});
              Statistics.create(statsData);
              statsData.updatedAt = new Date();
              statsData.createdAt = new Date();
              sendResponse.sendSuccessData(statsData, res);
            }
          });
        });
      });
    });
  });
};

exports.getAllStatsFromCache = async function (req, res, next) {
  func.checkUserAuthentication(req, res, async function (payload) {
    const statsData = await Statistics.find({}).lean();
    console.log(statsData)
    if (statsData && statsData[0]) {
      sendResponse.sendSuccessData(statsData[0], res);
    }
  });
};

/*
 * --------------------------------------------------------------------------
 * Updated build downloads counter
 * ---------------------------------------------------------------------------
 */
exports.updateDownloadCount = async function (req, res, next) {
  Download.findOne().exec(function (err, download) {
    if (err) {
      console.log(err);
    }
    console.log(download);
    if (download !== null) {
      console.log('download');
      console.log(download);
      download.totalDownload = download.totalDownload + 1;

      download.save().then(function (successData, err) {
        if (err) {
          let message = 'failed to save';
          let err = err;
          failureRes = { message: message, err: err };
          sendResponse.sendDataNotFound(failureRes, res);
        } else {
          sendResponse.sendSuccessData(successData, res);
        }
      });
    } else {
      let download = new Download();
      download.totalDownload = 1;
      download.save().then(function (successData, err) {
        if (err) {
          sendResponse.sendSuccessData('statsData', res);
        } else {
          sendResponse.sendSuccessData(successData, res);
        }
      });
    }
  });
};

/*
 * --------------------------------------------------------------------------
 * Get total Build Downloads
 * ---------------------------------------------------------------------------
 */
exports.getBuildDownloadsCount = async function (req, res, next) {
  func.checkUserAuthentication(req, res, function (payload) {
    Download.find().exec(function (err, download) {
      if (err) {
        console.log(err);
        sendResponse.sendDataNotFound('not found', err, res);
      }
      if (download.length > 0) {
        sendResponse.sendSuccessData(download, res);
      } else {
        sendResponse.sendDataNotFound();
      }
    });
  });
};

var getGenderDataInfo = (gender)=>{
  // var countryData = _.filter(playerData,{countryOfRecidence:cont.country});
  // var gender = countryData.map(info=>info.gender);
  gender = _.compact(gender);
  getUniqueGender = _.uniq(gender);
  var gender_data = []
      count = gender.length
      sum =0;
      var newObj={}
      getUniqueGender.forEach(info=>{
      var obj={};
      obj['gender'] = info;
      let genderCount = _.filter(gender,function(o){ return o==info })
      obj['per'] = (genderCount.length/count) * 100 
      gender_data.push(obj);
      let tmp = info;
      newObj[info]=obj['per']; 
      sum = sum + obj['per'];
  })

 return newObj;

}

 var getPerHourData = async (data)=>{
  return new Promise(async(resolve,reject)=>{
    try{
      
      console.log("in get get analytics data")
      console.log(data);
      // var date = new Date();
      // var getTime = date.getHours();
      // var dateArray = [];
      // for(i=0;i<getTime;i++){
      //     dateArray.push(new Date().setHours(i,0,0,0))
      // }
     //  console.log(dateArray);

    var query={};
    var populateQuery={"path":"accountNumber"};
     if(!_.isEmpty(data.firstDate) && !_.isEmpty(data.lastDate)){
       console.log("in date")
       query = _.extend(query,{createdAt:{$gte:new Date(data.firstDate),$lte:new Date(data.lastDate)}})
     }
     console.log(query)
      if(data.type=='betting'){
        query= _.extend(query,{reason:/Purchased OneOnOne/i}) 
        //{reason:/Purchased OneOnOne/i,
          //createdAt:{$gte:new Date(firstDate),$lte:new Date(lastDate)}}
        // createdAt:{$gte:new Date(dateArray[0]),$lte:new Date(dateArray[dateArray.length-1])}}
      }
      else if(data.type=='league'){
        query= _.extend(query,{reason:/Purchased League/i})
          //createdAt:{$gte: new Date(data.firstDate),$lte: new Date(data.lastDate)}}
        // createdAt:{$gte:new Date(dateArray[0]),$lte:new Date(dateArray[dateArray.length-1])}}
      }
      else if(data.type=='debit'){
        query= _.extend(query,{operation:data.type})
        //  createdAt:{$gte:new Date(data.firstDate),$lte: new Date(data.lastDate)}}
      }
      else if(data.type=='credit'){
        query= _.extend(query,{operation:data.type})
          //createdAt:{$gte:new Date(data.firstDate),$lte: new Date(data.lastDate)}}
      }
      // if(_.isEmpty(data.type)){
      //   query = {createdAt:{$gte:new Date(data.firstDate),$lte: new Date(data.lastDate)}}
      // }
      if(!_.isEmpty(data.bettingCompanyId)){
        console.log(data.bettingCompanyId)
        populateQuery = _.extend(populateQuery,{"match":{"bettingCompanyId":data.bettingCompanyId}})
      }

      if(!_.isEmpty(data.playerId)){
        query= _.extend(query,{accountNumber:data.type})
      }

      console.log("query")
      console.log(query);
      console.log(populateQuery)
      var getWalletData = await Wallet.find(query).populate(populateQuery).lean();
      getWalletData = _.filter(getWalletData,(o)=>{return o.accountNumber!=null})
      console.log(getWalletData)
      resolve(getWalletData)
        }
    catch(e)
        {
          console.log("error >>>>>>>>>>>")
          console.log(e)
          reject(e)
        }
  })
}

var calculateAge = (dob)=>{
    
  dob =  dob.map((date)=>{
      var today = new Date();
      var mili_dif = Math.abs(today.getTime() - date.getTime());
      var age = (mili_dif / (1000 * 3600 * 24 * 365.25));
   
      return Math.round(age);  
  })
  return dob;

}

var getAgeDataInfo = (age) =>{
  var age_data =[ {age:'18-24',info:[],per:0},
              {age:'24-30',info:[],per:0},
              {age:'30-35',info:[],per:0},
              {age:'35-40',info:[],per:0},
              {age:'40-45',info:[],per:0},
              {age:'45-50',info:[],per:0},
              {age:'50-55',info:[],per:0},
              {age:'55-60',info:[],per:0},
              {age:'60-65',info:[],per:0},
              {age:'65-above',info:[]}] 

  var count = age.length;
  var sum = 0;
  var newObj={}
  age_data.forEach(info=>{
      var min = info.age.split('-')[0]
      var max = info.age.split('-')[1]=='above' ? 100 : info.age.split('-')[1];
      info.info = _.filter(age,function(o){ return o>=min && o<max})
      info.per =  (info.info.length /count) * 100
      sum = sum + info.per;
      let tmp = info.age;
      newObj[tmp]=info.per 
    })

  
    return newObj; 
}

var getTransactionData = (data)=>{
  let sum = 0;
      data = data.map(info=>{sum = sum+info.amountAfterCharges })
  let avg=isNaN(sum/data.length) ? 0 :sum/data.length;
  return {sum:sum,avg:avg};
}

var getCountryData = (country)=>{
  country = _.compact(country); 
  getUniqueContry = _.uniq(country);
  var country_data =[];
  count = country.length
  sum =0;
  let newObj={};
   getUniqueContry.forEach(info=>{
  var obj={};
  obj['country'] = info;
  let countryCount = _.filter(country,function(o){ return o==info })
  obj['per'] = (countryCount.length/count) * 100 
  country_data.push(obj);
  sum = sum + obj['per'];
  let tmp=info;
  newObj[tmp]=obj['per'];
 
})
  return newObj;
  
}

exports.getAgeData = async (req,res,next)=>{
 func.checkUserAuthentication(req,res,async (payload)=>{
    try{
      console.log("get age data");
      console.log(req.query)
      var  {firstDate,lastDate,type}= req.query;
      var getUserInfo = await getPerHourData(req.query);
      
      if(getUserInfo && getUserInfo.length==0){
        return res.status(200).send({
          message: "data not found",
          status: false,
        });
      }
    var dob = getUserInfo.map(info=>info.accountNumber.dateOfBirth)
     dob = _.compact(dob);
     var age = calculateAge(dob);
     var  per_day = getAgeDataInfo(age);
     res.json({
       status:200,
       message:'get analytics data',
       data:per_day
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

exports.getGenderData = async(req,res,next)=>{
  func.checkUserAuthentication(req,res,async (payload)=>{

    try{
      var  {firstDate,lastDate,type}= req.query;
      var getUserInfo = await getPerHourData(req.query);
      if(getUserInfo && getUserInfo.length==0){
        return res.status(200).send({
          message: "data not found",
          status: false,
        });
      }
      var gender = getUserInfo.map(info=>info.accountNumber.gender)
      console.log(gender)
      var gender_data = getGenderDataInfo(gender);
      res.json({
        status:200,
        message:'get analytics data',
        data:gender_data
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

exports.getCountryData = async(req,res,next)=>{
  func.checkUserAuthentication(req,res,async (payload)=>{

  try{
    console.log("get Country data")
    var  {firstDate,lastDate,type}= req.query;
    console.log(new Date(firstDate))
    var getUserInfo = await getPerHourData(req.query);
    if(getUserInfo && getUserInfo.length==0){
      return res.status(200).send({
        message: "data not found",
        status: false,
      });
    }
    var country = getUserInfo.map(info=>info.accountNumber.countryOfRecidence)
    console.log(country)
    var country_data = getCountryData(country);

    res.json({
      status:200,
      message:'get analytics data',
      data:country_data
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

exports.getTransactionData = async(req,res,next)=>{
  func.checkUserAuthentication(req,res,async (payload)=>{

  try{
    var  {firstDate,lastDate,type}= req.query;
    var getUserInfo = await getPerHourData(req.query);
    if(getUserInfo && getUserInfo.length==0){
      return res.status(200).send({
        message: "data not found",
        status: false,
      });
    }
    var transactionData = getTransactionData(getUserInfo);
    res.json({
      status:200,
      message:'get analytics data',
      data:transactionData
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

 



