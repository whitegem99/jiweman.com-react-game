/*
 * --------------------------------------------------------------------------
 * Created by Barquecon Technologies on 12/03/2019 by Dipak Adsul
 * ---------------------------------------------------------------------------
 */
let func = require('../common/commonfunction');
let sendResponse = require('../common/sendresponse');
let logger = require('../../logger/log');
let UserDevice = require('./push.model').UserDevice;
let config = require('../../config');
var FCM = require('fcm-node')
var fcm = new FCM(config.FCM_SERVER_KEY);






/*
 * --------------------------------------------------------------------------
 * Save device token API Api start
 * ---------------------------------------------------------------------------
 */

exports.saveDeviceIdPushNotification = async function(req, res) {
    func.checkUserAuthentication(req, res, function(payload) {
        let userId = payload.sub.toObjectId();
        let deviceData = req.body;
        let searchData = {
            userId: userId,
            deviceType: deviceData.deviceType,
        }

        let updateData = {
            userId: userId,
            deviceId: deviceData.deviceId,
            deviceType: deviceData.deviceType,
        }

        UserDevice.findOneAndUpdate(searchData, updateData, { upsert: true, new: true }, function(err, data) {
            if (err) {
                return res.status(400).send({ err: err, status: false });
            }
            res.status(200).send({
                message: "Device token saved successfully!",
                status: true,
                data: data
            });
        })
    });
}

/*
 * --------------------------------------------------------------------------
 * Push Notification API 
 * ---------------------------------------------------------------------------
 */

function sendPushNotification(otherUserId, userId) {
    console.log('sendPushNotification');
    let message = {
        notification: {},
        data: {}
    };
    // message.collapse_key = config.FCM_SITE_NAME;

    var data = {};
    data.collapse_key = config.FCM_SITE_NAME;
    data.to = '';
    fcm.send(data, function(err, response) {
        if (err) {
            console.log(err)
            console.log("Something has gone wrong!");
        } else {
            console.log("Successfully sent with response: ", response);
        }
    });
    // UserDevice.findOne({ userId: otherUserId }, function(err, deviceData) {
    //     if (err) {
    //         console.error(err);
    //     } else {
    //         console.log(deviceData);
    //         if (deviceData) {
    //             // message.to = deviceData.deviceId;
    //             // data.to = deviceData.deviceId;
    //             data.to = 'f5mGH254CWc:APA91bHWyoOGZb2Rezd5RjbN4GnF72sAM72r5ZmfxBshzQmxy6IS7PRNad7MGmCHGuo3XK0cKf29F-aeWaM6zZs67cJuteIcgY5fKoI_3_xoZUGk-k968XiVrAGaBGkFrLRyH-xBUZnN';
    //             UserDevice.findOne({ _id: userId }, function(err, userDetails) {
    //                 if (err) {
    //                     return console.error(err);
    //                 } else {
    //                     data['sender_id'] = userDetails._id;
    //                     fcm.send(data, function(err, response) {
    //                         if (err) {
    //                             console.log("Something has gone wrong!");
    //                         } else {
    //                             console.log("Successfully sent with response: ", response);
    //                         }
    //                     });
    //                 }
    //             });
    //         }
    //     }
    // });
}




/*
 * --------------------------------------------------------------------------
 * Send msg API 
 * ---------------------------------------------------------------------------
 */

exports.sendPushNotificationMsg = function(req, res) {
    //var userId = payload.sub.toObjectId();
    var userId = 'abcd'
        // var messageData = req.body;
        // var newMessage = new message();
        // newMessage.toUserId = messageData.toUserId;
        // newMessage.fromUserId = userId;
        // newMessage.message = messageData.message;
        // newMessage.attachment = {
        //     attached: false
        // }
        // newMessage.readByReceiver = false;
    sendMessageToUser('ft6d1QIqXIE:APA91bEdkaByXG1NWLdSoBFPgQ3deZZeh3cAfJEvWoczR7AY_RmlNPJD_qnwJbTwHZDyiFwh_YYu3XNHNdsoR3b1nkwajfFf68UNigCYgB_IPQLOk2nOWePcaIBxCAGgK1uClLf5hrhE', { message: 'hello' });
    // sendPushNotification('abcd', 'defg', 'message');
    // newMessage.save(function (err, data) {
    //     if (err) {
    //         logger.error(err);
    //         res.status(400).send({ err: err, status: false });
    //     }
    //     else {
    //         notificationManagementCntr.sendPushNotification(messageData.toUserId,userId, 'message');
    //         res.status(200).send({ message: "Message sent successfully..", status: true });
    //     }
    // });





}


