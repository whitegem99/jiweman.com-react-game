const { AppVersion } = require('./settings.model');
var config = require('../../config');
let func = require('../common/commonfunction');

exports.uploadApk = async (req, res) => {
  func.checkUserAuthentication(req, res, async function (payload) {
    console.log(req.file, req.body);

    if (
      !req.file ||
      !req.file.mimetype ||
      req.file.mimetype !== 'application/vnd.android.package-archive'
    ) {
      return res.status(400).json({
        status: 400,
        message: 'Invalid File',
      });
    }

    if (req.body.appVersion && req.body.supportedVersion) {
      // Do nothing
    } else {
      return res.status(400).json({
        status: 400,
        message: 'Bad Request',
      });
    }

    const insertData = {
      appLink: `${config.BASE_URL.replace('api', '')}uploads/apk/${
        req.file.filename
      }`,
      appVersion: req.body.appVersion,
      supportedVersion: req.body.supportedVersion,
    };

    const insertedData = await AppVersion.create(insertData);
    return res.json({
      status: 200,
      message: 'Uploaded Successfully',
      data: insertedData,
    });
  });
};

exports.editAppSupportedVersion = async (req, res) => {
  func.checkUserAuthentication(req, res, async function (payload) {
    if (req.body._id && req.body.supportedVersion) {
      // Do nothing
    } else {
      return res.status(400).json({
        status: 400,
        message: 'Bad Request',
      });
    }

    const updateData = {
      supportedVersion: req.body.supportedVersion,
    };

    const insertedData = await AppVersion.findOneAndUpdate(
      {
        _id: req.body._id,
      },
      updateData,
      { new: true }
    );

    return res.json({
      status: 200,
      message: 'Updated Successfully',
      data: insertedData,
    });
  });
};

exports.getApk = async (req, res) => {
  // func.checkUserAuthentication(req, res, function (payload) {

  const data = await AppVersion.find().sort({ createdAt: -1 }).limit(1);

  return res.json({
    status: 200,
    message: 'App List',
    data: data,
  });

  //});
};
