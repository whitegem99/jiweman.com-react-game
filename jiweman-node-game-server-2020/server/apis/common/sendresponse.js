/*
* --------------------------------------------------------------------------
* Created by Barquecon Technologies on 12/03/2019 by Dipak Adsul
* ---------------------------------------------------------------------------
*/

const errStatus = require('./constant')

/*
* --------------------------------------------------------------------------
* Call Of SomethingWentWrongError function
* ---------------------------------------------------------------------------
*/
exports.somethingWentWrongError = function (res) {

    let errResponse = {
        status: errStatus.responseStatus.ERROR_IN_EXECUTION,
        message: errStatus.responseMessage.ERROR_IN_EXECUTION,
        data: {}
    }
    sendData(errResponse, res);
};

/*
* --------------------------------------------------------------------------
* Call Of sendSuccessData Function
* ---------------------------------------------------------------------------
*/

exports.sendSuccessData = function (data, res) {
    let successResponse = {
        status: errStatus.responseStatus.SHOW_DATA,
        message: errStatus.responseMessage.SHOW_DATA,
        data: data
    };
    sendData(successResponse, res);
};


/*
* --------------------------------------------------------------------------
* Call Of sendSuccessData Function for login
* ---------------------------------------------------------------------------
*/

exports.sendSuccesslogin = function (data,token, res) {
    let successResponse = {
        status: errStatus.responseStatus.SHOW_DATA,
        message: errStatus.responseMessage.SHOW_DATA,
        data: data,
        token:token
    };
    sendData(successResponse, res);
};


/*
* --------------------------------------------------------------------------
* Call Of sendSuccessCall Function
* ---------------------------------------------------------------------------
*/

exports.sendSuccessCall = function (data, msg, res) {
    let successResponse = {}
    if (data.length == 0) {
        successResponse = {
            status: errStatus.responseStatus.SHOW_DATA,
            message: msg
        };
    } else {
        successResponse = {
            status: errStatus.responseStatus.SHOW_DATA,
            message: msg,
            data: data
        };
    }
    sendData(successResponse, res);
};


/*
* --------------------------------------------------------------------------
* Call Of sendSuccessWithoutData Function
* ---------------------------------------------------------------------------
*/


exports.sendSuccessWithoutData = function (msg, res) {
    let successResponse = {}
    successResponse = {
        status: errStatus.responseStatus.ERROR_IN_EXECUTION,
        message: msg
    };
    sendData(successResponse, res);
};

/*
* --------------------------------------------------------------------------
* Call Of invalidAccessTokenError Function
* ---------------------------------------------------------------------------
*/

exports.invalidAccessTokenError = function (res) {
    let errResponse = {
        status: errStatus.responseStatus.INVALID_ACCESS_TOKEN,
        message: errStatus.responseMessage.INVALID_ACCESS_TOKEN,
        data: {}
    }
    sendData(errResponse, res);
};

/*
* --------------------------------------------------------------------------
* Call Of parameterMissingError Function
* ---------------------------------------------------------------------------
*/

exports.parameterMissingError = function (res) {
    let errResponse = {
        status: errStatus.responseStatus.PARAMETER_MISSING,
        message: errStatus.responseMessage.PARAMETER_MISSING,
        data: {}
    }
    sendData(errResponse, res);
};


/*
* --------------------------------------------------------------------------
* Call Of wrongCredentials Function
* ---------------------------------------------------------------------------
*/

exports.wrongCredentials = function (msg,res) {
    let errResponse = {
        status: errStatus.responseStatus.INCORRECT_DATA,
        message: errStatus.responseMessage.INCORRECT_DATA,
        data: {}
    }
    sendData(errResponse, res);
};


/*
* --------------------------------------------------------------------------
* Call Of sendErrorMessage Function
* ---------------------------------------------------------------------------
*/


exports.sendErrorMessage = function (msg, res) {
    let errResponse = {
        status: errStatus.responseStatus.SHOW_ERROR_MESSAGE,
        message: errStatus.responseMessage.SHOW_ERROR_MESSAGE,
        data: {}
    };
    sendData(errResponse, res);
};


/*
* --------------------------------------------------------------------------
* Call Of sendErrorMessage Function
* ---------------------------------------------------------------------------
*/


exports.sendDataNotFound = function (msg, data, res) {
    let errResponse;
    if(!data)
        data = ''
    if (msg === '')
   {
            errResponse  = {
                status: errStatus.responseStatus.DATA_NOT_FOUND,
                message: errStatus.responseMessage.DATA_NOT_FOUND,
                data: data
            };
    } else {
            errResponse = {
                status: errStatus.responseStatus.DATA_NOT_FOUND,
                message: msg,
                data: data
            };
    }
    sendData(errResponse, res);
};



/*
* --------------------------------------------------------------------------
* Call Of successStatusMsg Function
* ---------------------------------------------------------------------------
*/
exports.successStatusMsg = function (msg, res) {
    let successResponse = {
        status: errStatus.responseStatus.SHOW_MESSAGE,
        message: msg,
        data: {}
    };
    sendData(successResponse, res);
};


/*
* --------------------------------------------------------------------------
* Call Of sendData Function
* ---------------------------------------------------------------------------
*/
exports.sendData = function (data, res) {
    sendData(data, res);
};


function sendData(data, res) {
    res.type('json');
    res.jsonp(data);
}