/*
 * --------------------------------------------------------------------------
 * Push Notification API 
 * ---------------------------------------------------------------------------
 */

exports.sendFcmNotification = function(req, res) {

    var data = req.body;
    var message = "Hey! Here is new challenge for you";
    var title = "Joga-Bonito Challenge";
    //var token = "AAAAZ6tUhHM:APA91bEHbANPhM6JDOmwUSFhbs231uM2ukiBV3wfg4ox6s2qydASPEjMy5PjZpMyt4jRchEP_Pkd_JDWmorZgCniPt5l5pio3ESblrDMcFt5f-GzdzF1M7YtlexIV9tnlYaBbTYhZCwR";
    // var recepient = "f5mGH254CWc:APA91bHWyoOGZb2Rezd5RjbN4GnF72sAM72r5ZmfxBshzQmxy6IS7PRNad7MGmCHGuo3XK0cKf29F-aeWaM6zZs67cJuteIcgY5fKoI_3_xoZUGk-k968XiVrAGaBGkFrLRyH-xBUZnN";
    var recepient  = "ffaLdZvf4Ko:APA91bGf9vtzWLA9Hk5Zl3zDEGsJlMqMFCZhR55vSUACTcjxiWU_2l2RinUmRFflFm-TjwjqZjq-0KKlw5uJQrD4nIKsOo3mxb5mn_APEjq1lRqGsiBDj1BTuRxuHSa1s1CgDYuSStSD"
    var message = {
        to: recepient,
        notification: {
            title: title, //title of notification 
            body: message, //content of the notification
            sound: "default",
            icon: "ic_launcher" //default notification icon
        },
        data: data //payload you want to send with your notification
    };
    fcm.send(message, function(err, response) {
        if (err) {
            console.log(err);
            console.log("Notification not sent");
            res.json({ success: false })
        } else {
            console.log("Successfully sent with response: ", response);
            res.json({ success: true })
        }
    });

};


/*
 * --------------------------------------------------------------------------
 * Push Notification API 
 * ---------------------------------------------------------------------------
 */

 exports.sendFcmNotificationMsg = (req, res) =>{
     console.log('inside sendFcmNotificationMsg');

    // var serverKey = "AAAAMozg5hs:APA91bHV5XL3uy5wuugf-ish33LUvOazNPgsSEHX6ovrEiDdxpAib6YPV-2hganbgD_3-p1rolh2qPZwpuKQBfN0kxbjkakMiPMtUKIikjy64nZsxrMSCCHHHMW44RjYq_32-Vksxe7E";
   // var fcm = new FCM(serverKey);

    var data = req.body;
    var msg = "Hey! Here is new challenge for you";
    var title = "Joga-Bonito Challenge";
    //var recepient = "f5mGH254CWc:APA91bHWyoOGZb2Rezd5RjbN4GnF72sAM72r5ZmfxBshzQmxy6IS7PRNad7MGmCHGuo3XK0cKf29F-aeWaM6zZs67cJuteIcgY5fKoI_3_xoZUGk-k968XiVrAGaBGkFrLRyH-xBUZnN";
      var recepient = "ds7KJvqdDqQ:APA91bGx2QQ18lwXQPjIM3jHofP81gbtQsBg6OT7mCj_LIs21ukedAvsWNz9eNzeM1mctxciki0FFMo8yImrsutTuR2p_LyJQSOeGUrGTSg20iDDS0gZsrvC_bvK0esz649M1zCiIEFO";

    var message = {
        to: recepient,
        notification: {
            title: title, //title of notification 
            body: msg, //content of the notification
            sound: "default",
            icon: "ic_launcher" //default notification icon
        },
        data: data //payload you want to send with your notification
    };

    fcm.send(message, function(err, response) {
        if (err) {
            console.log(err);
            console.log("Something went wrong");
            res.json({ success: false })
        } else {
            console.log("Successfully sent with response: ", response);
            res.json({ success: true })
        }
    });

 }