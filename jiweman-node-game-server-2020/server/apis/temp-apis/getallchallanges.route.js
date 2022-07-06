
const express = require('express');
const router = express.Router();


const challangesController = require('./getallchallanges.controller');


/**
 * @swagger
 * /PlayWithFriend/getAllChallenges:
 *   get:
 *     tags:
 *       - PlayWithFriend
 *     description: get All Company Feedback Question
 *     produces:
 *       - application/json
 *          
 *     responses:
 *       200:
 *         description: getAllChallenges
 */

router.get('/getAllChallenges', challangesController.getAllChallenges);
module.exports = router;

