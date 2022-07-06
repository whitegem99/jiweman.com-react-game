/*
* --------------------------------------------------------------------------
* Created by Barquecon Technologies on 12/03/2019 by Dipak Adsul
* ---------------------------------------------------------------------------
*/
let func = require('../common/commonfunction');
let sendResponse = require('../common/sendresponse');
let PlayerGameData = require('../playerAuth/player.model').PlayerGameData;


 /*
* --------------------------------------------------------------------------
* Select team captain
* ---------------------------------------------------------------------------
*/

exports.assignCaptain = function (req, res) {
    let requestBody = req.body;
    let loggedInplayerId;
    let updatedPlayerGameData = req.body;




    func.checkUserAuthentication(req, res, function (payload) {
        loggedInplayerId = payload.sub.toObjectId();
            PlayerGameData.findOne(
                {
                    playerId: loggedInplayerId}
                ).lean().exec(function(err, data){
                    let retriveddata = data;
                    console.log(retriveddata)
                    data.disks.forEach(element => {
                        if( element.diskName == req.body.diskName){
                            element.isCaptain = true;
                        } else {
                            element.isCaptain = false;
                        }
                    });
                    delete retriveddata._id;
                PlayerGameData.findOneAndUpdate({
                    playerId: loggedInplayerId
                }, retriveddata ,{new:true}, function (err, result) {
                        if (err) {
                        let msg = "some error occurred"
                        sendResponse.sendErrorMessage(msg);
                        } else {

                            sendResponse.sendSuccessData(result, res);
                        }
                    });
            });
    });

}