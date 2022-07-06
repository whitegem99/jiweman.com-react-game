
const express = require('express');
const router = express.Router();


const feedbackController = require('./answerforfeedbackquestion.controller');

/**
 * @swagger
 * definition:
 *   login:
 *     properties:
 *      
 *        companyId:
 *         type: number
 *        questionId:
 *         type: number
 *        answer:
 *         type: number
 *        userId:
 *         type: number
 *
 */    

/**
 * @swagger
 * /CompanyFeedback/submitAnswerForCompanyFeedbackQuestion:
 *   post:
 *     tags:
 *       - CompanyFeedback
 *     description: submitAnswerForCompanyFeedbackQuestion 
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: login
 *         schema:
 *           type: object
 *         required:
 *           
 *           - companyId  
 *           - questionId
 *           - answer
 *           - userId
 *          
 *           
 * 
 *         properties:
 *        
 *           companyId: number
 *           questionId: number
 *           answer: number
 *           userId: number
 *         
 *         responses:
 *         200:
 *         description: Successfully logged in
 */
router.post('/submitAnswerForCompanyFeedbackQuestion', feedbackController.submitAnswerForCompanyFeedbackQuestion);




module.exports = router;

