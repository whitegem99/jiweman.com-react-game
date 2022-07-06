const express = require('express');
const router = express.Router();
const MatchStateController = require('./matchStates.controller');

router.post('/UpdateMatchState', MatchStateController.updateMatchState);

module.exports = router;

