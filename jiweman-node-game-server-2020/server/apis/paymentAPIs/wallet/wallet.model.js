const mongoose = require('mongoose');

const { omitBy, isNil } = require('lodash');
const Player = require('../../playerAuth/player.model').Player;
const Schema = mongoose.Schema;

/**
 * Indicates type of operation
 */
const operations = ['debit', 'credit', 'transfer'];

/**
 * Wallet Schema
 * @private
 */
const walletSchema = new mongoose.Schema(
  {
    operation: {
      type: String,
      required: true,
      enum: operations,
    },
    accountNumber: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    amount: {
      type: Number,
      default: 0,
      required: true,
    },
    amountAfterCharges: {
      type: Number,
      default: 0,
      required: true,
    },
    balance: {
      type: Number,
      default: 0,
      required: true,
    },
    reference: {
      type: String,
    },
    reason: {
      type: String,
    },
    status: {
      type: String,
      enum: ['initiated', 'processing', 'successful', 'failed'],
      default: 'initiated',
      required: true,
    },
    bettingCompanyId: { type: Schema.Types.ObjectId, required: true },
    winnings:{
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
  }
);

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

// walletSchema.pre('save', async function save(next) {
//   this.wasNew = this.isNew;
//   return next();
// });

// walletSchema.post('save', async function save(doc, next) {
//   try {
//     if (this.wasNew) {
//       const currentPlayer = await Player.findOne({
//         _id: this.accountNumber,
//       });
//       currentPlayer.balance += this.amount;
//       currentPlayer.balance = currentPlayer.balance.toFixed(2);
//       const savedCustomer = await currentPlayer.save();
//     }

//     return next();
//   } catch (error) {
//     return next(error);
//   }
// });

/**
 * Methods
 */
walletSchema.method({
  transform() {
    const transformed = {};
    const fields = [
      'id',
      'accountNumber',
      'destinationAccountNumber',
      'operation',
      'amount',
      'reference',
      'createdAt',
      'winnings'
    ];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});

/**
 * Statics
 */
walletSchema.statics = {
  /**
   * List customers wallets in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of wallets to be skipped.
   * @param {number} limit - Limit number of wallets to be returned.
   * @returns {Promise<Wallet[]>}
   */
  list({ page = 1, perPage = 30, accountNumber }) {
    page = parseInt(page);
    perPage = parseInt(perPage);
    let options = omitBy({ accountNumber }, isNil);
    // if (accountNumber == masterAccount) {
    //   options = { operation: 'fee' };
    // }

    return this.find(options)
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },
};

const Wallet = mongoose.model('Wallet', walletSchema);

module.exports = { Wallet };
