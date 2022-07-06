'use strict';

/*
* --------------------------------------------------------------------------
* Include required modules
* ---------------------------------------------------------------------------
*/
let mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/*
* --------------------------------------------------------------------------
* Define webHooks collection
* ---------------------------------------------------------------------------
*/
var webHookSchema = new Schema({
    id: {type:Number, required:true},
    request_amount: {type:Number, required:true},
    request_currency: {type:String, required:true},
    account_amount: {type:Number, required:true},
    account_currency: {type:String, required:true},
    transaction_fee: {type:Number, required:true},
    total_credit: {type:Number, required:false},
    provider_id: {type:String, required:true},
    merchant_reference: {type:String, required:true},
    internal_reference: {type:String, required:true},
    transaction_status: {type:String, required:true},
    transaction_type: {type:String, required:true},
    customer_charged: {type:Boolean, required:false},
    message: {type:String, required:true}    
})

/*
* --------------------------------------------------------------------------
* Export the webHooks model
* ---------------------------------------------------------------------------
*/
let webHook = mongoose.model('webHook',webHookSchema);
module.exports = {
    webHook:webHook
}