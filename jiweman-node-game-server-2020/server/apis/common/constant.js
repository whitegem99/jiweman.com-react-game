/*
* --------------------------------------------------------------------------
* Created by Barquecon Technologies on 12/03/2019 by Dipak Adsul
* ---------------------------------------------------------------------------
*/

 /*
* --------------------------------------------------------------------------
* The node-module to hold the constants for the server
* ---------------------------------------------------------------------------
*/


var multer = require('multer');

function define(obj, name, value) {
    Object.defineProperty(obj, name, {
        value:        value,
        enumerable:   true,
        writable:     false,
        configurable: false
    });
}

exports.responseStatus = {};

define(exports.responseStatus, "PARAMETER_MISSING", 100);
define(exports.responseStatus, "INVALID_ACCESS_TOKEN", 101);
define(exports.responseStatus, "ERROR_IN_EXECUTION", 102);
define(exports.responseStatus, "SHOW_ERROR_MESSAGE", 103);
define(exports.responseStatus, "SHOW_MESSAGE", 104);
define(exports.responseStatus, "SHOW_DATA", 200);
define(exports.responseStatus, "DATA_NOT_FOUND", 400);
define(exports.responseStatus, "INCORRECT_DATA", 401);


exports.responseMessage = {}; define(exports.responseMessage, "PARAMETER_MISSING", "Some Parameters Missing");
define(exports.responseMessage, "INVALID_ACCESS_TOKEN", "Invalid access.");
define(exports.responseMessage, "ERROR_IN_EXECUTION", "Some error occurred. Please try again.");
define(exports.responseMessage, "SHOW_ERROR_MESSAGE", "Some error occurred. Please try again.");
define(exports.responseMessage, "SHOW_MESSAGE", "Hi there!");
define(exports.responseMessage, "SHOW_DATA", "Data Found");
define(exports.responseMessage, "DATA_NOT_FOUND", "Data not found.")
define(exports.responseMessage, "INCORRECT_DATA", "Invalid credentials");