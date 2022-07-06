const express = require('express');
const router = express.Router();
const bettingCompanyController = require('./bettingCompany.controller');
const { bettingCompany } = require('./bettingCompany.model');


// For player
router.get('/bettingCompany/',bettingCompanyController.getAll);
router.get('/bettingCompany/getAllCountries',bettingCompanyController.getAllCountries);
router.post('/bettingCompany/register',bettingCompanyController.create);
// router.post('/feedback/:feedbackId',feedbackController.replyToFeedback);


// For Admin
router.get('/bettingCompany/all',bettingCompanyController.getAll);
router.get('/bettingCompany/allByCountry',bettingCompanyController.getAllByCountry);
router.post('/bettingCompany/approve',bettingCompanyController.approve);
router.post('/bettingCompany/deactivate',bettingCompanyController.deactivate);
router.post('/bettingCompany/activate',bettingCompanyController.activate);
// router.post('/feedback/admin/:feedbackId',feedbackController.closeFeedback);

router.get('/getReferralEvents',bettingCompanyController.getAllEvent);
router.post('/updateReferralSetting',bettingCompanyController.updateReferralSetting);
router.get('/referralSetting',bettingCompanyController.getReferralSetting);
router.get('/getReferralRewardInfo',bettingCompanyController.getReferralRewardInfo); 

router.get('/referralMessage',bettingCompanyController.referralMessage) // for unity
module.exports = router;