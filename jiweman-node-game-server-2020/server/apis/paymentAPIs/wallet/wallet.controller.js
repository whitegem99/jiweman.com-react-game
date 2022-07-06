const {
  creditToWallet,
  getWalletTransactions,
  debitFromWallet,
  getBalance,
  transferFromWallet,
  findAllQuery,
  getWalletTransactionsAdmin
} = require('./wallet.service');
const func = require('../../common/commonfunction');
const request = require('request');
var Collections = require('../collections/collections.model').Collection;
const axios = require('axios').default;
const moment = require('moment')

/**
 * Get customer balance
 * @public
 */
exports.getBalance = async (req, res, next) => {
  func.checkUserAuthentication(req, res, async function (payload) {
    try {
      const response = await getBalance(payload.sub);
      return res.json(response);
    } catch (error) {
      next(error);
    }
  });
};

exports.getWalletBalanceWithWithdrawal = async (req, res, next) => {
  func.checkUserAuthentication(req, res, async function (payload) {
    try {
      const response = await getBalance(payload.sub);

      // Get winnings in last 2 days.
      currDate = moment();
      startdate = currDate.subtract(2, "days");
      console.log(startdate.format())
      req.query.accountNumber = payload.sub;
      req.query.winnings = true;
      req.query.createdAt = {
        $gt: startdate.toDate(),
      }

      const transactionResponse = await getWalletTransactions(req.query);

      // Calculate amount won in last two days (48 Hours).
      let amount  = 0
      if(transactionResponse.length){
        transactionResponse.map(function(obj){
          amount = amount + obj.amount
        })
      }
      response.data.withdrawableBalance = response.data.balance - amount;
      return res.json(response);
    } catch (error) {
      next(error);
    }
  });
};

exports.getTransactionCountWithinADay = async (req, res, next) => {
  func.checkUserAuthentication(req, res, async function (payload) {
    try {
      req.query.accountNumber = payload.sub;
      req.query.createdAt = { $gt: moment().subtract(24, 'hours') };
      req.query.operation = 'transfer'
      req.query.status = {
        $nin: ['failed']
      }
      const response = await findAllQuery(req.query);
      return res.json(response);
    } catch (error) {
      next(error);
    }
  });
};


exports.getBalanceAdmin = async (req, res, next) => {
  func.checkUserAuthentication(req, res, async function (payload) {
    try {
      const response = await getBalance(req.params.playerId);
      return res.json(response);
    } catch (error) {
      next(error);
    }
  });
};

exports.getWalletTransactions = async (req, res, next) => {
  func.checkUserAuthentication(req, res, async function (payload) {
    try {
      req.query.accountNumber = payload.sub;
      const response = await getWalletTransactions(req.query);
      return res.json(response);
    } catch (error) {
      next(error);
    }
  });
};

exports.getWalletTransactionsAdmin = async (req, res, next) => {
  func.checkUserAuthentication(req, res, async function (payload) {
    try {
      let query = {}
      if (!payload.admin.isSuperAdmin) {
        query.bettingCompanyId = payload.admin.bettingCompanyId
      }

      const response = await getWalletTransactionsAdmin(query);
      return res.json(response);
    } catch (error) {
      next(error);
    }
  });
};

