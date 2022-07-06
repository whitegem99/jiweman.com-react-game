const express = require('express');
const router = express.Router();
const MatchController = require('./Match.controller');



 /**
  * @swagger
  * definition:
  *  createNewMatch:
  *    properties:
  *     playerOneUserName:
  *       type: string
  *     playerTwoUserName:
  *       type: string
  *     roomName:
  *       type: string
  *     isRematch:
  *       type: boolean
  *     matchType:
  *       type: string
  *     leagueId:
  *       type: string
  */


  /**
 * @swagger
 * /createNewMatch:
 *   post:
 *     tags:
 *       - createMatch
 *     security:
 *       - bearer: []
 *     description: create new match
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: createMatch
 *         description: 1. Pass isRematch value while playing oneonone rematches.   2. Pass leagueId only for league matches.
 *         required:
 *          - playerOneUserName
 *          - playerTwoUserName
 *          - roomName
 *          - isRematch 
 *          - matchType
 *         properites:
 *            playerOneUserName: string
 *            playerTwoUserName: string 
 *            roomName: string
 *            isRematch: boolean
 *            matchType: string
 *            leagueId: string
 *         schema:
 *            $ref: "#/definitions/createNewMatch"
 *     responses:
 *       200:
 *        description: Successfully created
 */




router.post('/createNewMatch', MatchController.createNewMatch);

//router.post('/updateMatchResult', MatchController.updateMatchResults);

router.post('/getLastPlayedMatchDetails', MatchController.getLastPlayedMatchDetails);

router.get('/getAllUnfinishedMatches', MatchController.listAllUnfinishedMatches);

router.get('/getMatchDetails', MatchController.getMatchDetails);

router.post('/updateOneOnOneResultManually', MatchController.updateOneOnOneResultManually);

module.exports = router;


