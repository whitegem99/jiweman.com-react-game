let func = require('../../common/commonfunction');
let sendResponse = require('../../common/sendresponse');
let logger = require('../../../logger/log');
var mongoose = require('mongoose');
let config = require('../../../config');
let request = require('request');
var bankBranches = require('../bankBranches/bankBranches.model').BankBranches;

/*
 * --------------------------------------------------------------------------
 * Start of check Balance API
 * ---------------------------------------------------------------------------
 */

exports.bankBranches = (req, res) => {
    console.log('inside bankBranches');
    func.checkUserAuthentication(req, res, function (payload) {
        var api_key = req.query.api_key;
        // var secret_key = re
        var expire = new Promise((resolve, reject) => {
            request({
                headers: {
                    'secret-key': config.PAYMENT_SECRET_KEY
                },
                method: "GET",
                uri: `https://api.dusupay.com/v1/bank/gh/branches/GH030100?api_key=${api_key}`,
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