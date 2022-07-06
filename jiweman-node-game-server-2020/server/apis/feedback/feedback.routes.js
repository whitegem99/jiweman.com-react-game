const express = require('express');
const router = express.Router();
const feedbackController = require('./feedback.controller');


// For player
router.get('/feedback/',feedbackController.getAllByUserId);
router.post('/feedback',feedbackController.create);
router.post('/feedback/:feedbackId',feedbackController.replyToFeedback);


// For Admin
router.get('/feedback/all',feedbackController.getAll);
router.post('/feedback/admin/:feedbackId',feedbackController.closeFeedback);


module.exports = router;