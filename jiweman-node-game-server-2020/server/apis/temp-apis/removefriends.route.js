
const express = require('express');
const router = express.Router();


const friendController = require('./playertournament.controller');

/**
 * @swagger
 * definition:
 *   login:
 *     properties:
 *       selfUser:
 *         type: number
 *       friendUser:
 *         type: number
 *      
 */

/**
 * @swagger
 * /PlayWithFriend/removeFriend:
 *   post:
 *     tags:
 *       - PlayWithFriend
 *     description: removeFriend 
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: login
 *         schema:
 *           type: object
 *         required:
 *           - selfUser
 *           - friendUser
 *        
 *        
 *         properties:
 *           selfUser: number
 *           friendUser: number
   
 *         responses:
 *         200:
 *         description: Successfully logged in
 */
router.post('/removeFriend', friendController.removeFriend);




module.exports = router;
