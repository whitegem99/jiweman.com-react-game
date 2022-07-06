const express = require('express');
const router = express.Router();
const playerAnalysisController = require('./playerAnalysis.controller');

/**
 * @swagger
 * /paymentOptionsOrProviders:
 *   get:
 *     tags:
 *       - paymentOptionsOrProviders
 *     security:
 *       - api-key: []
 *     description: Get paymentOptionsOrProviders
 *     produces:
 *       - application/json
 *     responses:
 *       description: get paymentOptionsOrProviders api
 *       200:
 */

router.get('/matchesPlayed', playerAnalysisController.matchesPlayedByPlayer);

/**
 * @swagger
 * /playerStats:
 *   get:
 *     tags:
 *       - playerStats
 *     security:
 *       - bearer: []
 *     description: Get playerStats
 *     produces:
 *       - application/json
 *     responses:
 *       description: get playerStats api
 *       200:
 */

router.get('/playerStats', playerAnalysisController.playerStatsOptimized);


module.exports = router;