let func = require('../../common/commonfunction');
let sendResponse = require('../../common/sendresponse');
let logger = require('../../../logger/log');
var mongoose = require('mongoose');
let config = require('../../../config');
let request = require('request');
var CheckBalance = require('../checkBalance/checkBalance.model').CheckBalance;

/*
 * --------------------------------------------------------------------------
 * Start of check Balance API
 * ---------------------------------------------------------------------------
 */

exports.CheckBalance = (req, res) => {
    console.log('inside CheckBalance');
    func.checkUserAuthentication(req, res, function (payload) {
        var api_key = req.query.api_key;
        // var secret_key = re
        var expire = new Promise((resolve, reject) => {
            request({
                headers: {
                    'secret-key': config.PAYMENT_SECRET_KEY
                },
                method: "GET",
                uri: `https://api.dusupay.com/v1/merchants/balance/?api_key=${api_key}`,
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

/*
 * --------------------------------------------------------------------------
 * Start of check Collections(Deposit) API
 * ---------------------------------------------------------------------------
 */

 exports.collections = (req, res) => {
    console.log('inside collections');
    func.checkUserAuthentication(req, res, function (payload) {
        var api_key = req.query.api_key;
        var expire = new Promise((resolve, reject) => {
            request({
                headers: {
                    'secret-key': config.PAYMENT_SECRET_KEY
                },
                method: "GET",
                uri: `https://api.dusupay.com/v1/collections/?api_key=${api_key}`,
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
