let func = require('../common/commonfunction');
var ObjectID = require('mongodb').ObjectID;
let {
  League,
  LeagueWinners,
  prizePercentages,
} = require('../league/league.model');

/*
 * --------------------------------------------------------------------------
 * get Prize Percentage  API start
 * ---------------------------------------------------------------------------
 */

// add
exports.addPrizePercentage = (req, res, next) => {
  func.checkUserAuthentication(req, res, function (payload) {
    var obj = new prizePercentages(req.body);

    obj.save((err, data) => {
      if (err) {
        console.log(err.message);
        res.send({
          status: false,
          message: 'something went wrong',
          error: err.message,
        });
      } else {
        res.json({
          status: true,
          message: 'data added successfully',
          data: data,
        });
      }
    });
  });
};

// get
exports.getPrizePercentage = (req, res, next) => {
  func.checkUserAuthentication(req, res, function (payload) {
    prizePercentages
      .find({})
      .sort({
        position: 1,
      })
      .exec((err, data) => {
        if (err) {
          res.send({
            status: false,
            message: 'something went wrong',
          });
        } else {
          res.json({
            status: true,
            message: 'data found',
            data: data,
          });
        }
      });
  });
};

// update
exports.updatePrizePercentage = (req, res, next) => {
  func.checkUserAuthentication(req, res, function (payload) {
    prizePercentages
      .findByIdAndUpdate(
        { _id: req.params.id },
        { $set: req.body },
        { new: true }
      )
      .exec(function (err, updatedData) {
        if (err) {
          res.send({
            status: false,
            message: 'something went wrong',
          });
        } else {
          res.json({
            status: true,
            message: 'data updated successfully',
            data: updatedData,
          });
        }
      });
  });
};

// remove
exports.removePrizePercentage = (req, res, next) => {
  func.checkUserAuthentication(req, res, function (payload) {
    prizePercentages
      .findByIdAndRemove({ _id: req.params.id })
      .exec(function (err, update) {
        if (err) {
          res.send({
            status: false,
            message: 'something went wrong',
          });
        } else {
          res.json({
            status: true,
            message: 'data deleted successfully',
          });
        }
      });
  });
};
