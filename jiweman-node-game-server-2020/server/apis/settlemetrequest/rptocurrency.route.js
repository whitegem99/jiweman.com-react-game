const express = require('express');
const router = express.Router();


const rpToCurrencyController = require('./rptocurrency.controller');

/**
 * @swagger
 * definition:
 *   login:
 *     properties:
 *       rp:
 *         type: number
 * 
 */

/**
 * @swagger
 * /settlemet/RpToCurrency:
 *   post:
 *     tags:
 *       - settlemetToRequest
 *     description: RpToCurrency 
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: login
 *         schema:
 *           type: object
 *         required:
 *           - rp
 *          
 *        
 *         properties:
 *           rp: number
   
 *         responses:
 *         200:
 *         description: Successfully logged in
 */
router.post('/RpToCurrency',rpToCurrencyController.rpToCurrency);




module.exports = router;