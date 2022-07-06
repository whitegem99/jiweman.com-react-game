/*
 * --------------------------------------------------------------------------
 * Created by Barquecon Technologies by Dipak Adsul
 * ---------------------------------------------------------------------------
 */
let func = require("../common/commonfunction");
let sendResponse = require("../common/sendresponse");
let logger = require("../../logger/log");
//let Player = require('./player.model').Player;
//let Role = require('./player.model').Role;
var randomize = require("randomatic");
let Friends = require("./playwithfriends.model").Friends;
let Challenge = require("./playwithfriends.model").Challenge;
let Player = require("../playerAuth/player.model").Player;
// let UserDevice = require('../pushNotification/push.model').UserDevice;
let config = require("../../config");
var FCM = require("fcm-node");
var fcm = new FCM(config.FCM_SERVER_KEY);
var ArraySubtract = require('array-subtract');
var _ = require('underscore');

/*
 * --------------------------------------------------------------------------
 * Add users to friend list Api start
 * ---------------------------------------------------------------------------
 */
exports.addPlayerFriendList = function(req, res, next) {
  let requestBody = req.body;
  let loggedInplayerId;

  if (!requestBody) {
    return res.status(400).send({ message: "Bad Request", status: false });
  } else {
    func.checkUserAuthentication(req, res, function(payload) {
      playerId = requestBody.playerId;
      loggedInplayerId = payload.sub.toObjectId();

      if (playerId == loggedInplayerId) {
        return res.status(400).send({
          message: "Adding yourself in your friend list is not allowed",
          status: false
        });
      } else {
        Player.findOne({ _id: loggedInplayerId }, function(
          err,
          LoggedInPlayerData
        ) {
          if (err) {
            return res
              .status(400)
              .send({ message: "No such Player exist", status: false });
          } else {
            let loggedInPlayerName = LoggedInPlayerData.userName;

            Player.findOne({ _id: playerId }, function(err, friendData) {
              // console.log('frnddata',friendData);
              if (
                friendData == null ||
                friendData == undefined ||
                !friendData
              ) {
                return res
                  .status(404)
                  .send({ message: "No such Player exist", status: false });
              } else if (err) {
                return res
                  .status(400)
                  .send({ message: "No such Player exist", status: false });
              } else {
                const friends = new Friends();
                (friends.FriendUserName = friendData.userName),
                  (friends.loggedInUserName = loggedInPlayerName),
                  (friends.email = friendData.email),
                  (friends.socialId = friendData.socialId),
                  (friends.userId = friendData._id),
                  (friends.deviceToken = friendData.deviceToken),
                  (friends.gender = friendData.gender),
                  (friends.roleId = friendData.roleId);
                friends.accountType = friendData.accountType;

                Friends.findOne(
                  {
                    FriendUserName: friendData.userName,
                    loggedInUserName: loggedInPlayerName
                  },
                  function(err, data) {
                    if (err) {
                      return res
                        .status(400)
                        .send({ message: "Bad Request", status: false });
                    } else if (data != null) {
                      return res.status(200).send({
                        message: "Player already added to friendlist",
                        status: false
                      });
                    } else {
                      friends.save().then(function(data, err) {
                        console.log(data);
                        if (err) {
                          return res
                            .status(400)
                            .send({ message: "Bad Request", status: false });
                        } else {
                          return res.status(200).send({
                            message: "Data Saved",
                            status: true,
                            data
                          });
                        }
                      });
                    }
                  }
                );
              }
            });
          }
        });
      }
    });
  }
};

/*
 * --------------------------------------------------------------------------
 * get all users from friend list  Api start
 * ---------------------------------------------------------------------------
 */

exports.getAllFriends = function(req, res, next) {
  console.log("inside getAllFriends");

  let loggedInplayerId;

  func.checkUserAuthentication(req, res, function(payload) {
    loggedInplayerId = payload.sub.toObjectId();
    Player.findOne({ _id: loggedInplayerId }, function(
      err,
      LoggedInPlayerData
    ) {
      if (err) {
        return res
          .status(400)
          .send({ message: "No such Player exist", status: false });
      } else {
          var loggedInPlayerName = LoggedInPlayerData.userName
          Friends.find({ loggedInUserName: loggedInPlayerName }, {email: 0, deviceToken: 0},function(err, result) {
            if (err) {
              let msg = "";
              sendResponse.sendErrorMessage(msg, res);
            } else if (result.length > 0) {
              console.log(result);
              // sendResponse.sendSuccessData(result, res);
              return res.status(200).send({
                message: "Data found",
                status: true,
                data: result
              });
            } else if (result.length === 0) {
              return res
                          .status(400)
                          .send({ message: "your friendlist is empty", status: false });  
            }
          });
      }
    });
  });
};

