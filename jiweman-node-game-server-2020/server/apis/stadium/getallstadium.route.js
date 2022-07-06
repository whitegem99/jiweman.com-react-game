const express = require('express');
const router = express.Router();


const getallstadiumController = require('./getallstadium.controller');

/**
 * @swagger
 * definition:
 *   login:
 *     properties:
 *       userId:
 *         type: number
 *      
 */

/**
 * @swagger
 * /stadium/getAllStadiumByUserId:
 *   post:
 *     tags:
 *       - stadiums
 *     description: getAllStadiumByUserId 
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: login
 *         schema:
 *           type: object
 *         required:
 *           - userId
 *        
 *        
 *         properties:
 *           userId: number
 *          
   
 *         responses:
 *         200:
 *         description: Successfully logged in
 */
router.post('/getAllStadiumByUserId',getallstadiumController.getallstadium);




module.exports = router;