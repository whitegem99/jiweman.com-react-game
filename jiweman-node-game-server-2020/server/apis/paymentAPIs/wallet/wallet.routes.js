const express = require('express');
const router = express.Router();
const walletController = require('./wallet.controller');

router.get('/getWalletTransactions', walletController.getWalletTransactions);

router.post('/addToWallet', walletController.addToWallet);
router.post('/addToWalletAmount', walletController.getAddToWalletAmount);

router.post('/payFromWallet', walletController.payFromWallet);

router.post('/transferToBank', walletController.transferFromWalletToBank);
router.post(
  '/transferToBankAmount',
  walletController.transferFromWalletToBankAmount
);


/**
 * @swagger
 * /wallet/walletBalance:
 *   get:
 *     tags:
 *       - walletBalance
 *     security:
 *       - bearer: []
 *     description: Get walletBalance
 *     produces:
 *       - application/json
 *     responses:
 *       description: get walletBalance api
 *       200:
 */ 

router.get('/walletBalance', walletController.getBalance);
router.get('/walletBalanceWithWithdrawal', walletController.getWalletBalanceWithWithdrawal);

router.get('/transferCount', walletController.getTransactionCountWithinADay);

router.get(
  '/getWalletTransactionsAdmin',
  walletController.getWalletTransactionsAdmin
);

router.get('/walletBalanceAdmin/:playerId', walletController.getBalanceAdmin);

module.exports = router;
