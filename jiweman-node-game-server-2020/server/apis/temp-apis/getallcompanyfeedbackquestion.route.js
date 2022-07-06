
const express = require('express');
const router = express.Router();


const feedbackController = require('./getallcompanyfeedbackquestion.controller');


/**
 * @swagger
 * /CompanyFeedback/getAllCompanyFeedbackQuestion:
 *   get:
 *     tags:
 *       - CompanyFeedback
 *     description: get All Company Feedback Question
 *     produces:
 *       - application/json
 *          
 *     responses:
 *       200:
 *         description: getAllCompanyFeedbackQuestion
 */

router.get('/getAllCompanyFeedbackQuestion', feedbackController.getAllCompanyFeedbackQuestion);
module.exports = router;

