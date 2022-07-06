const express = require('express');
const router = express.Router();

const analyticsController = require('./analytics.controller');

/**
 * @swagger
 * /analytics/stats:
 *   get:
 *     tags:
 *       - stats
 *     description: get stats
 *     produces:
 *       - application/json

 *     responses:
 *       200:
 *         description: Successfully created
 */
router.get('/stats', analyticsController.getAllStats);

/**
 * @swagger
 * /analytics/statsfromcache:
 *   get:
 *     tags:
 *       - stats
 *     description: get stats
 *     produces:
 *       - application/json

 *     responses:
 *       200:
 *         description: Successfully created
 */
router.get('/statsfromcache', analyticsController.getAllStatsFromCache);

/**
 * @swagger
 * /downloads:
 *   get:
 *     tags:
 *       - stats
 *     description: get download count
 *     produces:
 *       - application/json

 *     responses:
 *       200:
 *         description: Successfully retreived
 */
router.get('/downloads', analyticsController.getBuildDownloadsCount);

/**
 * @swagger
 * /downloads:
 *   post:
 *     tags:
 *       - downloads
 *     description: update download count
 *     produces:
 *       - application/json

 *     responses:
 *       200:
 *         description: Successfully updated
 */
router.post('/downloads', analyticsController.updateDownloadCount);

router.get('/getAgeData',analyticsController.getAgeData);

router.get('/getGenderData',analyticsController.getGenderData);

router.get('/getCountryData',analyticsController.getCountryData)

router.get('/getTransactionData',analyticsController.getTransactionData);

module.exports = router;