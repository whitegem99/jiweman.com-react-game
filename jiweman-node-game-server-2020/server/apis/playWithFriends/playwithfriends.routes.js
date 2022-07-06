/*
 * --------------------------------------------------------------------------
 * Created by Barquecon Technologies  by Dipak Adsul
 * ---------------------------------------------------------------------------
 */

/*
 * --------------------------------------------------------------------------
 * Routes For Player Auth
 * ---------------------------------------------------------------------------
 */

const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const playerWithFriendController = require('./playwithfriends.controller');

/**
  * @swagger
  * definition:
  *  addPlayerToFriendList:
  *    properties:
  *     playerId:
  *       type: string
  */


  /**
 * @swagger
 * /PlayWithFriend/addPlayerFriendList:
 *   post:
 *     tags:
 *       - addFriend
 *     security:
 *       - bearer: []
 *     description: Add a Player to Friend List.
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: addFriend
 *         required:
 *          - playerId
 *         properites:
 *            playerId: string
 *         schema:
 *            $ref: "#/definitions/addPlayerToFriendList"
 *     responses:
 *       200:
 *        description: Successfully created
 */

// Add user to friend list
router.post('/addPlayerFriendList', playerWithFriendController.addPlayerFriendList);


/**
 * @swagger
 * /PlayWithFriend/getAllFriends:
 *   get:
 *     tags:
 *       - getAllFriend
 *     security:
 *       - bearer: []
 *     description: display friend list
 *     produces:
 *       - application/json
 *     responses:
 *       description: Get all friends api
 *       200:
 */


//get all friends 
router.get('/getAllFriends', playerWithFriendController.getAllFriends);


/**
  * @swagger
  * definition:
  *  searchPlayerInFriendList:
  *    properties:
  *     userName:
  *       type: string
  */

  /**
 * @swagger
 * /PlayWithFriend/searchAllFriends:
 *   post:
 *     tags:
 *       - searchFriend
 *     security:
 *       - bearer: []
 *     description: Search a Player in Friend List.
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: userName
 *         required:
 *          - userName
 *         properites:
 *            userName: string
 *         schema:
 *            $ref: "#/definitions/searchPlayerInFriendList"
 *     responses:
 *       200:
 *        description: Successfully created
 */

//search all friend from friend list

router.post('/searchAllFriends', playerWithFriendController.searchAllFriends);

//search all players from player list
/**
  * @swagger
  * definition:
  *  searchPlayerInPlayersList:
  *    properties:
  *     userName:
  *       type: string
  */


  /**
 * @swagger
 * /PlayWithFriend/searchAllPlayers:
 *   post:
 *     tags:
 *       - searchPlayer
 *     security:
 *       - bearer: []
 *     description: Search a Player in all players List.
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: userName
 *         required:
 *          - userName
 *         properites:
 *            userName: string
 *         schema:
 *            $ref: "#/definitions/searchPlayerInPlayersList"
 *     responses:
 *       200:
 *        description: Successfully created
 */

router.post('/searchAllPlayers', playerWithFriendController.searchAllPlayers);

/**
  * @swagger
  * definition:
  *  removePlayerFromFriendList:
  *    properties:
  *     playerId:
  *       type: string
  */

  /**
 * @swagger
 * /PlayWithFriend/deletePlayerFriendList:
 *   delete:
 *     tags:
 *       - removeFriend
 *     security:
 *       - bearer: []
 *     description: Remove a Player from Friend List.
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: playerId
 *         required:
 *          - playerId
 *         properites:
 *            playerId: string
 *         schema:
 *            $ref: "#/definitions/removePlayerFromFriendList"
 *     responses:
 *       200:
 *        description: Successfully created
 */


//remove friend from friend list
router.delete('/deletePlayerFriendList', playerWithFriendController.deletePlayerFriendList);
module.exports = router;

/**
  * @swagger
  * definition:
  *  challengeFriend:
  *    properties:
  *     playerId:
  *       type: string
  */

  /**
 * @swagger
 * /PlayWithFriend/challengeFriend:
 *   post:
 *     tags:
 *       - challengeFriend
 *     security:
 *       - bearer: []
 *     description: Send a challenge to a Player to play.
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: challengeFriend
 *         required:
 *          - playerId
 *         properites:
 *            playerId: string
 *         schema:
 *            $ref: "#/definitions/challengeFriend"
 *     responses:
 *       200:
 *        description: Successfully created
 */


//challenge friend to play
router.post('/challengeFriend', playerWithFriendController.challengeFriend);

/**
  * @swagger
  * definition:
  *  challengeStatus:
  *    properties:
  *     playerId:
  *       type: string
  *     challengeStatus:
  *       type: string
  */

/**
 * @swagger
 * /PlayWithFriend/challengeStatus:
 *   post:
 *     tags:
 *       - challengeStatus
 *     description: checking challengeStatus of friend either "accepted" or "declined"
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         required:
 *           - playerId
 *           - challengeStatus
 *         properties:
 *             playerId: string
 *             challengeStatus: string
 *         schema:
 *           $ref: "#/definitions/challengeStatus"
 *     responses:
 *       200:
 *         description: Successfully sent
 */


//challenge status
router.post('/challengeStatus', playerWithFriendController.challengeStatus);

/**
  * @swagger
  * definition:
  *  saveDeviceToken:
  *    properties:
  *     deviceToken:
  *       type: string
  */

/**
 * @swagger
 * /PlayWithFriend/saveDeviceToken:
 *   post:
 *     tags:
 *       - saveDeviceToken
 *     description: saveDeviceToken of user
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         required:
 *           - deviceToken
 *         properties:
 *             deviceToken: string
 *         schema:
 *           $ref: "#/definitions/saveDeviceToken"
 *     responses:
 *       200:
 *         description: deviceToken saved Successfully.
 */


//challenge status
router.post('/saveDeviceToken', playerWithFriendController.saveDeviceToken);

module.exports = router;