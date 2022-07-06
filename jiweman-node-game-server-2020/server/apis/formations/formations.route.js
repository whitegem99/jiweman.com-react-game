/*
* --------------------------------------------------------------------------
* Created by Barquecon Technologies on 12/03/2019 by Dipak Adsul
* ---------------------------------------------------------------------------
*/


const express = require('express');
const router = express.Router();

const playerFormationController = require('./formations.controller');

/**
 * @swagger
 * /formations:
 *   get:
 *     tags:
 *       - formations
 *     security:
 *       - bearer: []
 *     description: Login user
 *     responses:
 *       200:
 *         description: Successfully created
 */

router.get('/formations', playerFormationController.formations);

/**
 * @swagger
 * definition:
 *   login:
 *     properties:
 *       formationId:
 *         type: string
 *       playerId:
 *         type: string
 *       
 */

/**
 * @swagger
 * /formations:
 *   post:
 *     tags:
 *       - formations
 *     description: formations user
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: login
 *         schema:
 *           type: object
 *         required:
 *           - formationId
 *           - playerId
 *         
 *         properties:
 *           formationId: string
 *           playerId: string
 *          
 *     responses:
 *       200:
 *         description: Successfully created
 */



router.post('/formations', playerFormationController.selectFormations);

module.exports = router;