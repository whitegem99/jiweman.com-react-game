let data = {}
let type = 'oneonone';

data.prize = [];
data.origianlEntryFee = 40
data.salesTax = 1.5
data.taxOnStakeOfBet = 0
data.jiwemanCommisionPercentage = 15
data.bettingCompanyCommisionPercentage = 0
data.gameCount = 2
data.winningTax = 0
// step 2 : entry fee/(1 + (tax on gross sale) + Tax On  Betting Stake)
if (data.origianlEntryFee) {

    data.entryFee = Math.ceil(data.origianlEntryFee);

    data.stakeAmount = (data.origianlEntryFee / (1 + (data.salesTax / 100) + (data.taxOnStakeOfBet / 100))).toFixed(2);

} else {
    data.stakeAmount = 0;
}

// step 4 : Tax On Gross Sale (Online Transaction) * step 2
let taxOnGrossSale = ((data.salesTax / 100) * data.stakeAmount).toFixed(2);

// step 5 : Tax On  Betting Stake * step 2
let taxOnBettingStake = ((data.taxOnStakeOfBet / 100) * data.stakeAmount).toFixed(2);

// step 3 : step 2 / (1 + Jiweman Betting Commission % + Betting Company Commission %)
let gameplayWinningsAmountToBeWonPerBet = (data.stakeAmount / (1 + (data.jiwemanCommisionPercentage / 100) + (data.bettingCompanyCommisionPercentage / 100))).toFixed(2);

// step 6 : Betting Company Commission % * step 3
let bettingCompanyCommission = parseFloat((data.jiwemanCommisionPercentage / 100) * gameplayWinningsAmountToBeWonPerBet).toFixed(2);

// step 7 : Jiweman Betting Commission % * step 3
let jiwemanBettingCommission = parseFloat((data.bettingCompanyCommisionPercentage / 100) * gameplayWinningsAmountToBeWonPerBet).toFixed(2);

// console.log('entryFee',data.origianlEntryFee);
// console.log("stakeAmount", data.stakeAmount);
// console.log("taxOnGrossSale",taxOnGrossSale);
// console.log("taxOnBettingStake",taxOnBettingStake)
// console.log("gameplayWinningsAmountToBeWonPerBet",gameplayWinningsAmountToBeWonPerBet)
// console.log("bettingCompanyCommission",bettingCompanyCommission);
// console.log("jiwemanBettingCommission",jiwemanBettingCommission);

// data.bettingCompanyCommisionPercentage = bettingCompanyCommission;
// data.jiwemanCommisionPercentage  = jiwemanBettingCommission;

data.bettingCompanyCommission = bettingCompanyCommission;
data.jiwemanCommision = jiwemanBettingCommission;
data.taxOnGrossSale = taxOnGrossSale;
data.taxOnBettingStake = taxOnBettingStake;
data.gameplayWinningsAmountToBeWonPerBet = gameplayWinningsAmountToBeWonPerBet;

if (type == 'oneonone') {
    // console.log('inside if 3747');
    var playerInvolve = 2;
    var noOfGames = data.gameCount;
    for (var i = 0; i <= noOfGames; i++) {
        position = i;
        if ((((gameplayWinningsAmountToBeWonPerBet * playerInvolve) / noOfGames) * position) > data.origianlEntryFee) {
            data.prize[i] = ((((gameplayWinningsAmountToBeWonPerBet * playerInvolve) / noOfGames) * position) - ((data.winningTax / 100) * (((gameplayWinningsAmountToBeWonPerBet * playerInvolve) / noOfGames) * position - data.origianlEntryFee))).toFixed(2);
            console.log(data.prize);
        }
        else {
            data.prize[i] = (((gameplayWinningsAmountToBeWonPerBet * playerInvolve) / noOfGames) * position).toFixed(2);
            console.log(data.prize);
        }
    }
}

console.log(data)