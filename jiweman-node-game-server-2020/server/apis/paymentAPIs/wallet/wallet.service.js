const { Wallet } = require('./wallet.model');
const { Player } = require('../../playerAuth/player.model');
const moment = require('moment')

exports.creditToWallet = async (
  accountNumber,
  bettingCompanyId,
  amount,
  amountAfterCharges,
  reference,
  reason = 'Add To Wallet',
  status = 'initiated',
  winnings = false
) => {
  // const checkWallet = await Wallet.find({
  //   reference: reference,
  // });

  // console.log(accountNumber, amount, reference, checkWallet);

  // if (checkWallet.length) {
  //   throw new Error('ALREADY_EXISTS');
  // }

  const currentCustomer = await Player.findOne({
    _id: accountNumber,
  });

  const wallet = new Wallet();
  wallet.amount = amount;
  wallet.amountAfterCharges = amountAfterCharges;
  wallet.operation = 'credit';
  wallet.accountNumber = accountNumber;
  wallet.bettingCompanyId = bettingCompanyId;
  wallet.reference = reference;
  wallet.reason = reason;
  wallet.status = status;
  wallet.winnings = winnings;
  wallet.balance = currentCustomer.balance + amount;
  const savedWallet = await wallet.save();

  if (status === 'successful') {
    await this.updateWalletBalance(wallet.accountNumber, wallet.amount);
  }

  const response = {
    wallet: savedWallet,
    balance: currentCustomer.balance,
    currency: currentCustomer.userCurrency,
  };
  return response;
};

exports.debitFromWallet = async (
  accountNumber,
  amount,
  amountAfterCharges,
  reference,
  reason = 'Pay From Wallet',
  status = 'initiated',
  winnings = false
) => {
  let currentCustomer = await Player.findOne({
    _id: accountNumber,
  });

  if (currentCustomer.balance - amount < 0) {
    throw new Error('INSUFFICIENT_BALANCE');
  }

  const wallet = new Wallet();
  wallet.amount = -amount;
  wallet.amountAfterCharges = amountAfterCharges;
  wallet.operation = 'debit';
  wallet.accountNumber = accountNumber;
  wallet.bettingCompanyId = currentCustomer.bettingCompanyId;
  wallet.reference = reference;
  wallet.reason = reason;
  wallet.status = status;
  wallet.winnings = winnings;
  wallet.balance = currentCustomer.balance - amount;
  const savedWallet = await wallet.save();

  if (status === 'successful') {
    // minus in balance...update account balance...
    this.updateWalletBalance(wallet.accountNumber, wallet.amount);
  }

  currentCustomer = await Player.findOne({
    _id: accountNumber,
  });

  const response = {
    wallet: savedWallet,
    balance: currentCustomer.balance,
    currency: currentCustomer.userCurrency,
  };
  return response;
};

exports.transferFromWallet = async (
  accountNumber,
  amount,
  amountAfterCharges,
  reference,
  reason = 'Transfer From Wallet',
  winnings = false
) => {

  let currentCustomer = await Player.findOne({
    _id: accountNumber,
  });

  let currDate = moment();
  let startdate = currDate.subtract(2, "days");
  let query = {}

  query.accountNumber = accountNumber;
  query.winnings = true;
  query.createdAt = {
    $gt: startdate.toDate(),
  }

  const transactionResponse = await Wallet.find(query);

  // Calculate amount won in last two days (48 Hours).
  let withDrawAmount = 0
  if (transactionResponse.length) {
    transactionResponse.map(function (obj) {
      withDrawAmount = withDrawAmount + obj.amount
    })
  }
  let withdrawableBalance = currentCustomer.balance - withDrawAmount;

  console.log(withdrawableBalance)

  let response = {}
  if (withdrawableBalance - amount < 0) {

    response = {
      status: false,
      message: "Not enough funds to withdraw.",
      wallet: null,
      balance: withdrawableBalance,
      currency: currentCustomer.userCurrency,
    };

  } else {

    const wallet = new Wallet();
    wallet.amount = -amount;
    wallet.amountAfterCharges = amountAfterCharges;
    wallet.operation = 'transfer';
    wallet.accountNumber = accountNumber;
    wallet.bettingCompanyId = currentCustomer.bettingCompanyId;
    wallet.reference = reference;
    wallet.reason = reason;
    wallet.winnings = winnings;
    wallet.balance = currentCustomer.balance - amount;
    const savedWallet = await wallet.save();

    await this.updateWalletBalance(wallet.accountNumber, wallet.amount);

    currentCustomer = await Player.findOne({
      _id: accountNumber,
    });

    response = {
      status: true,
      message: "",
      wallet: savedWallet,
      balance: currentCustomer.balance,
      currency: currentCustomer.userCurrency,
    };

  }


  return response;
};

exports.updateWalletStatus = async (id, status, updateBalance = false) => {
  const foundTransaction = await Wallet.findById(id);
  foundTransaction.status = status;
  await foundTransaction.save();
  if (updateBalance) {
    const amountToUpdate = foundTransaction.amount;
    await this.updateWalletBalance(
      foundTransaction.accountNumber,
      amountToUpdate
    );
  }
  return await Wallet.findById(id);
};

exports.updateWalletBalance = async (account, amount) => {
  const currentPlayer = await Player.findOne({
    _id: account,
  });

  if (!currentPlayer.balance) {
    currentPlayer.balance = 0;
  }

  currentPlayer.balance += amount;
  currentPlayer.balance = currentPlayer.balance.toFixed(2);
  const savedCustomer = await currentPlayer.save();
  return savedCustomer;
};

exports.getWalletTransactions = async (query) => {
  console.log("here")
  console.log(query)
  const transactions = await Wallet.find(query);
  return transactions;
};

exports.getWalletTransactionsAdmin = async (query) => {
  const transactions = Wallet.find(query).populate('User');
  console.log(transactions);
  return transactions;
};

exports.findAllQuery = async (query) => {
  const transactions = await Wallet.find(query);
  return transactions;
};

exports.getBalance = async (accountNumber) => {
  const currentCustomer = await Player.findOne({
    _id: accountNumber,
  });

  const response = {
    status: true,
    message: "data found",
    data: {
      balance: currentCustomer.balance,
      currency: currentCustomer.userCurrency,
    }
  };
  return response;
};
