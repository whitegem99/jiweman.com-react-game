const express = require('express');
const router = express.Router();
const leaderBoardController = require('./leaderboard.controller');


 /**
  * @swagger
  * definition:
  *  leaderboard:
  *    properties:
  *     gameType:
  *       type: string
  *     leagueId:
  *       type: string
  */


/**
 * @swagger
 * /leaderboard:
 *   get:
 *     tags:
 *       - leaderboard
 *     security:
 *       - bearer: []
 *     description: Get leaderboard data
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: gameType
 *         required: true
 *         type: string
 *       - in: query
 *         name: leagueId
 *         required: false
 *         type: string
 *         description: Pass leagueId only while displaying league leader board 
 *         schema:
 *            $ref: "#/definitions/leaderboard"
 *     responses:
 *       description: get leaderboard api
 *       200:
 */
router.get('/leaderboard', leaderBoardController.leaderboard);

router.post('/updatePrizeStatus', leaderBoardController.updatePrizeStatus);

router.get('/winHistory', leaderBoardController.winHistory);


module.exports = router;
