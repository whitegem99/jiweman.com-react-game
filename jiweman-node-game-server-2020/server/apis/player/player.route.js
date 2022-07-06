/*
 * --------------------------------------------------------------------------
 * Created by Barquecon Technologies on 12/03/2019 by Dipak Adsul
 * ---------------------------------------------------------------------------
 */


const express = require('express');
const router = express.Router();

const playerController = require('./player.controller');

/**
 * @swagger
 * /players:
 *   get:
 *     tags:
 *       - players
 *     security:
 *       - bearer: []
 *     description: Get Player
 *     produces:
 *       - application/json
 *     responses:
 *       description: get player api
 *       200:
 */

router.get('/players', playerController.players);



/**
 * @swagger
 * definition:
 *   login:
 *     properties:
 *       userName:
 *         type: string
 *       email:
 *         type: string
 *       countryId: 
 *          type: string
 *       socialId:
 *           type: string
 *       deviceToken:
 *            type: string
 *       gender:
 *            type: string
 *       password:
 *         type: string
 */

/**
 * @swagger
 * /players:
 *   put:
 *     tags:
 *       - players
 *     description: register user
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: login
 *         schema:
 *           type: object
 *         required:
 *           - userName
 *           - email
 *           - password
 *           - countryId
 *           - socialId
 *           - deviceToken
 *           - gender
 *           - roleId
 *           - accountType
 *           
 *         properties:
 *           userName: string
 *           email: string
 *           password: string
 *           countryId: string
 *           socialId: string
 *           deviceToken: string
 *           gender: string
 *           roleId: string
 *           accountType: string
 *  
 *     responses:
 *       200:
 *         description: Successfully created
 */
router.put('/players', playerController.editPlayer);

router.get('/getAllCountries', playerController.getAllCountries)

/**
 * @swagger
 * /playerProfile:
 *   get:
 *     tags:
 *       - playerProfile
 *     security:
 *       - bearer: []
 *     description: Get playerProfile
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: gameType
 *         schema:
 *           type: object
 * 
 *         required:
 *           - gameType
 * 
 *         properties:
 *           gameType: string
 * 
 *     responses:
 *       description: get playerProfile api
 *       200:
 *         description: Successfully displayed
 */


router.get('/playerProfile', playerController.getPlayerProfileDetails);

//router.post('/updatePlayerLeaderBoard', playerController.updatePlayerLeaderBoardData);


 /**
  * @swagger
  * definition:
  *  updateMatchResult:
  *    properties:
  *     winnerName:
  *       type: string
  *     playerOneGoal:
  *       type: string
  *     playerTwoGoal:
  *       type: string
  *     roomName:
  *       type: string
  *     playerOneUserName:
  *       type: string
  *     playerTwoUserName:
  *       type: string
  *     matchType:
  *       type: string  
  *     playerOneMatchDuration:
  *       type: number  
  *     playerTwoMatchDuration:
  *        type: number  
  *     matchDuration:
  *        type: number
  *     matchId:
  *        type: string
  *     leagueId:
  *       type: string
  */

  /**
 * @swagger
 * /updateMatchResult:
 *   post:
 *     tags:
 *       - updateMatchResult
 *     security:
 *       - bearer: []
 *     description: updateMatchResult
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         description: Pass leagueId only for league matches.
 *         name: updateMatchResult
 *         required:
 *            - winnerName
 *            - playerOneGoal
 *            - playerTwoGoal
 *            - roomName
 *            - playerOneUserName
 *            - playerTwoUserName
 *            - matchType
 *            - playerOneMatchDuration
 *            - playerTwoMatchDuration
 *            - matchDuration
 *            - matchId
 *         properites:
 *             winnerName: string
 *             playerOneGoal: string
 *             playerTwoGoal: string
 *             roomName: string
 *             playerOneUserName: string
 *             playerTwoUserName: string
 *             matchType: string
 *             playerOneMatchDuration: number
 *             playerTwoMatchDuration: number
 *             matchDuration: number
 *             matchId: string
 *             leagueId: string
 *         schema:
 *            $ref: "#/definitions/updateMatchResult"
 *     responses:
 *       200:
 *        description: Successfully created
 */



router.post('/updateMatchResult', playerController.updatePlayerLeaderBoardData);



router.get('/getPlayers',playerController.getPlayerDetails);
module.exports = router;