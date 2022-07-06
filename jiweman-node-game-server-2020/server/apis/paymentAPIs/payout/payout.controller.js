let func = require('../../common/commonfunction');
let sendResponse = require('../../common/sendresponse');
let logger = require('../../../logger/log');
var mongoose = require('mongoose');
let config = require('../../../config');
let request = require('request');
var Payouts = require('../payout/payout.model').Payouts;

/*
 * --------------------------------------------------------------------------
 * Start of check Collection API
 * ---------------------------------------------------------------------------
 */

 exports.payouts = (req, res) => {
    console.log('inside collections');
    func.checkUserAuthentication(req, res, function (payload) {
        var requestData = req.body;
        var expire = new Promise((resolve, reject) => {
            request({
                headers: {
                    'secret-key': config.PAYMENT_SECRET_KEY
                },
                method: "POST",
                uri: `https://api.dusupay.com/v1/payouts`,
                json:requestData,
                gzip: true
            },
                async function(error, response, body) {
                    if(error) {
                        console.error(error);
                        return res.status(400).send({ error: error, status: false });
                    } else if(response && body) {
                        // var obj = JSON.parse(body);
                        // console.log(obj);
                        res.send(body);
                    }
                }
            )
        })
    })
 }