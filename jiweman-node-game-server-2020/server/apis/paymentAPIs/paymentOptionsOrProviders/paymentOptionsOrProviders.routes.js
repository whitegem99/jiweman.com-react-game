const express = require('express');
const router = express.Router();
const paymentOptionsOrProvidersController = require('./paymentOptionsOrProviders.controller');

/**
 * @swagger
 * /paymentOptionsOrProviders:
 *   get:
 *     tags:
 *       - paymentOptionsOrProviders
 *     security:
 *       - api-key: []
 *     description: Get paymentOptionsOrProviders
 *     produces:
 *       - application/json
 *     responses:
 *       description: get paymentOptionsOrProviders api
 *       200:
 */

router.get('/paymentOptionsOrProviders/:paymentMethod',paymentOptionsOrProvidersController.paymentOptionsOrProviders);

module.exports = router;
