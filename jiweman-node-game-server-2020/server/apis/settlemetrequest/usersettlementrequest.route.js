const express = require('express');
const router = express.Router();


const userSettlementRequestController = require('./usersettlementrequest.controller');

/**
 * @swagger
 * definition:
 *   login:
 *     properties:
 *       userId:
 *         type: number
 *       companyId:
 *         type: number
 *       rp:
 *         type: number 
 */

/**
 * @swagger
 * /settlemet/userSettlementRequest:
 *   post:
 *     tags:
 *       - settlemetToRequest
 *     description: userSettlementRequest 
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: login
 *         schema:
 *           type: object
 *         required:
 *           - userId
 *           - companyId
 *           - rp
 *          
 *        
 *         properties:
 *           userId: number
 *           companyId: number
 *           rp: number
   
 *         responses:
 *         200:
 *         description: Successfully logged in
 */
router.post('/userSettlementRequest',userSettlementRequestController.userSettlementRequest);




module.exports = router;