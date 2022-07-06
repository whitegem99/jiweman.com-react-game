
const express = require('express');
const router = express.Router();


const feedbackController = require('./feedbackquestionbycompany.controller');

/**
 * @swagger
 * definition:
 *   login:
 *     properties:
 *      
 *        companyId:
 *         type: number
 *        
 */    

/**
 * @swagger
 * /CompanyFeedback/getAllFeedbackQuestionByCompany:
 *   post:
 *     tags:
 *       - CompanyFeedback
 *     description: getAllFeedbackQuestionByCompany 
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
 *                    
 * 
 *         properties:
 *        
 *           companyId: number
 *           
 *         responses:
 *         200:
 *         description: Successfully logged in
 */
router.post('/getAllFeedbackQuestionByCompany', feedbackController.getAllFeedbackQuestionByCompany);




module.exports = router;

