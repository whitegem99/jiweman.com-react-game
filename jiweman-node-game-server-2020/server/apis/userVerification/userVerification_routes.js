const express = require('express');
const router = express.Router();


const userVerificationController = require('./userVerification_controller');




router.post('/uploadUserData',userVerificationController.uploadFile);

router.post('/userVerification',userVerificationController.create);

router.get('/userVerification',userVerificationController.show);

router.post('/updateUserStatus',userVerificationController.updateStatus);


module.exports = router;