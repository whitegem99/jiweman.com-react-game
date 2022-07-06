const express = require('express');
const router = express.Router();
const payoutsController = require('./payout.controller');

/**
 * @swagger
 * /payouts:
 *   post:
 *     tags:
 *       - payouts
 *     description: depositing money
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: payouts
 *         schema:
 *           type: object
 *         required:
 *           - api-key
 *           - currency
 *           - amount
 *           - method
 *           - provider_id
 *           - account_number
 *           - account_name
 *           - account_email
 *           - merchant_reference
 *           - narration
 *         properties:
 *           api-key: string
 *           currency: string
 *           amount: number
 *           method: string
 *           provider_id: string
 *           account_number: string
 *           account_name: string
 *           account_email: string
 *           merchant_reference: string
 *           narration: string
 *     responses:
 *       200:
 *         description: Successfully created
 */

router.post('/payouts',payoutsController.payouts);

module.exports = router;