exports.addToWallet = async (req, res, next) => {
  func.checkUserAuthentication(req, res, async function (payload) {
    var requestData = req.body;
    let currency;
    const conversionData = await func.getLocalCurrencyCoversionDetails(payload);
    if (requestData.amount <= 0) {
      return res
        .status(400)
        .send({ message: 'Amount must be greter than 0', status: false });
    } else {
      if (requestData.currency == 'BXC') {
        requestData.currency = 'BXC';
      } else {
        // requestData.currency = 'BXC';
      }

      let pgCharges = 0;

      const originalAmount = parseFloat(requestData.amount);

      if (conversionData.country.pgChargesType == 'percentage') {
        pgCharges = Math.ceil((originalAmount / (1 - conversionData.country.pgCharges)) - originalAmount)
      } else if (conversionData.country.pgChargesType == 'fixed') {
        pgCharges = conversionData.country.pgCharges;
      }

      // const networkCharges = func.getNetworkCharges(
      //   conversionData,
      //   originalAmount
      // );

      // Add the beyonic 0-1000 network charge
      const amountAfterCharges = originalAmount + pgCharges; // + networkCharges;

      requestData.amount = amountAfterCharges;
      requestData.metadata = requestData.metadata
        ? requestData.metadata
        : {
          type: 'ADD_TO_WALLET',
          originalAmount,
        };

      const apiToken = await func.getBeyonicAPIToken(payload.bettingCompanyId)

      request(
        {
          headers: {
            Authorization: `Token ${apiToken}`,
            'Postman-Token': 'c2248877-6307-d12e-f412-5413db619062',
          },
          method: 'POST',
          uri: `https://app.beyonic.com/api/collectionrequests`,
          json: requestData,
          gzip: true,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
        async function (error, response, body) {
          if (error) {
            console.error(error);
            return res.status(400).send({ error: error, status: false });
          } else {
            const creditResponse = await creditToWallet(
              payload.sub,
              payload.bettingCompanyId,
              originalAmount,
              amountAfterCharges,
              body.id
            );

            let collectionObj = new Collections({
              apiResponse: body,
              status: body.status,
              collectionId: body.id,
              userId: payload.sub,
              bettingCompanyId: payload.bettingCompanyId,
              phoneNumber: req.body.phonenumber,
              collectionType: requestData.metadata.type,
              walletId: creditResponse.wallet._id,
            });

            collectionObj.save((error, result) => {
              if (error) {
                return res.status(400).send({ error: error, status: false });
              }
              res.send(body);
            });
          }
        }
      );
    }
  });
};

exports.transferFromWalletToBank = async (req, res, next) => {
  func.checkUserAuthentication(req, res, async (payload) => {
    var userId = payload.sub;
    const { amount, phoneNumber, first_name, last_name } = req.body;

    const conversionDataPromise = func.getLocalCurrencyCoversionDetails(
      payload
    );

    const [conversionData] = await Promise.all([conversionDataPromise]);

    // Accept a phone number from the user
    // Make an API call to Beyonic for sending money
    // Take the response and send it back to the user...
    const originalAmount = amount;
    let pgPaymentCharges = 0;
    if (conversionData.country.pgPaymentChargesType === 'percentage') {
      pgPaymentCharges =
        originalAmount * conversionData.country.pgPaymentCharges;
    } else {
      pgPaymentCharges = conversionData.country.pgPaymentCharges;
    }

    // COnvert it to local amout...
    pgPaymentCharges = Math.ceil(pgPaymentCharges * conversionData.usd_rate);

    // MInus the network charges as well..

    const networkCharges = func.getNetworkCharges(
      conversionData,
      originalAmount
    );

    let amountAfterCharges = parseFloat(
      originalAmount - pgPaymentCharges - networkCharges
    ).toFixed(2);

    let walletResponse = await transferFromWallet(
      payload.sub,
      originalAmount,
      amountAfterCharges,
      '',
      'Transfer From Wallet To bank',
      false
    );

    console.log(walletResponse)

    if(walletResponse.status == false){
      return res.json({
        status: false,
        data: {},
        message: walletResponse.message
      });

    }
    const makePaymentRequest = {
      phonenumber: phoneNumber,
      first_name,
      last_name,
      currency: conversionData.code,
      amount: amountAfterCharges,
      description: 'Transfer from Wallet to bank',
      metadata: {
        type: 'wallet_transfer',
        id: walletResponse.wallet._id,
      },
    };
    const makePaymentResponse = await axios.post(
      'https://app.beyonic.com/api/payments',
      makePaymentRequest,
      {
        headers: {
          authorization: `Token e4c5ea0d17ad26ebb4ce2ef67c613791cfc0e527`,
        },
      }
    );

    walletResponse.wallet.reference = makePaymentResponse.data.id;
    await walletResponse.wallet.save();

    return res.json({
      status: true,
      data: {
        makePaymentResponse: makePaymentResponse.data,
      },
    });
  });
};
exports.payFromWallet = async (req, res, next) => {
  func.checkUserAuthentication(req, res, async function (payload) {
    // try {
    //   const response = await debitFromWallet(
    //     payload.sub,
    //     req.body.amount,
    //     req.body.reference,
    //     req.body.reason
    //   );
    //   return res.json(response);
    // } catch (error) {
    //   console.log(error.message);
    //   if (error.message === 'INSUFFICIENT_BALANCE') {
    //     return res.status(403).json({
    //       message: 'Insufficient Balance',
    //     });
    //   }
    // }
  });
};

exports.getAddToWalletAmount = async (req, res, next) => {
  func.checkUserAuthentication(req, res, async function (payload) {
    var requestData = req.body;
    let currency;
    const conversionData = await func.getLocalCurrencyCoversionDetails(payload);
    if (requestData.amount <= 0) {
      return res
        .status(400)
        .send({ message: 'Amount must be greter than 0', status: false });
    } else {
      if (requestData.currency == 'BXC') {
        requestData.currency = 'BXC';
      } else {
        // requestData.currency = 'BXC';
      }

      let pgCharges = 0;
      const originalAmount = parseFloat(requestData.amount);

      if (conversionData.country.pgChargesType == 'percentage') {
        pgCharges = Math.ceil((originalAmount / (1 - conversionData.country.pgCharges)) - originalAmount);
      } else if (conversionData.country.pgChargesType == 'fixed') {
        pgCharges = conversionData.country.pgCharges;
      }

      // const networkCharges = func.getNetworkCharges(
      //   conversionData,
      //   originalAmount
      // );

      // Add the beyonic 0-1000 network charge
      const amountAfterCharges = originalAmount + pgCharges; // + networkCharges;

      return res.json({
        status: true,
        data: {
          originalAmount,
          pgCharges,
          networkCharges: 0,
          amountAfterCharges,
        },
      });
    }
  });
};

exports.transferFromWalletToBankAmount = async (req, res, next) => {
  func.checkUserAuthentication(req, res, async (payload) => {
    const { amount } = req.body;

    const conversionDataPromise = func.getLocalCurrencyCoversionDetails(
      payload
    );

    const [conversionData] = await Promise.all([conversionDataPromise]);

    const originalAmount = amount;
    let pgPaymentCharges = 0;
    if (conversionData.country.pgPaymentChargesType === 'percentage') {
      pgPaymentCharges =
        originalAmount * conversionData.country.pgPaymentCharges;
    } else {
      pgPaymentCharges = conversionData.country.pgPaymentCharges;
    }
    pgPaymentCharges = Math.ceil(pgPaymentCharges * conversionData.usd_rate);

    const networkCharges = func.getNetworkCharges(
      conversionData,
      originalAmount
    );

    let amountAfterCharges = parseFloat(
      originalAmount - pgPaymentCharges - networkCharges
    ).toFixed(2);

    return res.json({
      status: true,
      data: {
        originalAmount,
        pgPaymentCharges,
        networkCharges,
        amountAfterCharges,
      },
    });
  });
};
