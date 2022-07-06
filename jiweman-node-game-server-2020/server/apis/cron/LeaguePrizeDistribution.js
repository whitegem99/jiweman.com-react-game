var League = require('../league/league.model').League;
var common = require('../common/commonfunction');
playerLeague = require('../playerLeague/playerLeague.model').playerLeague;
const moment = require('moment-timezone');
const _ = require('lodash');
console.log("start");

async function test(){
  return new Promise((resolve,reject) => {
    setTimeout(function(){
      console.log("inside")
      resolve("hello")
    },1000)
  })
}

(async () => {
  let text = await main();
  console.log(text)
   //❤️
 })();

async function main() {
  return new Promise((resolve, reject) => {

    try {
      League.find({
        lastPrizeEvaluated: {
          $in: [null, false],
        }
      }).then(function(error,getLeagueDataFoFinalPrizeUpdate){
        console.log('inside: ' + getLeagueDataFoFinalPrizeUpdate);
        resolve(getLeagueDataFoFinalPrizeUpdate);
    
      })

    }catch (e) {
          console.log("here")
          reject(e)
    }
    
    
  });
  
  
}

// main().then(function(error,text){

//   console.log('outside: ' + text)
// })

// (async () => {
//   console.log("script")
//   try {
//     let getLeagueDataFoFinalPrizeUpdate = await League.find({
//       lastPrizeEvaluated: {
//         $in: [null, false],
//       }
//     }).exec();
//     console.log(getLeagueDataFoFinalPrizeUpdate);
//   } catch (e) {
//     console.log("here")
//   }


// })();
// console.log("end")

