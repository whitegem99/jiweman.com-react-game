/*
* --------------------------------------------------------------------------
* Created by Barquecon Technologies on 12/03/2019 by Dipak Adsul
* ---------------------------------------------------------------------------
*/

/*
* --------------------------------------------------------------------------
* Routes For Player Auth
* ---------------------------------------------------------------------------
*/

const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const bettingContoller = require('./betting.controller');

/**
 * @swagger
 * definition:
 *   login:
 *     properties:
 *       userName:
 *         type: string
 *       email:
 *         type: string
 *       password:
 *         type: string
 *     
 *       
 * 
 * 
 */

/**
 * @swagger
 * /betting/registerBettingCompany:
 *   post:
 *     tags:
 *       - betting
 *     description: betting user
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: login
 *         schema:
 *           type: object
 *         required:
 *           - username
 *           - email
 *           - password
 *        
 *         properties:
 *           username: string
 *           email: string
 *           password: string
 *          
 *           
 * 
 * 
 *     responses:
 *       200:
 *         description: Successfully logged in
 */
router.post('/registerBettingCompany',bettingContoller.registerBettingCompany);

/**
 * @swagger
 * definition:
 *   login:
 *     properties:
 *       userName:
 *         type: string
 *       password:
 *         type: string
 */

/**
 * @swagger
 * /betting/loginBettingCompany:
 *   post:
 *     tags:
 *       - betting
 *     description: betting user
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: login
 *         schema:
 *           type: object
 *         required:
 *           - username
 *           - password
 *         properties:
 *           username: string
 *           password: string
 *     responses:
 *       200:
 *         description: Successfully logged in
 */

router.post('/loginBettingCompany', bettingContoller.loginBettingCompany);


/**
 * @swagger
 * definition:
 *   login:
 *     properties:
 *       userName:
 *         type: string
 *       password:
 *         type: string
 *       bettingcompid:
 *         type: string
 *     
 *       currency:
 *           type: string
 *      
 * 
 * 
 */

/**
 * @swagger
 * /betting/bettingaccount:
 *   post:
 *     tags:
 *       - betting
 *     description: betting user
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: login
 *         schema:
 *           type: object
 *         required:
 *           - username
 *           - password
 *           - bettingcompid
 *         
 *           - currency
 *          
 *         properties:
 *           username: string
 *           password: string
 *           bettingcompid: string
 *          
 *           currency: string 
 *          
 * 
 * 
 *     responses:
 *       200:
 *         description: Successfully logged in
 */
router.post('/bettingaccount', bettingContoller.createBettingAccount);


/**
 * @swagger
 * /betting/betAccountDetailByUser:
 *   get:
 *     tags:
 *       - betting
 *     description: get betting Account details by username and betting_id
 *     produces:
 *       - application/json
 *          
 *     responses:
 *       200:
 *         description: Successfully retrieved AccountDetail by User
 */

router.get('/betAccountDetailByUser', bettingContoller.betAccountDetails);

/**
 * @swagger
 * /betting/getAllBetCompanies:
 *   get:
 *     tags:
 *       - betting
 *     description: get betting companies details
 *     produces:
 *       - application/json
 *          
 *     responses:
 *       200:
 *         description: Successfully retrieved betting companies
 */


router.get('/getAllBetCompanies', bettingContoller.getAllBetCompaniesDetails);



router.post('/bettingEntryFee', bettingContoller.selectMatchEntryFee);

module.exports = router;