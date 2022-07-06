
const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const transaction_controller = require('./betting.transaction.controller');


/**
 * @swagger
 * definition:
 *   login:
 *     properties:
 *       userName:
 *         type: string
 *       rp:
 *         type: string
 *     
 * 
 */

/**
 * @swagger
 * /betting/addrp:
 *   post:
 *     tags:
 *       - betting transaction
 *     description: betting transaction user
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: login
 *         schema:
 *           type: object
 *         required:
 *           - userName
 *           - rp
 *         
 *         properties:
 *           userName: string
 *           rp: string
 *     responses:
 *       200:
 *         description: Successfully logged in
 */
router.post('/addrp',transaction_controller.addrp);

/**
 * @swagger
 * definition:
 *   login:
 *     properties:
 *       userName:
 *         type: string
 *       rp:
 *         type: string
 *     
 * 
 */

/**
 * @swagger
 * /betting/convertrptocash:
 *   post:
 *     tags:
 *       - betting transaction
 *     description: betting transaction user
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: login
 *         schema:
 *           type: object
 *         required:
 *           - userName
 *           - rp
 *         
 *         properties:
 *           userName: string
 *           rp: string
 *     responses:
 *       200:
 *         description: Successfully logged in
 */
router.post('/convertrptocash',transaction_controller.convertrptocash);


/**
 * @swagger
 * definition:
 *   login:
 *     properties:
 *       name:
 *         type: string
 *       bettingcompid:
 *         type: string
 *       amount:
 *         type: string
 *     
 * 
 */

/**
 * @swagger
 * /betting/amountToBettingAccount:
 *   post:
 *     tags:
 *       - betting transaction
 *     description: betting transaction user
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: login
 *         schema:
 *           type: object
 *         required:
 *           - name
 *           - bettingcompid
 *           - amount
 *         
 *         properties:
 *           name: string
 *           bettingcompid: string
 *           amount: string
 * 
 *     responses:
 *       200:
 *         description: Successfully logged in
 */


router.post('/amountToBettingAccount',transaction_controller.addAmountToBettingAccount);

module.exports = router;