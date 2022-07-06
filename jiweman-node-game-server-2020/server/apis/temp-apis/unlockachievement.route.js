
const express = require('express');
const router = express.Router();


const achievementController = require('./unlockachievement.controller');

/**
 * @swagger
 * definition:
 *   login:
 *     properties:
 *      
 *       userId:
 *         type: number
 *       achievementId: number
 */    

/**
 * @swagger
 * /Achievement/unlockAchievement:
 *   post:
 *     tags:
 *       - Achievement
 *     description: unlockAchievement 
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: login
 *         schema:
 *           type: object
 *        
 *         required:
 *           - userId
 *           - achievementId
 * 
 *         properties:
 *          userId: number
 *          achievementId: number
 *         responses:
 *         200:
 *         description: Successfully logged in
 */
router.post('/unlockAchievement', achievementController.unlockAchievement);




module.exports = router;