/*
 * --------------------------------------------------------------------------
 * search friend from friend list Api start
 * ---------------------------------------------------------------------------
 */

exports.searchAllFriends = function(req, res, next) {
  console.log("searchAllFriends");
  let requestBody = req.body;
  let loggedInplayerId;

  if (!requestBody) {
    return res.status(400).send({ message: "Bad Request", status: false });
  } else {
    let userName = requestBody.userName;
    func.checkUserAuthentication(req, res, function(payload) {
      loggedInplayerId = payload.sub.toObjectId();

      Player.findOne({ _id: loggedInplayerId }, function(
        err,
        LoggedInPlayerData
      ) {
        if (err) {
          return res
            .status(400)
            .send({ message: "No such Player exist", status: false });
        } else {
          if (!userName) {
            res.send({
              status: 400,
              message: "please enter friend username"
            });
          } else if (userName) {
            pName = userName;
            var loggedInPlayerName = LoggedInPlayerData.userName;
            console.log('loggedInPlayerName',loggedInPlayerName);
            Friends.find(
              { FriendUserName: { $regex: new RegExp(pName, "i") }, loggedInUserName: loggedInPlayerName },
              function(err, result) {
                // console.log('result',result);
                if (err) {
                  let msg = "";
                  sendResponse.sendErrorMessage(msg, res);
                } else if (result.length > 0) {
                  // sendResponse.sendSuccessData(result, res);
                  return res.status(200).send({
                    message: "Data found",
                    status: true,
                    data: result
                  });
                } else if (!result.length) {
                  return res
                          .status(400)
                          .send({ message: "No player found for your search criteria", status: false });
                  // let msg = "";
                  // sendResponse.sendDataNotFound(msg, res);
                }
              }
            );
          }
        }
      });
    });
  }
};

/*
 * --------------------------------------------------------------------------
 * search player from player list Api start
 * ---------------------------------------------------------------------------
 */

exports.searchAllPlayers = function (req, res, next) {
  let requestBody = req.body;
  let loggedInplayerId;
  let userName = requestBody.userName;
  var namesC = [];
  
  if (!requestBody) {
      return res.status(400).send({ message: "Bad Request", status: false });
  } else {
      // console.log('in else part..')
      func.checkUserAuthentication(req, res, async function (payload) {
          //playerId = requestBody.playerId;
          loggedInplayerId = payload.sub.toObjectId();
          Player.findOne({ _id: loggedInplayerId }, async function (err, LoggedInPlayerData) {
              if (err) {
                  return res
                      .status(400)
                      .send({ message: "No such Player exist", status: false });
              } else {
                  let loggedInPlayerName = LoggedInPlayerData.userName;
                  if (userName) {
                          Friends.find({ loggedInUserName: loggedInPlayerName }, function (err, result) {
                              Player.find({ userName: { $regex: new RegExp(userName, "i") }}, function (err, result1) {
                                var subtract = new ArraySubtract((itemA, itemB) => { return itemA.userName === itemB.FriendUserName });
                                namesC = subtract.sub(result1, result);
                                namesC = namesC.filter(function( obj ) {
                                    return obj._id.toString() != LoggedInPlayerData._id.toString();
                                });
                                if(namesC.length) {
                                  res.status(200).send({
                                     message: "Players found",
                                    status: true,
                                    data: namesC
                                })
                                } else if(!namesC.length) {
                                  res.status(400).send({
                                    message: "Player is already added or no player found for your search criteria",
                                    status: 400
                                })
                                }
                              })
                          })   
                  } else {
                    res.status(400).send({
                      message: "Please enter userName",
                      status: 400
                  })
                  }

              }
          })

      })
  }
}

/*
 * ---------------------------------------------------------------------------
 * Delete users from friend list Api start
 * ---------------------------------------------------------------------------
 */
