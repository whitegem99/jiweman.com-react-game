
const express = require('express');
const router = express.Router();


const friendController = require('./getallfriendlist.controller');

/**
 * @swagger
 * definition:
 *   login:
 *     properties:
 *       selfUser:
 *         type: number
 *      
 */

/**
 * @swagger
 * /PlayWithFriend/getAllFriendList:
 *   post:
 *     tags:
 *       - PlayWithFriend
 *     description: getAllFriendList 
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: login
 *         schema:
 *           type: object
 *         required:
 *           - selfUser
 *        
 *        
 *         properties:
 *           selfUser: number
 *    
 *         responses:
 *         200:
 *         description: Successfully logged in
 */
router.post('/getAllFriendList', friendController.getAllFriendList);




module.exports = router;
