

const express = require('express');
const router = express.Router();

const playerBetController = require('./playerOneVSOneBet.controller');

router.get('/playerBet', playerBetController.playerBets);

router.post('/playerBetVerification',playerBetController.updateplayerBets);


 /**
  * @swagger
  * definition:
  *  getBetAvailability:
  *    properties:
  *     gameId:
  *       type: string
  */


/**
 * @swagger
 * /getBetAvailability:
 *   get:
 *     tags:
 *       - getBetAvailability
 *     security:
 *       - bearer: []
 *     description: Get get bet availability data
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: gameId
 *         required: true
 *         type: string
 *         description: Pass gameId only to display bet details
 *         schema:
 *            $ref: "#/definitions/getBetAvailability"
 *     responses:
 *       description: get getBetAvailability api
 *       200:
 */

router.get('/getBetAvailability',playerBetController.getBetAvailability);

module.exports = router;
