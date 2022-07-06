/*
* --------------------------------------------------------------------------
* Created by Barquecon Technologies on 26/04/2019 by Dipak Adsul
* ---------------------------------------------------------------------------
*/


const express = require('express');
const router = express.Router();

const teamManagementController = require('./team-management.controller');


router.put('/captain', teamManagementController.assignCaptain);

module.exports = router;