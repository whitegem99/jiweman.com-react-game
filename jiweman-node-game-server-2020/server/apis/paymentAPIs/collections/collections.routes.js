const express = require('express');
const router = express.Router();
const collectionsController = require('./collections.controller');

/**
 * @swagger
 * /collections:
 *   post:
 *     tags:
 *       - collections
 *     description: receiving money
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: collections
 *         schema:
 *           type: object
 *         required:
 *           - api-key
 *           - currency
 *           - amount
 *           - method
 *           - provider_id
 *           - account_number
 *           - merchant_reference
 *           - narration           
 *         properties:
 *           api-key: string
 *           currency: string
 *           amount: number
 *           method: string
 *           provider_id: string
 *           account_number: string
 *           merchant_reference: string
 *           narration: string
 *     responses:
 *       200:
 *         description: Successfully created
 */
router.post('/collections',collectionsController.collections);

router.post('/collections/update',collectionsController.collectionUpdate);

router.get('/collections/status/:id',collectionsController.collectionStatus);

router.get('/getPaymentOptions',collectionsController.getPaymentOptions);


 /**
  * @swagger
  * definition:
  *   joinFreeLeague:
  *     properties:
  *       leagueId:
  *         type: string
  */

/**
 * @swagger
 * /joinFreeLeague:
 *   post:
 *     tags:
 *       - join free league
 *     security:
 *       - bearer: []
 *     description: join free league
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name : joinFreeLeague 
 *         required:
 *           - leagueId
 *         properties:
 *           leagueId: string
 *         schema:
 *           $ref: "#/definitions/joinFreeLeague"
 *     responses:
 *       200:
 *         description: Successfully created
 */


router.post('/joinFreeLeague',collectionsController.joinFreeLeague);

module.exports = router;
