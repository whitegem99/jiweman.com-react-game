
const express = require('express');
const router = express.Router();


const startController = require('./start.controller');

/**
 * @swagger
 * definition:
 *   login:
 *     properties:
 *      
 *       userId:
 *         type: number
 *       companyId:
 *         type: number
 *       level:
 *         type: number
 *       gameState:
 *         type: string
 *       matchId:
 *         type: number
 *       entryFee:
 *          type: number
 *      
 * 
 * 
 */    

/**
 * @swagger
 * /8PlayerTournament/start:
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
 *           - matchId
 *           - entryFee
 * 
 *         properties:
 *        
 *           userId: number
 *           companyId: number
 *           level: number
 *           gameState: string
 *           matchId: number
 *           entryFee: number
 *         responses:
 *         200:
 *         description: Successfully logged in
 */
router.post('/RealMoneyTournament', startController.RealMoneyTournament);




module.exports = router;

