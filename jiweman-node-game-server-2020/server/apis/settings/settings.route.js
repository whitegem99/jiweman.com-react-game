const express = require('express');
const router = express.Router();
var multer = require('multer');

const settingsController = require('./settings.controller');

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../server/public/apk/');
    // cb(null, '/Users/ravideshmukh/Downloads');
  },
  filename: (req, file, cb) => {
    cb(null, 'jogabonitobuild.apk');
  },
});
var upload = multer({ storage: storage });

router.post(
  '/uploadApk',
  upload.single('gameApk'),
  settingsController.uploadApk
);
router.post(
  '/editAppSupportedVersion',
  settingsController.editAppSupportedVersion
);

router.get(
    '/getapp',
    settingsController.getApk
  );

module.exports = router;
