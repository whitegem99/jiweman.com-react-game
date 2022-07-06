const express = require('express');
const router = express.Router();
var multer = require('multer');

const leagueController = require('./league.controller');

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../server/public/uploads/images');
    // cb(null, '/Users/ravideshmukh/Downloads');
  },
  filename: (req, file, cb) => {
    console.log(file);
    var filetype = '';
    if (file.mimetype === 'image/gif') {
      filetype = 'gif';
    }
    if (file.mimetype === 'image/png') {
      filetype = 'png';
    }
    if (file.mimetype === 'image/jpeg') {
      filetype = 'jpg';
    }
    cb(null, file.originalname);
  },
});
var upload = multer({ storage: storage });

/**
 * @swagger
 * /league:
 *   get:
 *     tags:
 *       - leagues
 *     security:
 *       - bearer: []
 *     description: Get leagues
 *     produces:
 *       - application/json
 *     responses:
 *       description: get leagues api
 *       200:
 */

router.get('/league', leagueController.leagues);

/**
 * @swagger
 * /leagueForAdmin:
 *   get:
 *     tags:
 *       - leagues
 *     security:
 *       - bearer: []
 *     description: Get leagues for Admin
 *     produces:
 *       - application/json
 *     responses:
 *       description: get leagues api for Admin
 *       200:
 */

router.get('/leagueForAdmin', leagueController.leaguesForAdmin);

/**
 * @swagger
 * /leagueForPlayers:
 *   get:
 *     tags:
 *       - leagues
 *     security:
 *       - bearer: []
 *     description: Get leagues for Players
 *     produces:
 *       - application/json
 *     responses:
 *       description: get leagues api for Players
 *       200:
 */

router.get('/leagueForPlayers', leagueController.leaguesForPlayers);

/**
 * @swagger
 * /league:
 *   post:
 *     tags:
 *       - leagues
 *     description: adding leagues
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: league
 *         schema:
 *           type: object
 *         required:
 *           - leagueName
 *           - brandId
 *           - endDate
 *         properties:
 *           leagueName: string
 *           brandId: string
 *           endDate: date
 *     responses:
 *       200:
 *         description: Successfully created
 */

router.post('/addLeague', leagueController.addLeague);
//router.post('/addLeague', leagueController.addLeague);

/**
 * @swagger
 * /league:
 *   post:
 *     tags:
 *       - leagues
 *     description: updating leagues
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: updateLeague
 *         schema:
 *           type: object
 *         required:
 *           - leagueName
 *           - brandId
 *           - endDate
 *         properties:
 *           leagueName: string
 *           brandId: string
 *           endDate: date
 *           entryFee: number
 *           gameCount: number
 *     responses:
 *       200:
 *         description: Successfully created
 */

router.put('/updateLeague/:leagueId', leagueController.updateLeague);

/**
 * @swagger
 * /league:
 *   delete:
 *     tags:
 *       - leagues
 *     description: updating leagues
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: deleteLeague
 *         schema:
 *           type: object
 *         required:
 *           - leagueId
 *         properties:
 *           leagueId: string
 *     responses:
 *       200:
 *         description: Successfully Deleted
 */

router.delete('/deleteLeague', leagueController.deleteLeague);

router.post('/uploadFile', leagueController.uploadFile);

router.get('/endedLeagues', leagueController.endedLeagues);

router.post('/processLeagueWinners', leagueController.processLeagueWinners);

router.post('/getLeagueWinners', leagueController.getLeagueWinners);

router.post(
  '/getPlayerLeagueWinningHistory',
  leagueController.getPlayerLeagueWinningHistory
);

router.get(
  '/getWinningTransactionForAdmin',
  leagueController.getWinningTransactionForAdmin
);

 /**
  * @swagger
  * definition:
  *   purchaseLeague:
  *     properties:
  *       leagueId:
  *         type: string
  *       mode: 
  *         type: string
  *       amount: 
  *         type: number
  */

/**
 * @swagger
 * /purchaseLeague:
 *   post:
 *     tags:
 *       - join paid league
 *     security:
 *       - bearer: []
 *     description: 1. join paid league 2. please pass value for mode variable "wallet" 
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name : purchaseLeague 
 *         required:
 *           - leagueId
 *           - mode
 *           - amount
 *         properties:
 *           leagueId: string
 *           mode: string
 *           amount: number
 *         schema:
 *           $ref: "#/definitions/purchaseLeague"
 *     responses:
 *       200:
 *         description: Successfully created
 */


router.post('/purchaseLeague', leagueController.purchaseLeague);

router.get('/getprizepoolAmount', leagueController.getprizepoolAmount);
module.exports = router;
