let func = require('../../common/commonfunction');
let sendResponse = require('../../common/sendresponse');
let logger = require('../../../logger/log');
var mongoose = require('mongoose');
let config = require('../../../config');
let request = require('request');
var Payout = require('../payout/payout.model').Payout;
var webHook = require('./webHooks.model').webHook;

/*
 * --------------------------------------------------------------------------
 * Start of webHooks API
 * ---------------------------------------------------------------------------
 */
exports.webHooks = (req, res) => {
  console.log('inside webHooks');
  var webhookHash = req.headers.webhookhash;
  console.log(webhookHash);
  // func.checkUserAuthentication(req, res, function (payload) {
  var requestData = req.body;


  // console.log('transaction_status',requestData.transaction_status);
  if (webhookHash == config.WEBHOOK_HASH) {
  var webHooks = new webHook();

  webHooks.id = requestData.id;
  webHooks.request_amount = requestData.request_amount;
  webHooks.request_currency = requestData.request_currency;
  webHooks.account_amount = requestData.account_amount;
  webHooks.account_currency = requestData.account_currency;
  webHooks.transaction_fee = requestData.transaction_fee;
  webHooks.total_credit = requestData.total_credit;
  webHooks.provider_id = requestData.provider_id;
  webHooks.merchant_reference = requestData.merchant_reference;
  webHooks.internal_reference = requestData.internal_reference;
  webHooks.transaction_status = requestData.transaction_status;
  webHooks.transaction_type = requestData.transaction_type;
  webHooks.customer_charged = requestData.customer_charged;
  webHooks.message = requestData.message;

  if (webHooks) {
    webHooks.save().then(function (data, err) {
      if (err) {
        console.log(err);
        let msg = "some error occurred";
        sendResponse.sendErrorMessage(msg, res);
      } else {
        res.json({
          "code": 200,
          "status": "Ok",
          "data": requestData
        })
      }
    })
  } 
} else {
        res.json({
          "code": 401,
          "status": "Unauthorised"
      })
  }
}
