const express = require('express');
const router = express.Router();
const pointsController = require('./points.controller');

router.post('/addPointsInfo',pointsController.addInformation);

router.get('/pointsInfo',pointsController.information);

router.put('/updatePointsInfo',pointsController.updateInformation);

module.exports = router;
