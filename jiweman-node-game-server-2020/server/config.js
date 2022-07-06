



/*
 * --------------------------------------------------------------------------
 * Created by Barquecon Technologies on 12/03/2019 by Dipak Adsul
 * ---------------------------------------------------------------------------
 */
'use strict';

// require('dotenv').config({ path: __dirname + '/.env' || './env.staging' });
require('dotenv').config();
// require ('custom-env').env(process.env.NODE_ENV)
module.exports = {
    MONGO_URI: process.env.MONGO_URI, //for mongodb 
    PROJECT_DIR: __dirname,
    TOKEN_SECRET: process.env.TOKEN_SECRET, //for token secret
    LOCAL_URL: process.env.LOCAL_URL, // for local url
    PORT: process.env.PORT, // for port number
    NODE_ENV: process.env.NODE_ENV, // for node env
    LOGGER: true,
    DEV_URL: process.env.DEV_URL,
    FCM_SERVER_KEY: process.env.FCM_SERVER_KEY,
    FCM_SITE_NAME: process.env.FCM_SITE_NAME,
    EMAIL_ID: process.env.EMAIL_ID,
    EMAIL_PWD: process.env.EMAIL_PWD,
    PAYMENT_SECRET_KEY: process.env.PAYMENT_SECRET_KEY,
    API_KEY:process.env.API_KEY,
    WEBHOOK_HASH: process.env.WEBHOOK_HASH,
    COUNTRY_SUPPORT: [ { code:'UG', name: 'Uganda', method:['MOBILE_MONEY','CARD','BANK'] }, { code:'KE', name: 'Kenya', method:['MOBILE_MONEY','CARD','BANK'] }, { code:'RW', name: 'Rwanda', method:['MOBILE_MONEY'] },{ code:'BI', name: 'Burundi', method:['MOBILE_MONEY'] },{ code:'GH', name: 'Ghana', method:['MOBILE_MONEY','CARD','BANK'] }, { code:'CM', name: 'Cameroon', method:['MOBILE_MONEY'] }, { code:'ZA', name: 'South Africa', method:['BANK'] }, { code:'NG', name: 'Nigeria', method:['CARD','BANK'] }, { code:'ZM', name: 'Zambia', method:['MOBILE_MONEY'] }, { code:'CI', name: 'Ivory Coast', method:['MOBILE_MONEY','BANK'] }, { code:'SN', name: 'Senegal', method:['MOBILE_MONEY'] }, { code:'TZ', name: 'Tanzania', method:['MOBILE_MONEY','BANK'] }, { code:'U.S', name: 'U.S.A', method:['CRYPTO','CARD','BANK'] }, { code:'GB', name: 'United Kingdom', method:['CRYPTO','CARD','BANK'] }, { code:'EU', name: 'Europe', method:['CRYPTO','CARD','BANK'] } ],
    BASE_URL :process.env.BASE_URL,
    WEB_URL :process.env.WEB_URL,
    REFER_EVENT:[ { "event" : "league_purchase", "amount" : 10,title:"First League Purchase" },
    { "event" : "bet_purchase", "amount" : 10,title:"First Bet Purchase" },
    { "event" : "signin", "amount" : 10,title:"Sign In" } ],
    LOG_ENV: process.env.LOG_ENV
}
