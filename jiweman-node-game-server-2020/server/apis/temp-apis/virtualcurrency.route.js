
const express = require('express');
const router = express.Router();


const virtualCurrencyController = require('./virtualcurrency.controller');

/**
 * @swagger
 * definition:
 *   login:
 *     properties:
 *      
 *       userId:
 *         type: number
 *       gameState:
 *         type: string
 *       entryFee:
 *          type: number
 *       matchId:
 *         type: number
 *       
 * 
 * 
 * 
 */    

/**
 * @swagger
 * /virtualCurrencyOneOnOne:
 *   post:
 *     tags:
 *       - VirtualCurrencyOneOnOne
 *     description: virtualCurrencyOneOnOne
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
 *           - gameState
 *           - entryFee
 *           - matchId
 *          
 *         properties:
 *        
 *           userId: number
 *           gameState: string
 *           entryFee: number
 *           matchId: number
 *         
 *         responses:
 *         200:
 *         description: Successfully logged in
 */
router.post('/virtualCurrencyOneOnOne', virtualCurrencyController.virtualCurrencyOneOnOne);




module.exports = router;

