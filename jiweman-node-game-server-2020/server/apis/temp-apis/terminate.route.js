
const express = require('express');
const router = express.Router();


const realMoneyController = require('./terminate.controller');

/**
 * @swagger
 * definition:
 *   login:
 *     properties:
 *       userId:
 *         type: number
 *       companyId:
 *         type: number
 *       level:
 *         type: number  
 *       gameState:
 *          type: string
 *       entryFee:
 *           type: number
 *       matchId:
 *           type: number    
 *      
 */

/**
 * @swagger
 * /8PlayerTournament/RealMoneyTournament:
 *   post:
 *     tags:
 *       - 8PlayerTournament
 *     description: RealMoneyTournament 
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: login
 *         schema:
 *           type: object
 *         required:
 *           
 *           - userId 
 *           - companyId
 *           - level
 *           - gameState
 *           - entryFee
 *           - matchId
 *
 *        
 *        
 *         properties:
 *           userId: number
 *           companyId: number
 *           level: number
 *           gameState: string
 *           entryFee: number
 *           matchId: number
 *   
 *         responses:
 *         200:
 *         description: Successfully logged in
 */
router.post('/RealMoneyTournament', realMoneyController.RealMoneyTournament);




module.exports = router;
