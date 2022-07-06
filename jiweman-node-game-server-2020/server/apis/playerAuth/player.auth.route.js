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
var multer = require('multer');

// Require the controllers WHICH WE DID NOT CREATE YET!!
const playerAuthController = require('./player.auth.controller');

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // cb(null, '../server/public/uploads/images');
    cb(null, '/var/www/html/uploads/images');
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
// const upload = multer({dest:'../server/public/uploads/images'});



/**
 * @swagger
 * definition:
 *    forgot:
 *      properties:
 *        email:
 *          type: string
 */

 /**
  * @swagger
  * definition:
  *   getUserName:
  *     properties:
  *       email:
  *         type: string
  */

/**
 * @swagger
 * definition:
 *   userLogin:
 *     properties:
 *       userName:
 *         type: string
 *       password:
 *         type: string
 */

  /**
  * @swagger
  * definition:
  *  registerWithJieman:
  *    properties:
  *     fullName:
  *       type: string
  *     userName:
  *       type: string
  *     email:
  *       type: string
  *     password:
  *       type: string
  *     confirmPassword:
  *       type: string
  *     dateOfBirth:
  *       type: string
  *     gender:
  *       type: string
  *     countryOfRecidence:
  *       type: string 
  *     mobile:
  *       type: string
  *     bettingCompanyId:
  *       type: string 
  */

/**
 * @swagger
 * /auth/registerWithJieman:
 *   post:
 *     tags:
 *       - register
 *     description: register user
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: register
 *         required:
 *          - fullName
 *          - userName
 *          - email
 *          - password
 *          - confirmPassword 
 *          - dateOfBirth
 *          - gender
 *          - countryOfRecidence 
 *          - mobile
 *          - bettingCompanyId
 * 
 *         properites:
 *            fullName: string
 *            userName: string 
 *            email: string
 *            password: string
 *            confirmPassword: string
 *            dateOfBirth: string
 *            gender: string
 *            countryOfRecidence: string 
 *            mobile: string
 *            bettingCompanyId: string
 *         schema:
 *            $ref: "#/definitions/registerWithJieman"
 *     responses:
 *       200:
 *        description: Successfully created
 */



router.post('/registerWithJieman', playerAuthController.registerWithJieman);

router.post('/verifyMobile', playerAuthController.verifyMobile);

router.get('/activateAccount', playerAuthController.activateAccount);



/**
 * @swagger
 * /auth/loginwithJiweman:
 *   post:
 *     tags:
 *       - login
 *     description: Login user
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         required:
 *           - userName
 *           - password
 *
 *         properties:
 *           userName: string
 *           email: string
 *         schema:
 *           $ref: "#/definitions/userLogin"
 *     responses:
 *       200:
 *         description: Successfully created
 */

router.post('/loginwithJiweman', playerAuthController.loginwithJiweman);

/**
 * @swagger
 * /auth/loginAsGuest:
 *   post:
 *     tags:
 *       - login
 *     description: LoginAsGuest user
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: login
 *         schema:
 *           type: object
 *         required:
 *           - userName
 *           - email
 *           - password
 *           - deviceToken
 *           - accountType
 *         properties:
 *           userName: string
 *           email: string
 *           password: string
 *           deviceToken: string
 *           accountType: string
 *     responses:
 *       200:
 *         description: Successfully created
 */

// router.post('/loginAsGuest', playerAuthController.loginAsGuest);

/**
 * @swagger
 * /auth/forgotpassword:
 *   post:
 *     tags:
 *       - forgot
 *     description: forgot password
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: forgot password 
 *         required:
 *           - email
 *         properties:
 *           email: string
 *         schema:
 *           $ref: "#/definitions/forgot"
 *     responses:
 *       200:
 *         description: Successfully created
 */

router.post('/forgotpassword', playerAuthController.forgotPassword);

/**
 * @swagger
 * /auth/resetPassword:
 *   post:
 *     tags:
 *       - reset
 *     description: reset password
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         required:
 *           - email
 *           - password
 *           - password_conformation
 *         properties:
 *           email: string
 *           password: string
 *           password_conformation: string
 *         schema:
 *           $ref: "#/definitions/forgot"
 *     responses:
 *       200:
 *         description: Successfully created
 */

router.post('/resetPassword', playerAuthController.resetPassword);

router.get(
  '/getUserDetailsByToken',
  playerAuthController.getUserDetailsByToken
);

// router.post('/loginWithFacebook', playerAuthController.loginwithFacebook);

/**
 * @swagger
 * /auth/upload:
 *   post:
 *     tags:
 *       - upload
 *     description: upload files
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         required:
 *            -file
 *         properties:
 *           file:multipart
 *     responses:
 *       200:
 *         description: Successfully uploaded
 */
router.post(
  '/upload',
  upload.single('file'),
  playerAuthController.uploadProfilePhoto
);

router.get('/latestAPK', playerAuthController.latestApk);



/**
 * @swagger
 * /auth/getUserName:
 *   post:
 *     tags:
 *       - get user name
 *     security:
 *       - bearer: []
 *     description: getuserName
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name : getUserName 
 *         required:
 *           - email
 *         properties:
 *           email: string
 *         schema:
 *           $ref: "#/definitions/getUserName"
 *     responses:
 *       200:
 *         description: Successfully created
 */


router.post('/getUsername', playerAuthController.forgotUsername);

router.post('/securityCode', playerAuthController.checkSecurityCode);

router.post('/checkMainDeviceToken', playerAuthController.checkMainDeviceToken);

router.get('/userTransactionHistory', playerAuthController.playerTransctions);

router.get(
  '/transactionHistoryForAdmin',
  playerAuthController.transactionHistoryForAdmin
);

router.get(
  '/previouslyUsedPhoneNumbers',
  playerAuthController.playerPreviouslyUsedPhoneNumbers
);

router.get(
  '/playerPhoneNumberFromLeaguePurchase/:leagueId',
  playerAuthController.playerPhoneNumberFromLeaguePurchase
);

router.post('/claimLeagueWinning', playerAuthController.claimLeagueWinning);

router.post(
  '/winningsPaymentWebhook',
  playerAuthController.winningsPaymentWebhook
);

router.get('/checkAuthentication', playerAuthController.checkAuthentication);

router.post(
  '/mobileNumberVerification',
  playerAuthController.mobileNumberVerification
);
router.post('/verifyMobileNumber', playerAuthController.verifyMobileNumber);

router.post('/updateBanStatus', playerAuthController.updateBanStatus);

router.post('/warn', playerAuthController.warn);


router.get('/getReferCode',playerAuthController.getReferCode);

module.exports = router;
