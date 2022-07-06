const express = require('express');
const router = express.Router();
const prizePercentageController = require('./prizePercentage.controller');






router.get('/getprizePercentage',prizePercentageController.getPrizePercentage);

router.post('/getprizePercentage',prizePercentageController.addPrizePercentage);

router.delete('/getprizePercentage/:id',prizePercentageController.removePrizePercentage);

router.put('/getprizePercentage/:id',prizePercentageController.updatePrizePercentage);








module.exports = router;
