const express = require('express');
const router = express.Router();
const checkBalanceController = require('./checkBalance.controller');

/**
 * @swagger
 * /balance:
 *   get:
 *     tags:
 *       - balance
 *     security:
 *       - api_key: []
 *     description: Get balance
 *     produces:
 *       - application/json
 *     responses:
 *       description: get bank balance api
 *       200:
 */

router.get('/balance',checkBalanceController.CheckBalance);

module.exports = router;
