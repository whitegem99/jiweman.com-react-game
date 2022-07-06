const express = require('express');
const router = express.Router();
const oneOnOneController = require('./oneonone.controller');



router.get('/oneonone',oneOnOneController.show);
router.get('/oneononeforadmin',oneOnOneController.getGameListForAdmin);
router.post('/oneonone',oneOnOneController.create);
router.delete('/oneonone/:id',oneOnOneController.destroy);
router.put('/oneonone/:id',oneOnOneController.edit);


/**
 * @swagger
 * /getOneonOneCards:
 *   get:
 *     tags:
 *       - getOneonOneCards
 *     security:
 *       - bearer: []
 *     description: Get getOneonOneCards
 *     produces:
 *       - application/json
 *     responses:
 *       description: get getOneonOneCards api
 *       200:
 */

router.get('/getOneonOneCards',oneOnOneController.showCards);

router.get('/getOneonOneCardForPWFMode',oneOnOneController.returnCardForpwfMode);

router.get('/checkBalance/:oneonone',oneOnOneController.checkBalance);

 /**
  * @swagger
  * definition:
  *  createoneononematch:
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
  *     oneonone:
  *       type: string
  */


  /**
 * @swagger
 * /createoneononematch:
 *   post:
 *     tags:
 *       - createoneononematch
 *     security:
 *       - bearer: []
 *     description: create new 1vs1 match
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: createoneononematch
 *         description: 1. Pass isRematch value while playing oneonone rematches.   2. Pass string "oneononeBet" as value for matchType parameter.
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
 *            oneonone: string
 *         schema:
 *            $ref: "#/definitions/createoneononematch"
 *     responses:
 *       200:
 *        description: Successfully created
 */

router.post('/createoneononematch',oneOnOneController.createMatch);

 /**
  * @swagger
  * definition:
  *  updateoneononmatch:
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
  *     oneonone:
  *       type: string
  */

  /**
 * @swagger
 * /updateoneononmatch:
 *   post:
 *     tags:
 *       - updateoneononmatch
 *     security:
 *       - bearer: []
 *     description: updateoneononmatch
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         description: Pass leagueId only for league matches.
 *         name: updateoneononmatch
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
 *             oneonone: string
 *         schema:
 *            $ref: "#/definitions/updateoneononmatch"
 *     responses:
 *       200:
 *        description: Successfully created
 */


router.post('/updateoneononmatch',oneOnOneController.updateOneOnOneLeaderBoardData);


 /**
  * @swagger
  * definition:
  *  purchaseBet:
  *    properties:
  *     gameId:
  *       type: string
  *     mode:
  *       type: string
  *     amount:
  *       type: number
  */


  /**
 * @swagger
 * /purchaseBet:
 *   post:
 *     tags:
 *       - purchaseBet
 *     security:
 *       - bearer: []
 *     description: purchase a new bet
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: purchaseBet
 *         description: Pass string "wallet" as value for mode parameter.
 *         required:
 *          - gameId
 *          - mode
 *          - amount
 *         properites:
 *            gameId: string
 *            mode: string 
 *            amount: number
 *         schema:
 *            $ref: "#/definitions/purchaseBet"
 *     responses:
 *       200:
 *        description: Successfully created
 */

router.post('/purchaseBet',oneOnOneController.purchaseBet);


module.exports = router;