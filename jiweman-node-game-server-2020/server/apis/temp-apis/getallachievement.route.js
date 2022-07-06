
const express = require('express');
const router = express.Router();


const achievementController = require('./getallachievement.controller');

/**
 * @swagger
 * definition:
 *   login:
 *     properties:
 *      
 *       userId:
 *         type: number
 * 
 */    

/**
 * @swagger
 * /Achievement/getAllAchievement:
 *   post:
 *     tags:
 *       - Achievement
 *     description: getAllAchievement 
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: login
 *         schema:
 *           type: object
 *         required:
 *           
 *           - userId
 *         
 * 
 *         properties:
 *        
 *           userId: number
 *          
 *         responses:
 *         200:
 *         description: Successfully logged in
 */
router.post('/getAllAchievement', achievementController.getAllAchievement);




module.exports = router;

