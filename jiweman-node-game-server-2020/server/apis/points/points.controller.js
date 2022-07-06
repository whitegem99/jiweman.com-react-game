let func = require('../common/commonfunction');
let sendResponse = require('../common/sendresponse');
let logger = require('../../logger/log');
let Point = require('./points.model').Point;
var randomize = require('randomatic');
var fs = require('fs');
var path = require('path');

/*
 * --------------------------------------------------------------------------
 * Post points infromation API start
 * ---------------------------------------------------------------------------
 */
exports.addInformation = (req, res) => {
    console.log("inside information");

    func.checkUserAuthentication(req, res, function (payload) {
        let pointData = req.body;
        const infonObj = new Point();

        infonObj.played = pointData.played;                     //1
        infonObj.win = pointData.win                           //5
        infonObj.loss = pointData.loss                        //-0.25
        infonObj.goalFor = pointData.goalFor                 //1
        infonObj.goalAgainst = pointData.goalAgainst        //-0.5
        infonObj.cleanSheet = pointData.cleanSheet         //3
        infonObj.goalDifference = pointData.goalDifference//0

        if (infonObj) {
            infonObj.save().then((data, err) => {
                if (err) {
                    console.log(err)
                    let msg = "some error occurred"
                    sendResponse.sendErrorMessage(msg, res);
                } else {
                    res.json({
                        status: 200,
                        message: "Points information saved successfully",
                        data: data
                    })
                }
            })
        } else {
            res.json({
                status: 400,
                message: "no data found"
            })
        }
    })

}

/*
* --------------------------------------------------------------------------
* GET points infromation API start
* ---------------------------------------------------------------------------
*/
exports.information = (req, res) => {
    console.log("inside information");
    let loggedInplayerId;

    // func.checkUserAuthentication(req, res, function (payload) {

        Point.find({}).exec((err, points) => {
            if (err) {
                res.send({
                    "status": false,
                    "message": "something went wrong"
                })
            } else if (points === undefined || points.length === 0) {
                res.send({
                    "status": false,
                    "message": "No points information found"
                })

            } else if (points.length) {
                res.json({
                    status: 200,
                    message: "Points information",
                    data: [points[0]]
                })

            }
        })

    // })
}

/*
 * --------------------------------------------------------------------------
 * UPDATE points infromation API start
 * ---------------------------------------------------------------------------
 */
exports.updateInformation = (req, res) => {
    console.log("inside updateInformation");

    func.checkUserAuthentication(req, res, function (payload) {
        let infoId = req.body.infoId;
        let updatedPointData = req.body;
        var ctr = 0;
        if (infoId) {
            Point.findOneAndUpdate({
                _id: infoId
            }, updatedPointData, {
                    //upsert: true,
                    new: true,
                    useFindAndModify: false
                }, function (err, updatedPoints) {
                    ctr++;
                    if (err) {
                        let msg = "some error occurred"
                        sendResponse.sendErrorMessage(msg);
                    } else {
                        res.json({
                            status: 200,
                            message: "Points information updated successfully",
                            data: updatedPoints
                        })
                    }
                });
        } else {
            let msg = 'Send Player Id'
            sendResponse.sendErrorMessage(msg, res)
        }

    })


}