
const BettingAccount = require('../betting/bettingaccount.model').BettingAccount;
let sendResponse = require('../common/sendresponse');
var mocks = require('node-mocks-http');

exports.addrp =  async function  (req, res) {
    name = req.body.username;
    rp = req.body.rp;

   BettingAccount.findOne({ username: req.body.username }, function(err, user) {
    if ( err ){
         console.log(err);
    }
    if (user !== null ) {
      if ( user.availablecash >= rp) {
        user.availablecash = user.availablecash - rp;
        user.availablerp = user.availablerp + rp;
        console.log(user)
        user.save(function(err) {
            if(!err) {
                res.send('successfully credited RP');
            }
            else {
                console.log('Error: could not save contact '+err);
            }
        });
    } else {
        res.send('Insufficient cash available in your betting account');
    }
} else {

    return res.status(300).send({
        message: " invalid username",
        status: false
      });
   // res.send('invalid username or user is not registered with Betting company ');
}

    });
}



exports.convertrptocash =  async function  (req, res) {
    name = req.body.username;
    rp = req.body.rp;

   BettingAccount.findOne({ username: req.body.username }, function(err, user) {
    if ( err ){
         console.log(err);
    }
    if (user !== null )
    {
      if ( user.availablerp >= rp) {
        user.availablecash = user.availablecash + rp;
        user.availablerp = user.availablerp - rp;
        console.log(user)
        user.save(function(err) {
            if(!err) {
                res.send('redeem successful');
            }
            else {
                console.log('Error: could not save contact '+err);
            }
        });
    } else {
        res.send('Insufficient Rps available in your account');
    }
} else {
    res.send('invalid username or user is not registered with Betting company ');
}

});
}


exports.addAmountToBettingAccount =  async function  (req, res) {
    name = req.body.username;
    bettingcompid = req.body.bettingcompid;
    amount = req.body.amount;
   BettingAccount.findOne(
       { 
        username: req.body.username , 
        bettingcompid: bettingcompid 
    }, function(err, user) {
    if ( err ){
         console.log(err);
    }
    if ( user !== null) {
        user.availablecash = user.availablecash + amount;
        user.save(function(err) {
            if(!err) {
                res.send('successfully credited Amount to betting Account');
            }
            else {
                console.log('Error: could not credit '+err);
            }
        });
} else {
    res.send('invalid username or user is not registered with Betting company ');
}

    });
}


exports.debitRPforBettingGame = async function ( inputData) {
    const findData= {
        username : inputData.username,
        bettingcompid : inputData.bettingcompid
    }
    let entryFee=  inputData.entryFee;

    BettingAccount.findOne(findData,{ password: 0 }, async function(err, user) {
        if (err){
          let msg = '';
          sendResponse.sendErrorMessage(msg, res);
        }
        if (user)
        {
          if ( user.availablerp >= entryFee) {
            user.availablerp = user.availablerp - entryFee;
            console.log(user)
            user.save(function(err) {
                if(!err) {
                   return('success');
                }
                else {
                    sendResponse.sendErrorMessage('Error: could not save contact ', user);
                }
            });
        } else {
            const res = mocks.createResponse();
            res.send('error')
            // sendResponse.sendErrorMessage('Insufficient Rps available in your account', res);
        }
    }
    });

}