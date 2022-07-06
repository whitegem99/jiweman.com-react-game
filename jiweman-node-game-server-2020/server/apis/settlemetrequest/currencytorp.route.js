const express = require('express');
const router = express.Router();


const currencyToRpController = require('./currencytorp.controller');

/**
 * @swagger
 * definition:
 *   login:
 *     properties:
 *       amount:
 *         type: number
 * 
 */

/**
 * @swagger
 * /settlemet/currencyToRP:
 *   post:
 *     tags:
 *       - settlemetToRequest
 *     description: currencyToRP 
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: login
 *         schema:
 *           type: object
 *         required:
 *           - amount
 *          
 *        
 *         properties:
 *           amount: number
   
 *         responses:
 *         200:
 *         description: Successfully logged in
 */
router.post('/currencyToRP',currencyToRpController.currencyToRP);




module.exports = router;