
const express = require('express');
const router = express.Router();


const winnerDeclarationController = require('./winnerdeclaration.controller');

/**
 * @swagger
 * definition:
 *   login:
 *     properties:
 *       id:
 *         type: number
 *       userId:
 *         type: number
 *       companyId:
 *         type: number
 *       gameState:
 *         type: string
 *       matchId:
 *         type: number
 */    

/**
 * @swagger
 * /8PlayerTournament/WinnerDeclaration:
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
 *           - id
 *           - userId
 *           - companyId        
 *           - gameState
 *           - matchId
 * 
 *         properties:
 *           id: number
 *           userId: number
 *           companyId: number
 *           gameState: string
 *           matchId: number
 *         responses:
 *         200:
 *         description: Successfully logged in
 */
router.post('/RealMoneyTournament', winnerDeclarationController.RealMoneyTournament);




module.exports = router;

