
const express = require('express');
const router = express.Router();


const endController = require('./end.controller');

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
 *       secondWinner:
 *          type: number
 *       thirdWinner:
 *          type: number
 * 
 * 
 * 
 */    

/**
 * @swagger
 * /8PlayerTournament/end:
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
 *           - secondwinner
 *           - thirdwinner
 *           
 * 
 *         properties:
 *        
 *           userId: number
 *           companyId: number
 *           level: number
 *           gameState: string
 *           matchId: number
 *           secondwinner: number
 *           thirdwinner: number
 *         responses:
 *         200:
 *         description: Successfully logged in
 */
router.post('/RealMoneyTournament', endController.RealMoneyTournament);




module.exports = router;

