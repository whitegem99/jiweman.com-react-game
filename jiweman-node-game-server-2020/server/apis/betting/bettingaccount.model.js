const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let BettingAccountSchema = new Schema({
    username: {type: String, required: true, max: 100},
    password: {type: String, required: true, select: false},
    bettingcompid: {type: String, required: true},
    // bettingAccountId: {type: String, required: true},
    availablecash: {type: Number, required: false},
    currency: {type: String, required: false},
    availablerp: {type: Number, required: false}
});


// Export the model
let BettingAccount= mongoose.model('BettingAccount', BettingAccountSchema);

module.exports = {
    BettingAccount: BettingAccount
}