
const express = require('express');
const router = express.Router();


const bettingController = require('./bettingoneonone.controller');

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
 * /BettingOneOnOne:
 *   post:
 *     tags:
 *       - BettingOneOnOne
 *     description: RealMoneyOneOnOne 
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
 *           - gameState
 *           - entryFee
 *           - matchId
 *          
 *           
 * 
 *         properties:
 *        
 *           userId: number
 *           companyId: number
 *           gameState: string
 *           entryFee: number
 *           matchId: number
 *         
 *         responses:
 *         200:
 *         description: Successfully logged in
 */
router.post('/RealMoneyOneOnOne', bettingController.RealMoneyOneOnOne);




module.exports = router;

