const express = require('express');
const router = express.Router();
const bankBranchesController = require('./bankBranches.controller');

/**
 * @swagger
 * /bankBranches:
 *   get:
 *     tags:
 *       - bankBranches
 *     security:
 *       - api_key: []
 *     description: Get bankBranches
 *     produces:
 *       - application/json
 *     responses:
 *       description: get bank branches api
 *       200:
 */
router.get('/bankBranches',bankBranchesController.bankBranches);

module.exports = router;
