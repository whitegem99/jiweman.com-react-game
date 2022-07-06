/*
 * --------------------------------------------------------------------------
 * Created by Barquecon Technologies on 30/05/2019 by Dipak Adsul
 * ---------------------------------------------------------------------------
 */

/*
 * --------------------------------------------------------------------------
 * Routes For Push notification
 * ---------------------------------------------------------------------------
 */

const express = require('express');
const router = express.Router();

const pushController = require('./push.controller')


/**
 * @swagger
 * definition:
 *   playwithfriend:
 *     properties:
 *       deviceType:
 *         type: string
 *       deviceId:
 *         type: string
 *    
 */

/**
 * @swagger
 * /saveDeviceIdPushNotification:
 *   post:
 *     tags:
 *       - save Device Id Push Notification
 *     description: Push Notification
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: PushNotification
 *         schema:
 *           type: object
 *         required:
 *           - deviceType
 *           - deviceId
 *          
 * 
 *         properties:
 *           deviceType: string
 *           deviceId: string
 *          
 * 
 *     responses:
 *       200:
 *         description: Successfully created
 */



router.post('/saveDeviceIdPushNotification', pushController.saveDeviceIdPushNotification);


/**
 * @swagger
 * /sendFcmNotification:
 *   get:
 *     tags:
 *       - sendFcmNotification
 *     security:
 *       - bearer: []
 *     description: Get Notification
 *     produces:
 *       - application/json
 *     responses:
 *       description: get Notification
 *       200:
 */


router.get('/sendFcmNotification', pushController.sendFcmNotification);

router.post('/sendFcmNotificationMsg', pushController.sendFcmNotificationMsg);


module.exports = router;