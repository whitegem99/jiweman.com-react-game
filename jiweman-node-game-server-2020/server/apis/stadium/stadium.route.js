/*
* --------------------------------------------------------------------------
* Created by Barquecon Technologies on 26/04/2019 by Dipak Adsul
* ---------------------------------------------------------------------------
*/


const express = require('express');
const router = express.Router();


const playerStadiumsController = require('./stadium.controller');

/**
 * @swagger
 * /stadiumsbyuser:
 *   post:
 *     tags:
 *       - stadiums
 *     description: stadiums user
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         required:
 *           - stadiumsId
 *           - playerId
 *         
 *         properties:
 *           stadiumsId: string
 *           playerId: string
 *          
 *     responses:
 *       200:
 *         description: Successfully created
 */


router.post('/stadiums', playerStadiumsController.selectStadiums);


/**
 * @swagger
 * /stadiums:
 *   get:
 *     tags:
 *       - stadiums
 *     description: stadiums user
 *     produces:
 *       - application/json
 *          
 *     responses:
 *       200:
 *         description:  Successfully retrieved stadiums
 */

router.get('/stadiums', playerStadiumsController.stadiums)


module.exports = router;