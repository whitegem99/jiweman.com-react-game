const express = require('express');
const router = express.Router();
const ConnectionStateController = require('./connectionStates.controller');

router.post('/ConnectionState', ConnectionStateController.saveConnectionState);

module.exports = router;