exports.deletePlayerFriendList = function(req, res, next) {
  let requestBody = req.query;
  let loggedInplayerId;

  if (!requestBody) {
    return res.status(400).send({ message: "Bad Request", status: false });
  } else {
    func.checkUserAuthentication(req, res, function(payload) {
      playerId = requestBody.playerId;

      loggedInplayerId = payload.sub.toObjectId();
      Player.findOne({ _id: loggedInplayerId }, function(
        err,
        LoggedInPlayerData
      ) {
        if (err) {
          return res
            .status(400)
            .send({ message: "No such Player exist", status: false });
        } else {
          let loggedInPlayerName = LoggedInPlayerData.userName;

          Player.findOne({ _id: playerId }, function(err, friendData) {
            if (err) {
              return res
                .status(400)
                .send({ message: "No such Player exist", status: false });
            } else if (friendData == null) {
              return res.status(404).send({
                message: "Player not exist in Player coll",
                status: false
              });
            } else {
              var userName = friendData.userName;
              Friends.find({
                FriendUserName: userName
              }).remove(function(err, data) {
                if (err) {
                  return res.status(404).send({
                    message: "Player not exist in friendlist",
                    status: false
                  });
                } else if (data.deletedCount == 0) {
                  return res.status(200).send({
                    message:
                      "Can not delete player as it is not present in your friend List",
                    status: true
                  });
                } else {
                  return res.status(200).send({
                    message: "Player removed from friendlist",
                    status: true
                  });
                }
              });
            }
          });
        }
      });
    });
  }
};

/*
 * ---------------------------------------------------------------------------
 * Challenge friends to play API start
 * ---------------------------------------------------------------------------
 */
exports.challengeFriend = function(req, res, next) {
  let requestBody = req.body;
  let loggedInplayerId;

  if (!requestBody) {
    return res.status(400).send({ message: "Bad Request", status: false });
  } else {
    func.checkUserAuthentication(req, res, function(payload) {
      playerId = requestBody.playerId;

      loggedInplayerId = payload.sub.toObjectId();
      Player.findOne({ _id: loggedInplayerId }, function(
        err,
        LoggedInPlayerData
      ) {
        if (err) {
          return res
            .status(400)
            .send({ message: "No such Player exist", status: false });
        } else {
          let loggedInPlayerName = LoggedInPlayerData.userName;

          Player.findOne({ _id: playerId }, function(err, friendData) {
            if (err) {
              return res
                .status(400)
                .send({ message: "No such Player exist", status: false });
            } else if (friendData == null) {
              return res.status(404).send({
                message: "Player not exist in Player collection",
                status: false
              });
            } else {
              var userName = friendData.userName;
              var userId = friendData._id;
              var deviceId = friendData.deviceToken;

              if (!deviceId) {
                return res.status(400).send({
                  message: "Sorry!! Challenge Notification not sent",
                  status: false
                });
              } else {
                var data = {};
                data.userName = LoggedInPlayerData.userName;
                data.userId = LoggedInPlayerData._id;
                data.message = "challenge";
                var message = "Hey! Here is new challenge for you";
                var title = "Joga-Bonito Challenge";
                var message = {
                  to: deviceId,
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
                    res.status(400).send({
                      message: "Challenge Notification not sent",
                      status: false
                    });
                  } else {
                    let challenge = new Challenge();
                    challenge.challengerUserName = loggedInPlayerName;
                    challenge.challengingUserName = userName;
                    challenge.challengeStatus = "pending";
                    challenge.save().then(function(data, err) {
                      console.log(
                        "Successfully sent with response: ",
                        response
                      );
                      res.status(200).send({
                        message: "Challenge Notification sent",
                        status: true
                      });
                    });
                  }
                });
              }
            }
          });
        }
      });
    });
  }
};

