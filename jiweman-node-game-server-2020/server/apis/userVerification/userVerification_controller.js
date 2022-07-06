
const mime = require('mime');
const func = require('../common/commonfunction');
const Counter = require('../settings/settings.model').Counter;
const config = require('../../config');
const UserVerification = require('./userVerification_model').UserVerification;
const Player = require('../playerAuth/player.model').Player;
var fs = require('fs');


exports.create = async (req, res, next) => {
  func.checkUserAuthentication(req, res, async function (payload) {

    var loggedInplayerId = payload.sub;

    var data = req.body;
    var obj = UserVerification({
      id_type: data.id_type,
      bettingCompanyId: payload.bettingCompanyId,
      id_number: data.id_number,
      id_photo: data.url,
      selfie: data.selfie,
      status: "pending"
    })

    obj.save(async function (err, data) {

      await Player.findOneAndUpdate({ _id: loggedInplayerId }, { $set: { verificationId: data._id } })

      res.json({
        status: 200,
        message: 'Data saved',
        data: data,
      });
    })

  })
}


exports.uploadFile = async (req, res, next) => {
  // to declare some path to store your converted image
  var matches = req.body.base64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
    response = {};
  if (matches.length !== 3) {
    return new Error('Invalid input string');
  }

  response.type = matches[1];
  response.data = new Buffer(matches[2], 'base64');
  let decodedImg = response;
  let imageBuffer = decodedImg.data;
  let type = decodedImg.type;
  let extension = mime.getExtension(type);
  let fileName = `${req.body.name}`;

  try {
    // var getCount = await Counter.findOne({ name: 'id_number' });
    var obj = {};

    if (!fs.existsSync('../server/public/uploads/user_data/')) {
      fs.mkdirSync('../server/public/uploads/user_data/');
      console.log('dir created ... ' + 'user_data');
    }

    // if (!fs.existsSync(`../server/public/uploads/user_data/${getCount.value}`)) {
    //   fs.mkdirSync(`../server/public/uploads/user_data/${getCount.value}`);
    //   console.log('dir created ... ' + 'user_data');
    // }

    const timestamp = +new Date

    let url = `${config.BASE_URL.replace(
      'api',
      ''
    )}uploads/user_data/${timestamp}_${fileName}`;


    fs.writeFileSync(
      `../server/public/uploads/user_data/` + timestamp + '_' + fileName,
      imageBuffer,
      'utf8'
    );
    // getCount.value = getCount.value + 1;
    // getCount.save();
    return res.json({ success: 'true', url: url });
  } catch (e) {
    next(e);
  }
}



exports.updateStatus = async (req, res, next) => {
  let getId = req.query.userverifyId;
  func.checkUserAuthentication(req, res, async function (payload) {
    try {
      var updatedData = await UserVerification.findByIdAndUpdate({ _id: getId }, { $set: { status: "verified" } }, { new: true })

      return res.json({ success: 'true', message: 'status updated to verifed', data: updatedData });
    }
    catch (e) {
      return res.status(400).send({ error: e, status: false });
    }
  })
}


exports.show = async (req, res, next) => {
  func.checkUserAuthentication(req, res, async function (payload) {
    var page = _.isEmpty(req.query.page) ? 0 : parseInt(req.query.page);
    var limit = _.isEmpty(req.query.limit) ? 2 : parseInt(req.query.limit);
    var query = { status: "pending" };
    
    if (!payload.admin.isSuperAdmin) {
      query.bettingCompanyId = payload.admin.bettingCompanyId
    }

    var options = {
      sort: { date: -1 },
      lean: true,
      offset: page * limit,
      limit: limit,
    };

    UserVerification.paginate(query, options).then(async (data) => {

      var getUserIds = data.docs.map(info => info._id);
      // if (_.isEmpty(getUserIds)) {
      //   return res.status(400).send({
      //     message: "No Data Found",
      //     status: false,
      //   });
      // }
      var playerData = await Player.find({ verificationId: { $in: getUserIds } }).populate('verificationId').lean();
      data.docs = playerData;
      res.json(data);
    });
  });
};






