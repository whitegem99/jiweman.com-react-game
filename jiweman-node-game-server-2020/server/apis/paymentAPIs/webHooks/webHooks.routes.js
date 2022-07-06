const express = require('express');
const router = express.Router();
const webHooksController = require('./webHooks.controller');

/**
 * @swagger
 * /webHooks:
 *   post:
 *     tags:
 *       - webHooks
 *     description: tracking transaction's statuses
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: webHooks
 *         schema:
 *           type: object
 *         required:
 *           - id
 *           - request_amount
 *           - request_currency
 *           - account_amount
 *           - account_currency
 *           - transaction_fee
 *           - total_credit
 *           - provider_id
 *           - merchant_reference
 *           - internal_reference
 *           - transaction_status
 *           - transaction_type
 *           - customer_charged
 *           - message
 *         properties:
 *           id: number
 *           request_amount: number
 *           request_currency: string
 *           account_amount: number
 *           account_currency: string
 *           transaction_fee: number
 *           total_credit: number
 *           provider_id: string
 *           merchant_reference: string
 *           internal_reference: string
 *           transaction_status: string
 *           transaction_type: string
 *           customer_charged: boolean
 *           message: string
 *     responses:
 *       200:
 *         description: Successfully created
 */

router.post('/webHooks',webHooksController.webHooks);

module.exports = router;
