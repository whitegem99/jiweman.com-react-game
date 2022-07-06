
const express = require('express');
const router = express.Router();


const playerTournamentController = require('./playertournament.controller');

/**
 * @swagger
 * definition:
 *   login:
 *     properties:
 *       matchId:
 *         type: number
 *      
 */

/**
 * @swagger
 * /8PlayerTournament/onGoingTournamentWinner:
 *   post:
 *     tags:
 *       - 8PlayerTournament
 *     description: onGoingTournamentWinner 
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: login
 *         schema:
 *           type: object
 *         required:
 *           - matchId
 *        
 *        
 *         properties:
 *           matchId: number
 *          
   
 *         responses:
 *         200:
 *         description: Successfully logged in
 */
router.post('/onGoingTournamentWinner', playerTournamentController.onGoingTournamentWinner);




module.exports = router;
