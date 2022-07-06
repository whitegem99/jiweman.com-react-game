

const express = require('express');
const router = express.Router();

const playerLeagueController = require('./playerLeague.controller');

router.get('/playerLeague', playerLeagueController.playerLeagues);

router.post('/playerLeagueVerification',playerLeagueController.updateplayerLeagues);


/**
 * @swagger
 * /getLeagueAvailability:
 *   get:
 *     tags:
 *       - players
 *     security:
 *       - bearer: []
 *     description: Get League Availability
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: leagueId
 *         schema:
 *           type: object
 * 
 *         required:
 *           - leagueId
 * 
 *         properties:
 *           leagueId: string
 *     responses:
 *       description: get users league game remaining data
 *       200:
 */


router.get('/getLeagueAvailability',playerLeagueController.getLeagueAvaliablity);

module.exports = router;