exports.challengeStatus = function(req, res, next) {
  let requestBody = req.body;
  let loggedInplayerId;

  if (!requestBody) {
    return res.status(400).send({ message: "Bad Request", status: false });
  } else {
    func.checkUserAuthentication(req, res, function(payload) {
      playerId = requestBody.playerId;
      loggedInplayerId = payload.sub.toObjectId();
      Player.findOne({ _id: loggedInplayerId }, function(
        err,
        LoggedInPlayerData
      ) {
        if (err) {
          return res
            .status(400)
            .send({ message: "No such Player exist", status: false });
        } else {
          let loggedInPlayerName = LoggedInPlayerData.userName;
          Player.findOne({ _id: playerId }, function(err, playerData) {
            if (err) {
              return res
                .status(400)
                .send({ message: "No such Player exist", status: false });
            } else if (playerData == null) {
              return res.status(404).send({
                message: "Player not exist in Player collection",
                status: false
              });
            } else {
              var userName = playerData.userName;
              var deviceToken = playerData.deviceToken;
              if (!deviceToken) {
                return res.status(400).send({
                  message: "Sorry!! Challenge Notification not sent",
                  status: false
                });
              } else {
                //var challengeStatus = req.body.challengeStatus;
                var data = {};
                data.userName = LoggedInPlayerData.userName;
                data.userId = LoggedInPlayerData._id;
                data.message = requestBody.challengeStatus;
                if (requestBody.challengeStatus == "accepted") {
                  var message = "Challenge Accepted";
                  var title = "Joga-Bonito Challenge";
                  var message = {
                    to: deviceToken,
                    notification: {
                      title: title, //title of notification
                      body: message, //content of the notification
                      sound: "default",
                      icon: "ic_launcher" //default notification icon
                    },
                    data: data //payload you want to send with your notification
                  };
                } else if (requestBody.challengeStatus == "declined") {
                  var message = "Challenge declined";
                  var title = "Joga-Bonito Challenge";
                  var message = {
                    to: deviceToken,
                    notification: {
                      title: title, //title of notification
                      body: message, //content of the notification
                      sound: "default",
                      icon: "ic_launcher" //default notification icon
                    },
                    data: data //payload you want to send with your notification
                  };
                } else if (
                  requestBody.challengeStatus == "acceptedByChallenger"
                ) {
                  var message = "Ready To Play";
                  var title = "Joga-Bonito Challenge";
                  var message = {
                    to: deviceToken,
                    notification: {
                      title: title, //title of notification
                      body: message, //content of the notification
                      sound: "default",
                      icon: "ic_launcher" //default notification icon
                    },
                    data: data //payload you want to send with your notification
                  };
                }

                fcm.send(message, function(err, response) {
                  if (err) {
                    console.log("playerId", playerId);
                    console.log(err);
                    console.log("Notification not sent");
                    res.status(400).send({
                      message: "Challenge Notification not sent",
                      status: false
                    });
                  } else {
                    console.log("Successfully sent with response: ", response);
                    res.status(200).send({
                      message: "Challenge Notification sent",
                      status: true
                    });
                  }
                });
              }
            }
          });
        }
      });
    });
  }
};

/*
 * ---------------------------------------------------------------------------
 * Save Device token API start
 * ---------------------------------------------------------------------------
 */
exports.saveDeviceToken = async function(req, res) {
  func.checkUserAuthentication(req, res, function(payload) {
    let userId = payload.sub.toObjectId();
    let deviceData = req.body;
    let searchData = {
      _id: userId
    };

    let updateData = {
      deviceToken: deviceData.deviceToken
    };

    Player.findOneAndUpdate(
      searchData,
      updateData,
      { upsert: true, new: true },
      function(err, data) {
        if (err) {
          return res.status(400).send({ err: err, status: false });
        }
        res.status(200).send({
          message: "Device token updated successfully!",
          status: true,
          data: data
        });
      }
    );
  });
};

/*
 * ---------------------------------------------------------------------------
 * playWithFriendsMatchMaking API start
 * ---------------------------------------------------------------------------
 */

exports.playWithFriendsMatchMaking = async function(player, waitingPlayer) {
  let userName = player.username;
  let waitingPlayerUserName = waitingPlayer.username;
  let challengeResult = {};
  return new Promise(async (resolve, reject) => {
    challengeResult = await Challenge.findOne({
      challengerUserName: userName,
      challengingUserName: waitingPlayerUserName
    }).exec();

    if (challengeResult) {
      resolve(challengeResult);
    } else {
      challengeResult = await Challenge.findOne({
        challengerUserName: waitingPlayerUserName,
        challengingUserName: userName
      }).exec();
      resolve(challengeResult);
    }
  });
};

exports.removeFromTempPlayWithFriends = async function(player, waitingPlayer) {
  let userName = player.userName;
  let waitingPlayerUserName = waitingPlayer.userName;
  let challengeResult = {};
  return new Promise(async (resolve, reject) => {
    challengeResult = await Challenge.findOneAndDelete({
      challengerUserName: userName,
      challengingUserName: waitingPlayerUserName
    }).exec();

    if (challengeResult) {
      resolve(challengeResult);
    } else {
      challengeResult = await Challenge.findOneAndDelete({
        challengerUserName: waitingPlayerUserName,
        challengingUserName: userName
      }).exec();
      resolve(challengeResult);
    }
  });
};
