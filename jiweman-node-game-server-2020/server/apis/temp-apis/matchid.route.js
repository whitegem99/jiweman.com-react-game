
const express = require('express');
const router = express.Router();


const matchController = require('./matchid.controller');

/**
 * @swagger
 * definition:
 *   login:
 *     properties:
 *       userId:
 *         type: number
 *       roomId:
 *         type: number
 *       entryFee:
 *         type: number
 */    

/**
 * @swagger
 * /8PlayerTournament/getTournamentMatchId:
 *   post:
 *     tags:
 *       - 8PlayerTournament
 *     description: getTournamentMatchId 
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: login
 *         schema:
 *           type: object
 *         required:
 *           - userId
 *           - roomId
 *           - entryFee        
 *        
 *         properties:
 *           userId: number
 *           roomId: number
 *           entryFee: number
   
 *         responses:
 *         200:
 *         description: Successfully logged in
 */
router.post('/getTournamentMatchId', matchController.getTournamentMatchId);




module.exports = router;

