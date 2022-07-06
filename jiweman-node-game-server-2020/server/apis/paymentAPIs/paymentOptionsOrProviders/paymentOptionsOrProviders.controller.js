let func = require('../../common/commonfunction');
let sendResponse = require('../../common/sendresponse');
let logger = require('../../../logger/log');
var mongoose = require('mongoose');
let config = require('../../../config');
let request = require('request');
var paymentOptionsOrProviders = require('../paymentOptionsOrProviders/paymentOptionsOrProviders.model').paymentOptionsOrProviders;
let Player = require('../../playerAuth/player.model').Player;
var _ = require('lodash')
/*
 * --------------------------------------------------------------------------
 * Start of payment Options or Providers API
 * ---------------------------------------------------------------------------
 */

exports.paymentOptionsOrProviders = (req, res) => {
    console.log('inside paymentOptionsOrProviders');
    func.checkUserAuthentication(req, res,async function (payload) {
        var api_key = config.API_KEY;
        var country = config.COUNTRY_SUPPORT;
        var userData = await Player.findOne({_id:payload.sub});
        var paymentMethod = req.params.paymentMethod.toLowerCase();
      
    

        var getCountry = _.find(country,{name:userData.countryOfRecidence});

        if(_.isEmpty(getCountry)){
            return res.status(400).send({ status: false,message:"Country not found" });
        }
        let countryCode = getCountry.code.toLowerCase(); 

        
        if(_.isEmpty(paymentMethod)){
            return res.status(400).send({ status: false,message:"paymentMethod not found" });
        }
        
       
        var expire = new Promise((resolve, reject) => {
            request({
                headers: {
                    'secret-key': config.PAYMENT_SECRET_KEY
                },
                method: "GET",
                uri: `https://api.dusupay.com/v1/payment-options/collection/${paymentMethod}/${countryCode}?api_key=${api_key}`,
                gzip: true
            },
                async function(error, response, body) {
                    if(error) {
                        console.error(error);
                        return res.status(400).send({ error: error, status: false });
                    } else if(response && body) {
                        var obj = JSON.parse(body);
                        console.log(obj);
                        res.send(obj);
                    }
                }
            )

        })
    })
 }