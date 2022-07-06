let sendResponse = require('../common/sendresponse');
let logger = require('../../logger/log');
let Match = require('../matchPlay/matchplay.model').Match;
let ConnectionState = require('./connectionStates.model').ConnectionState;
let func = require('../common/commonfunction');
const async_lib = require('async');
const _ = require('lodash')


/*
 * ---------------------------------------------------------------------------
 * ConnectionState API start
 * ---------------------------------------------------------------------------
 */

exports.saveConnectionState = async (req, res) => {
    console.log('inside getConnectionState');

    func.checkUserAuthentication(req, res, async function (payload) {
        let connectionStateData = req.body;

        if (_.isEmpty(connectionStateData)) {
            return res.status(400).send({ message: "Bad Request", status: false });

        } else {
            try {
                    let newConnectionState = new ConnectionState(connectionStateData);

                    newConnectionState.save(async (err, result) => {

                        if (err) {
                            return res.status(200).send({ "message": "something went wrong", status: false })
                        } else {

                            res.json({
                                status: true,
                                message: "Game is running/Waiting player to reconnect",
                                data: { timestamp: Date.parse(result.updatedAt) }
                            })
                        }
                    })
            } catch (error) {
                console.log(error);
                return res.status(400).send({ "message": "something went wrong", status: false })
            }
        }
    })

}