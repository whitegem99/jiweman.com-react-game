/*
 * --------------------------------------------------------------------------
 * Created by Barquecon Technologies on 12/03/2019 by Dipak Adsul
 * ---------------------------------------------------------------------------
 */

/*
 |--------------------------------------------------------------------------
 | Debug and Log all Data to log files
 |--------------------------------------------------------------------------
 */

var config = require('../config');
var fs = require('fs');
var dir = './log';

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

let winston = require('winston');
winston.transports.DailyRotateFile = require('winston-daily-rotate-file');

let winstonLogger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    //new (winston.transports.Console)({ json: true, timestamp: true }),
    //new winston.transports.File({ filename: __dirname + '/debug.log', json: true }),
    new (require('winston-daily-rotate-file'))({
      filename: config.PROJECT_DIR + '/log/request.log',
      json: true,
      timestamp: true,
    }),
  ],
  exceptionHandlers: [
    new winston.transports.Console({
      json: true,
      timestamp: true,
      handleExceptions: true,
    }),
    new (require('winston-daily-rotate-file'))({
      filename: __dirname + '../../log/exceptions.log',
      json: true,
      timestamp: true,
    }),
  ],
  exitOnError: false,
});

module.exports = winstonLogger;
