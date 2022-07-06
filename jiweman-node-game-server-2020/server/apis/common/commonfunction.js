/*
 * --------------------------------------------------------------------------
 * Created by Barquecon Technologies on 12/03/2019 by Dipak Adsul
 * ---------------------------------------------------------------------------
 */

let sendResponse = require('../common/sendresponse');
const jwt = require('jwt-simple');
let moment = require('moment');
let config = require('../../config');
var nodemailer = require('nodemailer');
const axios = require('axios').default;
let { PythonShell } = require('python-shell');
var ObjectID = require('mongodb').ObjectID;
var _ = require('lodash');

// model imports
let Role = require('../playerAuth/player.model').Role;
let Player = require('../playerAuth/player.model').Player;
let Admin = require('../admin/admin.model').Admin;
// let BettingCompany = require('../betting/betting.model').BettingCompany;
let Formation = require('../formations/formations.model').Formation;
let Gamestadium = require('../stadium/stadium.model').Gamestadium;
let MatchPlay = require('../matchPlay/matchplay.model').MatchPlay;
let Match = require('../matchPlay/matchplay.model').Match;
let Point = require('../points/points.model').Point;
var playerLeague = require('../playerLeague/playerLeague.model').playerLeague;
const { playerBet } = require('../playerOneVSOneBet/playerOneVSOneBet.model');
const { creditToWallet } = require('../paymentAPIs/wallet/wallet.service');
const winston = require('winston');
const { ElasticsearchTransport } = require('winston-elasticsearch');
const ecsFormat = require('@elastic/ecs-winston-format')
const { ElasticsearchTransformer } = require('winston-elasticsearch');

const esTransportOpts = {
  level: 'info',
  clientOpts: {
    node: "http://142.93.196.90:9200",
    auth:{
      username: 'elastic',
      password: '7Kdh97kCc0eqBecCNzhd'
    }
  },
  transformer: (logData) => {
    const transformed = ElasticsearchTransformer(logData);
    transformed.requestData = JSON.stringify(logData.meta.req)
    transformed.responseData = JSON.stringify(logData.meta.res)
    transformed.env = JSON.stringify(logData.meta.env)
    console.log(logData)
    return transformed;
  }
};

const esTransport = new ElasticsearchTransport(esTransportOpts);

const logger = winston.createLogger({
  level: 'info',
  format: ecsFormat({ convertReqRes: true }),
  transports: [
    esTransport
  ]
});

esTransport.on('warning', (error) => {
  console.error('Error caught', error);
});

let {
  League,
  LeagueWinners,
  prizePercentages,
  currencydata
} = require('../league/league.model');
const shortid = require('shortid');
const { OneOnOne } = require('../oneonone/oneonone.model');
const { bettingCompany } = require('../bettingCompany/bettingCompany.model');

const allowedCountries = [
  {
    name: 'Rwanda',
    currency: 'RWF',
    beyonicCountryId: 7,
    supportedNetworks: 'MTN, TIGO',
    pgCharges: 0.035,
    pgChargesType: 'percentage',
    pgPaymentCharges: 0.07,
    pgPaymentChargesType: 'fixed',
    networkCharges: [
      {
        min: 0,
        max: 1000,
        charge: 15,
      },
      {
        min: 1001,
        max: 9999999999,
        charge: 22,
      },
    ],
  },
  {
    name: 'Ghana',
    currency: 'GHS',
    beyonicCountryId: 5,
    supportedNetworks: 'MTN, Airtel, Vodafone, Expresso, Globacom, Tigo',
    pgCharges: 0.03,
    pgChargesType: 'percentage',
    pgPaymentCharges: 0.07,
    pgPaymentChargesType: 'fixed',
    networkCharges: [
      {
        min: 0,
        max: 1000,
        charge: 15,
      },
      {
        min: 1001,
        max: 9999999999,
        charge: 22,
      },
    ],
  },
  {
    name: 'Kenya',
    currency: 'KES',
    beyonicCountryId: 3,
    supportedNetworks: 'Safaricom MPESA',
    pgCharges: 0.03,
    pgChargesType: 'percentage',
    pgPaymentCharges: 0.07,
    pgPaymentChargesType: 'fixed',
    networkCharges: [
      {
        min: 0,
        max: 1000,
        charge: 15,
      },
      {
        min: 1001,
        max: 9999999999,
        charge: 22,
      },
    ],
  },
  {
    name: 'Uganda',
    currency: 'UGX',
    beyonicCountryId: 2,
    supportedNetworks: 'MTN, Airtel, UTL, Africell',
    pgCharges: 0.04,
    pgChargesType: 'percentage',
    pgPaymentCharges: 0.07,
    pgPaymentChargesType: 'fixed',
    networkCharges: [
      {
        min: 0,
        max: 1000,
        charge: 15,
      },
      {
        min: 1001,
        max: 9999999999,
        charge: 22,
      },
    ],
  },
  {
    name: 'Tanzania',
    currency: 'TZS',
    beyonicCountryId: 6,
    supportedNetworks: 'Vodacom (MPESA), Airtel, TIGO, Halotel',
    pgCharges: 0.035,
    pgChargesType: 'percentage',
    pgPaymentCharges: 0.07,
    pgPaymentChargesType: 'fixed',
    networkCharges: [
      {
        min: 0,
        max: 1000,
        charge: 15,
      },
      {
        min: 1001,
        max: 9999999999,
        charge: 22,
      },
    ],
  },
];

exports.allowedCountries = allowedCountries;
/*
 * ------------------------------------------------------
 * Check if manadatory fields are not filled
 * INPUT : array of field names which need to be mandatory
 * OUTPUT : Error if mandatory fields not filled
 * ------------------------------------------------------
 */
exports.checkBlank = function (res, manValues, callback) {
  let checkBlankData = checkBlank(manValues);

  if (checkBlankData) {
    sendResponse.parameterMissingError(res);
  } else {
    callback(null);
  }
};

function checkBlank(arr) {
  let arrlength = arr.length;

  for (let i = 0; i < arrlength; i++) {
    if (arr[i] == '') {
      return 1;
      break;
    } else if (arr[i] == undefined) {
      return 1;
      break;
    } else if (arr[i] == '(null)') {
      return 1;
      break;
    }
  }
  return 0;
}

/*
 * --------------------------------------------------------------------------
 * Start of Tokanization
 * ---------------------------------------------------------------------------
 */

exports.createToken = function (player) {
  
  let payload = {
    sub: player._id,
    iat: moment().unix(),
  };

  if(player.accountType == "observer"){

    payload.exp = moment().add(30, 'days').unix()

  }else{

    payload.exp = moment().add(1, 'days').unix()

  }

  return jwt.encode(payload, config.TOKEN_SECRET);
};

exports.decodeToken = function (token) {
  return jwt.decode(token, config.TOKEN_SECRET);
};

exports.invalidateToken = function (users) {
  let payload = {
    sub: users._id,
    iat: moment().unix(),
    exp: moment().unix(),
  };
  return jwt.encode(payload, config.TOKEN_SECRET);
};

/*
 * --------------------------------------------------------------------------
 * Start of Decoding token
 * ---------------------------------------------------------------------------
 */

exports.checkUserAuthentication = async function (req, res, next) {
  console.log('**************************', req.headers);
  if (!req.headers.authorization) {
    return res.status(401).send({ message: 'Unauthorized', status: false });
  }
  try {
    var token = req.headers.authorization.split(' ')[1];

    if (req.headers['req-source'] === 'WebLogin') {
      var playerToken = await Player.findOne({ webToken: token });
    } else {
      var playerToken = await Player.findOne({ token: token });
    }

    var adminToken = await Admin.findOne({ token: token });

    // console.log(playerToken);
    console.log(adminToken);
    if (playerToken || adminToken) {
      var payload = jwt.decode(token, config.TOKEN_SECRET);
      let bettingCompanyId = null;
      if (playerToken) {
        bettingCompanyId = playerToken.bettingCompanyId
      }
      if (adminToken) {
        bettingCompanyId = adminToken.bettingCompanyId
      }
      payload = { ...payload, player: playerToken, admin: adminToken, bettingCompanyId }
      if ((adminToken && payload.exp <= moment().unix()) || (playerToken && playerToken.accountType != "observer" && payload.exp <= moment().unix())) {
        return res.status(440).send({
          message: 'Login Time-out',
          status: false,
        });
      }
      
    } else {
      return res.status(401).send({
        error: {
          message: 'you are already logged in on other device',
          code: 'invalid_token',
          status: 401,
          inner: {},
        },
      });
    }
  } catch (err) {
    if (err) {
      console.log(err);
      // sendResponse.invalidAccessTokenError(res);
      return res.status(401).send({
        error: {
          message: 'Invalid access token',
          code: 'invalid_token',
          status: 401,
          inner: {},
        },
      });
    }
  }
  next(payload);
};

/*
 * --------------------------------------------------------------------------
 * Start of Manage Validaton
 * ---------------------------------------------------------------------------
 */
exports.manageValidationMessages = function (reqData) {
  if (reqData.length > 0) {
    for (let i = 0; i < reqData.length; i++) {
      if (reqData[i]['msg'] != '') {
        return reqData[i]['msg'];
      }
    }
  } else {
    return '';
  }
};

/*
 * --------------------------------------------------------------------------
 * Creater Default user start
 * ---------------------------------------------------------------------------
 */

exports.createDefaultRoles = function (next) {
  var roleNames = [
    {
      roleName: 'superAdmin',
    },
    {
      roleName: 'Admin',
    },
    {
      roleName: 'player',
    },
    {
      roleName: 'bettingCompanyAdmin',
    },
  ];
  var ctr = 0;
  roleNames.forEach(function (singleRole) {
    // console.log("==========", singleRole)
    Role.updateOne(
      {
        roleName: singleRole.roleName,
      },
      singleRole,
      {
        upsert: true,
      },
      function (err, updated) {
        ctr++;
        if (err) {
          let msg = 'some error occurred';
          sendResponse.sendErrorMessage(msg, res);
        } else {
          if (ctr == roleNames.length) {
            next();
          }
        }
      }
    );
  });
};

/*
 * --------------------------------------------------------------------------
 * Check user role Name start
 * ---------------------------------------------------------------------------
 */

exports.checkUserRoleName = function (userId, next) {
  Player.findOne(
    {
      _id: userId,
    },
    function (err, userData) {
      if (err) {
        res.status(200).send({
          message: 'Some error occurred',
          status: false,
        });
      } else {
        if (userData == null) {
          res.status(404).send({
            message: 'User Not found',
            status: false,
          });
        } else {
          // console.log('=-=-=-=-=-=-=-', userRole)
          Role.findOne(
            {
              _id: userData.roleId,
            },
            function (err, roleData) {
              if (err) {
                sendResponse.parameterMissingError(err);
              } else {
                if (roleData == null) {
                  res.status(404).send({
                    message: 'Not found',
                    status: false,
                  });
                } else {
                  next(roleData.roleName);
                }
              }
            }
          );
        }
      }
    }
  );
};

/*
 * --------------------------------------------------------------------------
 * Check user role Name start
 * ---------------------------------------------------------------------------
 */
exports.checkBettingUserRoleName = function (userId, next) {
  BettingCompany.findOne(
    {
      _id: userId,
    },
    function (err, userData) {
      if (err) {
        res.status(200).send({
          message: 'Some error occurred',
          status: false,
        });
      } else {
        if (userData == null) {
          res.status(404).send({
            message: 'User Not found',
            status: false,
          });
        } else {
          // console.log('=-=-=-=-=-=-=-', userRole)
          Role.findOne(
            {
              _id: userData.roleId,
            },
            function (err, roleData) {
              if (err) {
                sendResponse.parameterMissingError(res);
              } else {
                if (roleData == null) {
                  res.status(404).send({
                    message: 'Not found',
                    status: false,
                  });
                } else {
                  next(roleData.roleName);
                }
              }
            }
          );
        }
      }
    }
  );
};

/*
 * --------------------------------------------------------------------------
 * Create Default Formations
 * ---------------------------------------------------------------------------
 */

exports.createDefaultFormations = function (next) {
  let formations = [
    {
      formationName: '5-0-0',
      formationType: 'defensive',
      indexNumber: 1,
      points: 700,
      imgUrl: '/uploads/images/5-0-0.png',
      disks: [
        {
          diskName: 'd1',
          Y: '3.61',
          X: '-11.37',
          Z: '0',
        },
        {
          diskName: 'd2',
          Y: '-6.8',
          X: '-11.37',
          Z: '0',
        },
        {
          diskName: 'd3',
          Y: '-4.45',
          X: '-9.04',
          Z: '0',
        },
        {
          diskName: 'd4',
          Y: '1.5',
          X: '-9.04',
          Z: '0',
        },
        {
          diskName: 'd5',
          Y: '-1.5',
          X: '-9.04',
          Z: '0',
        },
      ],
      uiDisks: [
        {
          uidiskName: 'uid1',
          Y: '0',
          X: '-85',
          Z: '0',
        },
        {
          uidiskName: 'uid2',
          Y: '55',
          X: '-85',
          Z: '0',
        },
        {
          uidiskName: 'uid3',
          Y: '110',
          X: '-130',
          Z: '0',
        },
        {
          uidiskName: 'uid4',
          Y: '-55',
          X: '-85',
          Z: '0',
        },
        {
          uidiskName: 'uid5',
          Y: '-100',
          X: '-130',
          Z: '0',
        },
      ],
    },
    {
      formationName: '5-0-0',
      formationType: 'defensive',
      indexNumber: 2,
      points: 700,
      imgUrl: '/uploads/images/5-0-0-1.png',
      disks: [
        {
          diskName: 'd1',
          X: '-12.08',
          Y: '-1.53',
          Z: '0',
        },
        {
          diskName: 'd2',
          Y: '1.09',
          X: '-12.08',
          Z: '0',
        },
        {
          diskName: 'd3',
          X: '-12.08',
          Y: '-4.22',
          Z: '0',
        },
        {
          diskName: 'd4',
          Y: '-2.76',
          X: '-9.12',
          Z: '0',
        },
        {
          diskName: 'd5',
          Y: '-7.08',
          X: '-9.12',
          Z: '0',
        },
      ],
      uiDisks: [
        {
          uidiskName: 'uid1',
          Y: '0',
          X: '-142',
          Z: '0',
        },
        {
          uidiskName: 'uid2',
          Y: '-55',
          X: '-142',
          Z: '0',
        },
        {
          uidiskName: 'uid3',
          Y: '55',
          X: '-142',
          Z: '0',
        },
        {
          uidiskName: 'uid4',
          Y: '-27',
          X: '-77',
          Z: '0',
        },
        {
          uidiskName: 'uid5',
          Y: '27',
          X: '-77',
          Z: '0',
        },
      ],
    },
    {
      formationName: '4-0-1',
      formationType: 'defensive',
      indexNumber: 3,
      points: 700,
      imgUrl: '/uploads/images/4-0-1.png',
      disks: [
        {
          diskName: 'd1',
          Y: '-2.71',
          X: '-11.09',
          Z: '0',
        },
        {
          diskName: 'd2',
          Y: '-0.14',
          X: '-11.09',
          Z: '0',
        },
        {
          diskName: 'd3',
          Y: '-4.64',
          X: '-12.73',
          Z: '0',
        },
        {
          diskName: 'd4',
          Y: '1.84',
          X: '-12.73',
          Z: '0',
        },
        {
          diskName: 'd5',
          Y: '-1.5',
          X: '-1.97',
          Z: '0',
        },
      ],
      uiDisks: [
        {
          uidiskName: 'uid1',
          Y: '-20',
          X: '-113',
          Z: '0',
        },
        {
          uidiskName: 'uid2',
          Y: '35',
          X: '-113',
          Z: '0',
        },
        {
          uidiskName: 'uid3',
          Y: '-63',
          X: '-145',
          Z: '0',
        },
        {
          uidiskName: 'uid4',
          Y: '79',
          X: '-145',
          Z: '0',
        },
        {
          uidiskName: 'uid5',
          Y: '0',
          X: '132',
          Z: '0',
        },
      ],
    },
    {
      formationName: '3-0-2',
      formationType: 'defensive',
      indexNumber: 4,
      points: 700,
      imgUrl: '/uploads/images/3-0-2.png',
      disks: [
        {
          diskName: 'd1',
          Y: '-4.13',
          X: '-12.54',
          Z: '0',
        },
        {
          diskName: 'd2',
          Y: '-1.57',
          X: '-12.54',
          Z: '0',
        },
        {
          diskName: 'd3',
          Y: '1.05',
          X: '-12.54',
          Z: '0',
        },
        {
          diskName: 'd4',
          Y: '4.65',
          X: '-4.25',
          Z: '0',
        },
        {
          diskName: 'd5',
          Y: '-7.6',
          X: '-4.25',
          Z: '0',
        },
      ],
      uiDisks: [
        {
          uidiskName: 'uid1',
          Y: '0',
          X: '-145',
          Z: '0',
        },
        {
          uidiskName: 'uid2',
          Y: '-55',
          X: '-145',
          Z: '0',
        },
        {
          uidiskName: 'uid3',
          Y: '55',
          X: '-145',
          Z: '0',
        },
        {
          uidiskName: 'uid4',
          Y: '-125',
          X: '90',
          Z: '0',
        },
        {
          uidiskName: 'uid5',
          Y: '125',
          X: '90',
          Z: '0',
        },
      ],
    },
    {
      formationName: '4-0-0',
      formationType: 'defensive',
      indexNumber: 5,
      points: 700,
      imgUrl: '/uploads/images/4-0-0.png',
      disks: [
        {
          diskName: 'd1',
          Y: '-1.5',
          X: '-13.05',
          Z: '0',
        },
        {
          diskName: 'd2',
          Y: '-3.72',
          X: '-8.47',
          Z: '0',
        },
        {
          diskName: 'd3',
          Y: '0.91',
          X: '-8.47',
          Z: '0',
        },
        {
          diskName: 'd4',
          Y: '-7.43',
          X: '-8.47',
          Z: '0',
        },
        {
          diskName: 'd5',
          Y: '4.37',
          X: '-8.47',
        },
      ],
      uiDisks: [
        {
          uidiskName: 'uid1',
          Y: '0',
          X: '-146',
          Z: '0',
        },
        {
          uidiskName: 'uid2',
          Y: '130',
          X: '-35',
          Z: '0',
        },
        {
          uidiskName: 'uid3',
          Y: '50',
          X: '-35',
          Z: '0',
        },
        {
          uidiskName: 'uid4',
          Y: '-50',
          X: '-35',
          Z: '0',
        },
        {
          uidiskName: 'uid5',
          Y: '-130',
          X: '-35',
          Z: '0',
        },
      ],
    },
    {
      formationName: '3-1-0',
      formationType: 'defensive',
      indexNumber: 6,
      points: 700,
      imgUrl: '/uploads/images/3-1-0.png',
      disks: [
        {
          diskName: 'd1',
          Y: '-1.5',
          X: '-13.55',
          Z: '0',
        },
        {
          diskName: 'd2',
          Y: '-3.08',
          X: '-10.53',
          Z: '0',
        },
        {
          diskName: 'd3',
          Y: '-0.98',
          X: '-8.51',
        },
        {
          diskName: 'd4',
          Y: '1.31',
          X: '-6.5',
        },
        {
          diskName: 'd5',
          Y: '-4.66',
          X: '-7.75',
          Z: '0',
        },
      ],
      uiDisks: [
        {
          uidiskName: 'uid1',
          Y: '5',
          X: '-146',
          Z: '0',
        },
        {
          uidiskName: 'uid2',
          Y: '-40',
          X: '-101',
          Z: '0',
        },
        {
          uidiskName: 'uid3',
          Y: '-83',
          X: '-58',
          Z: '0',
        },
        {
          uidiskName: 'uid4',
          Y: '5',
          X: '-54.3',
          Z: '0',
        },
        {
          uidiskName: 'uid5',
          Y: '52',
          X: '-9.4',
          Z: '0',
        },
      ],
    },
    {
      formationName: '0-2-2',
      formationType: 'defensive',
      indexNumber: 7,
      points: 700,
      imgUrl: '/uploads/images/0-2-2.png',
      disks: [
        {
          diskName: 'd1',
          Y: '-1.5',
          X: '-11.48',
          Z: '0',
        },
        {
          diskName: 'd2',
          Y: '2.55',
          X: '-9.53',
          Z: '0',
        },
        {
          diskName: 'd3',
          Y: '-5.26',
          X: '-9.53',
          Z: '0',
        },
        {
          diskName: 'd4',
          Y: '5.22',
          X: '-5',
          Z: '0',
        },
        {
          diskName: 'd5',
          Y: '-8.25',
          X: '-5',
          Z: '0',
        },
      ],
      uiDisks: [
        {
          uidiskName: 'uid1',
          Y: '0',
          X: '-115',
          Z: '0',
        },
        {
          uidiskName: 'uid2',
          Y: '-85',
          X: '-65',
          Z: '0',
        },
        {
          uidiskName: 'uid3',
          Y: '-130',
          X: '50',
          Z: '0',
        },
        {
          uidiskName: 'uid4',
          Y: '85',
          X: '-65',
          Z: '0',
        },
        {
          uidiskName: 'uid5',
          Y: '130',
          X: '50',
          Z: '0',
        },
      ],
    },
    {
      formationName: '2-0-2',
      formationType: ' Balanced',
      indexNumber: 8,
      points: 700,
      imgUrl: '/uploads/images/2-0-2-1.png',
      disks: [
        {
          diskName: 'd1',
          Y: '-1.5',
          X: '-13.63',
          Z: '0',
        },
        {
          diskName: 'd2',
          Y: '3.77',
          X: '-9.13',
          Z: '0',
        },
        {
          diskName: 'd3',
          Y: '-6.89',
          X: '-9.13',
          Z: '0',
        },
        {
          diskName: 'd4',
          Y: '0.66',
          X: '-3.35',
        },
        {
          diskName: 'd5',
          Y: '-3.4',
          X: '-3.35',
          Z: '0',
        },
      ],
      uiDisks: [
        {
          uidiskName: 'uid1',
          Y: '0',
          X: '-146',
          Z: '0',
        },
        {
          uidiskName: 'uid2',
          Y: '112',
          X: '-34',
          Z: '0',
        },
        {
          uidiskName: 'uid3',
          Y: '-112',
          X: '-34',
          Z: '0',
        },
        {
          uidiskName: 'uid4',
          Y: '38',
          X: '120',
          Z: '0',
        },
        {
          uidiskName: 'uid5',
          Y: '-38',
          X: '120',
          Z: '0',
        },
      ],
    },
    {
      formationName: '2-1-1',
      formationType: 'Balanced',
      indexNumber: 9,
      points: 700,
      imgUrl: '/uploads/images/2-1-1.png',
      disks: [
        {
          diskName: 'd1',
          Y: '-1.5',
          X: '-13.63',
          Z: '0',
        },
        {
          diskName: 'd2',
          Y: '3.77',
          X: '-9.5',
          Z: '0',
        },
        {
          diskName: 'd3',
          Y: '-6.89',
          X: '-9.5',
          Z: '0',
        },
        {
          diskName: 'd4',
          Y: '-1.5',
          X: '-6.03',
          Z: '0',
        },
        {
          diskName: 'd5',
          Y: '-1.5',
          X: '-2.86',
          Z: '0',
        },
      ],
      uiDisks: [
        {
          uidiskName: 'uid1',
          Y: '0',
          X: '-146',
          Z: '0',
        },
        {
          uidiskName: 'uid2',
          Y: '112',
          X: '-34',
          Z: '0',
        },
        {
          uidiskName: 'uid3',
          Y: '-112',
          X: '-34',
          Z: '0',
        },
        {
          uidiskName: 'uid4',
          Y: '0',
          X: '35',
          Z: '0',
        },
        {
          uidiskName: 'uid5',
          Y: '0',
          X: '133',
          Z: '0',
        },
      ],
    },
    {
      formationName: '2-3-0',
      formationType: 'Balanced',
      indexNumber: 10,
      points: 700,
      imgUrl: '/uploads/images/2-3-0.png',
      disks: [
        {
          diskName: 'd1',
          Y: '-4.3',
          X: '-10.91',
          Z: '0',
        },
        {
          diskName: 'd2',
          Y: '1.28',
          X: '-10.91',
          Z: '0',
        },
        {
          diskName: 'd3',
          Y: '-1.49',
          X: '-5.83',
          Z: '0',
        },
        {
          diskName: 'd4',
          Y: '5.12',
          X: '-5.83',
          Z: '0',
        },
        {
          diskName: 'd5',
          Y: '-8.29',
          X: '-5.83',
          Z: '0',
        },
      ],
      uiDisks: [
        {
          uidiskName: 'uid1',
          Y: '-50',
          X: '-110',
          Z: '0',
        },
        {
          uidiskName: 'uid2',
          Y: '50',
          X: '-110',
          Z: '0',
        },
        {
          uidiskName: 'uid3',
          Y: '-112',
          X: '35',
          Z: '0',
        },
        {
          uidiskName: 'uid4',
          Y: '0',
          X: '35',
          Z: '0',
        },
        {
          uidiskName: 'uid5',
          Y: '112',
          X: '35',
          Z: '0',
        },
      ],
    },
    {
      formationName: '2-2-0',
      formationType: 'Balanced',
      indexNumber: 11,
      points: 700,
      imgUrl: '/uploads/images/2-2-0.png',
      disks: [
        {
          diskName: 'd1',
          Y: '-1.5',
          X: '-13.19',
          Z: '0',
        },
        {
          diskName: 'd2',
          Y: '4.77',
          X: '-10.21',
          Z: '0',
        },
        {
          diskName: 'd3',
          Y: '-7.85',
          X: '-10.21',
          Z: '0',
        },
        {
          diskName: 'd4',
          Y: '1.66',
          X: '-4.52',
          Z: '0',
        },
        {
          diskName: 'd5',
          Y: '-4.5',
          X: '-4.52',
          Z: '0',
        },
      ],
      uiDisks: [
        {
          uidiskName: 'uid1',
          Y: '0',
          X: '-146',
          Z: '0',
        },
        {
          uidiskName: 'uid2',
          Y: '110',
          X: '-110',
          Z: '0',
        },
        {
          uidiskName: 'uid3',
          Y: '-110',
          X: '-110',
          Z: '0',
        },
        {
          uidiskName: 'uid4',
          Y: '60',
          X: '28',
          Z: '0',
        },
        {
          uidiskName: 'uid5',
          Y: '-60',
          X: '28',
          Z: '0',
        },
      ],
    },
    {
      formationName: '0-3-1',
      formationType: 'Balanced',
      indexNumber: 12,
      points: 700,
      imgUrl: '/uploads/images/0-3-1.png',
      disks: [
        {
          diskName: 'd1',
          Y: '-1.5',
          X: '-13.19',
          Z: '0',
        },
        {
          diskName: 'd2',
          Y: '-1.5',
          X: '-5.82',
          Z: '0',
        },
        {
          diskName: 'd3',
          Y: '2.71',
          X: '-5.82',
          Z: '0',
        },
        {
          diskName: 'd4',
          Y: '-5.7',
          X: '-5.82',
          Z: '0',
        },
        {
          diskName: 'd5',
          Y: '-5.7',
          X: '-1.31',
          Z: '0',
        },
      ],
      uiDisks: [
        {
          uidiskName: 'uid1',
          Y: '0',
          X: '-146',
          Z: '0',
        },
        {
          uidiskName: 'uid2',
          Y: '0',
          X: '45',
          Z: '0',
        },
        {
          uidiskName: 'uid3',
          Y: '-70',
          X: '45',
          Z: '0',
        },
        {
          uidiskName: 'uid4',
          Y: '70',
          X: '45',
          Z: '0',
        },
        {
          uidiskName: 'uid5',
          Y: '-70',
          X: '130',
          Z: '0',
        },
      ],
    },
    {
      formationName: '2-3-0',
      formationType: 'Balanced',
      indexNumber: 13,
      points: 700,
      imgUrl: '/uploads/images/2-3-0-1.png',
      disks: [
        {
          diskName: 'd1',
          Y: '-3.4',
          X: '-11.57',
          Z: '0',
        },
        {
          diskName: 'd2',
          Y: '-0.08',
          X: '-11.57',
          Z: '0',
        },
        {
          diskName: 'd3',
          Y: '-1.5',
          X: '-2.33',
          Z: '0',
        },
        {
          diskName: 'd4',
          Y: '3.24',
          X: '-5.82',
          Z: '0',
        },
        {
          diskName: 'd5',
          Y: '-6.27',
          X: '-5.82',
          Z: '0',
        },
      ],
      uiDisks: [
        {
          uidiskName: 'uid1',
          Y: '-30',
          X: '-130',
          Z: '0',
        },
        {
          uidiskName: 'uid2',
          Y: '30',
          X: '-130',
          Z: '0',
        },
        {
          uidiskName: 'uid3',
          Y: '112',
          X: '35',
          Z: '0',
        },
        {
          uidiskName: 'uid4',
          Y: '-112',
          X: '35',
          Z: '0',
        },
        {
          uidiskName: 'uid5',
          Y: '0',
          X: '135',
          Z: '0',
        },
      ],
    },
    {
      formationName: '0-2-2',
      formationType: 'Balanced',
      indexNumber: 14,
      points: 700,
      imgUrl: '/uploads/images/0-2-2.png',
      disks: [
        {
          diskName: 'd1',
          Y: '-1.5',
          X: '-11.48',
          Z: '0',
        },
        {
          diskName: 'd2',
          Y: '2.55',
          X: '-9.53',
          Z: '0',
        },
        {
          diskName: 'd3',
          Y: '-5.26',
          X: '-9.53',
          Z: '0',
        },
        {
          diskName: 'd4',
          Y: '5.22',
          X: '-5',
          Z: '0',
        },
        {
          diskName: 'd5',
          Y: '-8.25',
          X: '-5',
          Z: '0',
        },
      ],
      uiDisks: [
        {
          uidiskName: 'uid1',
          Y: '0',
          X: '-115',
          Z: '0',
        },
        {
          uidiskName: 'uid2',
          Y: '-85',
          X: '-65',
          Z: '0',
        },
        {
          uidiskName: 'uid3',
          Y: '-130',
          X: '50',
          Z: '0',
        },
        {
          uidiskName: 'uid4',
          Y: '85',
          X: '-65',
          Z: '0',
        },
        {
          uidiskName: 'uid5',
          Y: '130',
          X: '50',
          Z: '0',
        },
      ],
    },
    {
      formationName: '2-0-3',
      formationType: 'attacking',
      indexNumber: 15,
      points: 700,
      imgUrl: '/uploads/images/2-0-3.png',
      disks: [
        {
          diskName: 'd1',
          Y: '-2.86',
          X: '-12.55',
          Z: '0',
        },
        {
          diskName: 'd2',
          Y: '-0.45',
          X: '-12.55',
          Z: '0',
        },
        {
          diskName: 'd3',
          Y: '4.2',
          X: '-2.43',
          Z: '0',
        },
        {
          diskName: 'd4',
          Y: '-7.6',
          X: '-2.43',
          Z: '0',
        },
        {
          diskName: 'd5',
          Y: '-1.76',
          X: '-2.43',
          Z: '0',
        },
      ],
      uiDisks: [
        {
          uidiskName: 'uid1',
          Y: '-30',
          X: '-146',
          Z: '0',
        },
        {
          uidiskName: 'uid2',
          Y: '30',
          X: '-146',
          Z: '0',
        },
        {
          uidiskName: 'uid3',
          Y: '0',
          X: '130',
          Z: '0',
        },
        {
          uidiskName: 'uid4',
          Y: '-120',
          X: '130',
          Z: '0',
        },
        {
          uidiskName: 'uid5',
          Y: '120',
          X: '130',
          Z: '0',
        },
      ],
    },
    {
      formationName: '2-0-3',
      formationType: 'attacking',
      indexNumber: 16,
      points: 700,
      imgUrl: '/uploads/images/2-0-3-1.png',
      disks: [
        {
          diskName: 'd1',
          Y: '-1.5',
          X: '-10.34',
          Z: '0',
        },
        {
          diskName: 'd2',
          Y: '-0.35',
          X: '-12.72',
          Z: '0',
        },
        {
          diskName: 'd3',
          Y: '-3.6',
          X: '-3.38',
          Z: '0',
        },
        {
          diskName: 'd4',
          Y: '-6.19',
          X: '-3.38',
          Z: '0',
        },
        {
          diskName: 'd5',
          Y: '-8.75',
          X: '-3.38',
          Z: '0',
        },
      ],
      uiDisks: [
        {
          uidiskName: 'uid1',
          Y: '45',
          X: '-145',
          Z: '0',
        },
        {
          uidiskName: 'uid2',
          Y: '7',
          X: '-105',
          Z: '0',
        },
        {
          uidiskName: 'uid3',
          Y: '-25',
          X: '95',
          Z: '0',
        },
        {
          uidiskName: 'uid4',
          Y: '-80',
          X: '95',
          Z: '0',
        },
        {
          uidiskName: 'uid5',
          Y: '-135',
          X: '95',
          Z: '0',
        },
      ],
    },
    {
      formationName: '0-0-4',
      formationType: 'attacking',
      indexNumber: 17,
      points: 700,
      imgUrl: '/uploads/images/0-0-4.png',
      disks: [
        {
          diskName: 'd1',
          Y: '-1.5',
          X: '-13.19',
          Z: '0',
        },
        {
          diskName: 'd2',
          Y: '-0.14',
          X: '-3.29',
          Z: '0',
        },
        {
          diskName: 'd3',
          Y: '-3.09',
          X: '-3.29',
          Z: '0',
        },
        {
          diskName: 'd4',
          Y: '2.23',
          X: '-1.31',
          Z: '0',
        },
        {
          diskName: 'd5',
          Y: '-5.4',
          X: '-1.31',
          Z: '0',
        },
      ],
      uiDisks: [
        {
          uidiskName: 'uid1',
          Y: '0',
          X: '-146',
          Z: '0',
        },
        {
          uidiskName: 'uid2',
          Y: '23.3',
          X: '104.5',
          Z: '0',
        },
        {
          uidiskName: 'uid3',
          Y: '-33.8',
          X: '104.5',
          Z: '0',
        },
        {
          uidiskName: 'uid4',
          Y: '60',
          X: '146',
          Z: '0',
        },
        {
          uidiskName: 'uid5',
          Y: '-66',
          X: '146',
          Z: '0',
        },
      ],
    },
    {
      formationName: '0-0-5',
      formationType: 'attacking',
      indexNumber: 18,
      points: 700,
      imgUrl: '/uploads/images/0-0-5.png',
      disks: [
        {
          diskName: 'd1',
          Y: '-1.49',
          X: '-4.6',
          Z: '0',
        },
        {
          diskName: 'd2',
          Y: '1.88',
          X: '-2.31',
          Z: '0',
        },
        {
          diskName: 'd3',
          Y: '-5.16',
          X: '-2.31',
          Z: '0',
        },
        {
          diskName: 'd4',
          Y: '4.45',
          X: '-2.31',
          Z: '0',
        },
        {
          diskName: 'd5',
          Y: '-7.70',
          X: '-2.31',
          Z: '0',
        },
      ],
      uiDisks: [
        {
          uidiskName: 'uid1',
          Y: '0',
          X: '88',
          Z: '0',
        },
        {
          uidiskName: 'uid2',
          Y: '-57',
          X: '128',
          Z: '0',
        },
        {
          uidiskName: 'uid3',
          Y: '-112',
          X: '128',
          Z: '0',
        },
        {
          uidiskName: 'uid4',
          Y: '57',
          X: '128',
          Z: '0',
        },
        {
          uidiskName: 'uid5',
          Y: '112',
          X: '128',
          Z: '0',
        },
      ],
    },
    {
      formationName: '1-3-1',
      formationType: 'attacking',
      indexNumber: 19,
      points: 700,
      imgUrl: '/uploads/images/1-3-1.png',
      disks: [
        {
          diskName: 'd1',
          Y: '-1.3',
          X: '-7',
          Z: '0',
        },
        {
          diskName: 'd2',
          Y: '1.65',
          X: '-4.3',
          Z: '0',
        },
        {
          diskName: 'd3',
          Y: '-4.25',
          X: '-8.8',
          Z: '0',
        },
        {
          diskName: 'd4',
          Y: '-7.5',
          X: '-11',
          Z: '0',
        },
        {
          diskName: 'd5',
          Y: '4.85',
          X: '-2',
          Z: '0',
        },
      ],
      uiDisks: [
        {
          uidiskName: 'uid1',
          Y: '-100',
          X: '-130',
          Z: '0',
        },
        {
          uidiskName: 'uid2',
          Y: '-45',
          X: '-67.5',
          Z: '0',
        },
        {
          uidiskName: 'uid3',
          Y: '10',
          X: '-4.2',
          Z: '0',
        },
        {
          uidiskName: 'uid4',
          Y: '65',
          X: '58.4',
          Z: '0',
        },
        {
          uidiskName: 'uid5',
          Y: '120',
          X: '120',
          Z: '0',
        },
      ],
    },
    {
      formationName: '0-2-3',
      formationType: 'attacking',
      indexNumber: 20,
      points: 700,
      imgUrl: '/uploads/images/0-2-3.png',
      disks: [
        {
          diskName: 'd1',
          Y: '-1.5',
          X: '-2.62',
          Z: '0',
        },
        {
          diskName: 'd2',
          Y: '-3.21',
          X: '-4.56',
          Z: '0',
        },
        {
          diskName: 'd3',
          Y: '0.16',
          X: '-4.56',
          Z: '0',
        },
        {
          diskName: 'd4',
          Y: '-7.91',
          X: '-8.85',
          Z: '0',
        },
        {
          diskName: 'd5',
          Y: '4.54',
          X: '-8.85',
          Z: '0',
        },
      ],
      uiDisks: [
        {
          uidiskName: 'uid1',
          Y: '0',
          X: '135',
          Z: '0',
        },
        {
          uidiskName: 'uid2',
          Y: '35',
          X: '90',
          Z: '0',
        },
        {
          uidiskName: 'uid3',
          Y: '-35',
          X: '90',
          Z: '0',
        },
        {
          uidiskName: 'uid4',
          Y: '130',
          X: '-35',
          Z: '0',
        },
        {
          uidiskName: 'uid5',
          Y: '-130',
          X: '-35',
          Z: '0',
        },
      ],
    },
  ];

  var ctr = 0;

  formations.forEach(function (singleFormation) {
    Formation.updateOne(
      {
        //formationName: singleFormation.formationName
        indexNumber: singleFormation.indexNumber,
      },
      singleFormation,
      {
        upsert: true,
      },
      function (err, updated) {
        ctr++;
        if (err) {
          let msg = 'some error occurred';
          sendResponse.sendErrorMessage(msg);
        } else {
          if (ctr == formations.length) {
            next();
          }
        }
      }
    );
  });
};

/*
 * --------------------------------------------------------------------------
 * Create Update Match Play Record
 * ---------------------------------------------------------------------------
 */

exports.updateMatchPlay = function (data) {
  var ctr = 0;
  return new Promise((resolve, reject) => {
    MatchPlay.findOneAndUpdate(
      {
        diskId: data.stats.player.diskId,
        playerId: data.stats.player.playerId,
      },
      data.stats.player,
      {
        upsert: true,
        new: true,
        useFindAndModify: false,
      },
      function (err, updated) {
        ctr++;
        if (err) {
          let msg = 'some error occurred';
          reject(msg);
        } else {
          resolve(updated);
        }
      }
    );
  });
};

/*
 * --------------------------------------------------------------------------
 * Match Results
 * ---------------------------------------------------------------------------
 */

exports.updateMatchResults = function (data) {
  var ctr = 0;
  return new Promise((resolve, reject) => {
    // let newMatch = new Match();
    const finished = 'finished';
    const active = 'active';
    Match.findOneAndUpdate(
      {
        roomName: data.roomName,
        matchStatus: active,
        _id: data.matchId,
      },
      {
        winnerName: data.winnerName,
        playerOneGoal: data.playerOneGoal,
        playerTwoGoal: data.playerTwoGoal,
        matchStatus: finished,
      },
      {
        upsert: false,
        new: true,
        useFindAndModify: false,
      },
      function (err, updated) {
        console.log('updatedMatchResult', updated);

        ctr++;
        if (err) {
          let msg = 'some error occurred';
          reject(msg);
        } else {
          resolve(updated);
        }
      }
    );
  });
};
/*
 * --------------------------------------------------------------------------
 * MatchStatus
 * ---------------------------------------------------------------------------
 */

exports.getMatchStatusResult = (matchId) => {
  console.log('inside getMatchStatusResult');

  return new Promise((resolve, reject) => {
    Match.findOne({ _id: matchId }, (err, data) => {
      if (err) {
        let msg = 'some error occurred';
        reject(msg);
      } else {
        resolve(data.matchStatus);
      }
    });
  });
};

/*
 * --------------------------------------------------------------------------
 * Rematch
 * ---------------------------------------------------------------------------
 */
exports.rematch = function (data) {
  var ctr = 0;

  matchId = data.matchId;
  rematchRequestStatus = data.rematchRequestStatus;

  if (rematchRequestStatus) {
    return new Promise((resolve, reject) => {
      Match.findOne(
        {
          _id: matchId,
        },
        function (err, matchData) {
          if (err) {
            res.status(200).send({
              message: 'Some error occurred',
              status: false,
            });
          } else {
            if (matchData == null) {
              res.status(404).send({
                message: 'Invalid Match Id',
                status: false,
              });
            } else {
              let newMatch = new Match();
              newMatch.playerOneUserName = matchData.playerOneUserName;
              newMatch.playerTwoUserName = matchData.playerTwoUserName;
              newMatch.roomName = matchData.roomName;
              newMatch.matchType = matchData.matchType;
              newMatch.bettingCompanyId = matchData.bettingCompanyId;
              if (matchData.leagueId) newMatch.leagueId = matchData.leagueId;

              newMatch.save().then(function (data, err) {
                if (err) {
                  console.log(err);
                  let msg = 'some error occurred';
                  reject(msg);
                } else {
                  resolve(data);
                }
              });
            }
          }
        }
      );
    });
  }
  // return new Promise((resolve, reject) => {

  // });
};

/*
 * --------------------------------------------------------------------------
 * Create Default Formations
 * ---------------------------------------------------------------------------
 */

exports.createDefaultStadium = function (next) {
  let stadiums = [
    {
      stadiumImgURL:
        '/images/stadiumImage/a8a4aedd-cb16-42ed-8725-49d020dd90d6.png',
      isActive: 'true',
      stadiumLocation: 'Indian Stadium',
      status: 'Default',
      name: 'Stadium 1',
      stadiumRentPrize: 0.0,
      stadiumRentTime: 1000000,
      stadiumDetails: 'Default',
    },
    {
      stadiumImgURL:
        '/images/stadiumImage/151befba-beef-491e-b5e4-61eea13373d7.png',
      isActive: 'false',
      stadiumLocation: 'USA Stadium',
      status: 'Unavailable',
      name: 'Stadium 2',
      stadiumRentPrize: 100.0,
      stadiumRentTime: 5,
      stadiumDetails: 'good',
    },
    {
      stadiumImgURL:
        '/images/stadiumImage/9971a7b2-a09b-463a-a45e-60769dc4cbd8.png',
      isActive: false,
      stadiumLocation: 'UK Stadium',
      status: 'Unavailable',
      name: 'Stadium 3',
      stadiumRentPrize: 200.0,
      stadiumRentTime: 10,
      stadiumDetails: 'statsium status is very good',
    },
    {
      stadiumImgURL:
        '/images/stadiumImage/5a7c2b11-9d3e-42a8-b360-87d4af95fc46.png',
      isActive: false,
      stadiumLocation: 'Africa Stadium',
      status: 'Unavailable',
      name: 'Stadium 4',
      stadiumRentPrize: 300.0,
      stadiumRentTime: 20,
      stadiumDetails: 'statsium status is very good',
    },
    {
      stadiumImgURL:
        '/images/stadiumImage/270b127b-ba5c-4863-8c00-c12d31af092f.png',
      isActive: false,
      stadiumLocation: 'Australia Stadium',
      status: 'Unavailable',
      name: 'Stadium 5',
      stadiumRentPrize: 500.0,
      stadiumRentTime: 30,
      stadiumDetails: 'statsium status is very good',
    },
  ];

  var ctr = 0;

  stadiums.forEach(function (singleStadium, req, res) {
    Gamestadium.updateOne(
      {
        name: singleStadium.name,
      },
      singleStadium,
      {
        upsert: true,
      },
      function (err, updated) {
        ctr++;
        if (err) {
          let msg = 'some error occurred';
          sendResponse.sendErrorMessage(msg, err);
        } else {
          if (ctr == stadiums.length) {
            next();
          }
        }
      }
    );
  });
};

/*
 * --------------------------------------------------------------------------
 * Email details to send every emails
 * ---------------------------------------------------------------------------
 */

//Send email transporter function

//host: 'smtp.gmail.com',
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.EMAIL_ID,
    pass: config.EMAIL_PWD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Mail Options to send email
var mailOptions = {
  from: 'devjogabonitosports@gmail.com', // sender address
};

/*
 * --------------------------------------------------------------------------
 * Send Reset Password Email notification
 * ---------------------------------------------------------------------------
 */

exports.sendResetPasswordEmail = function (emailId, token) {
  var link = `${config.WEB_URL}/reset-password?email=${emailId}&token=${token}`;

  // var link = "https://jiweman.com" + '/reset-password?token=' + token;

  // if (config.NODE_ENV == 'production') {
  //   // link = config.DEV_URL + '/forgetpassword?token=' + token;
  //   link = 'https://jiweman.com' + '/reset-password?token=' + token;
  // }
  // else {
  //   link = `${config.BASE_URL}/web/reset-password?email=${emailId}token=${token}`;
  // }

  console.log(link);
  //mailOptions.to = emailId;
  function sendResetPasswordMail(userDetails) {
    mailOptions.to = emailId;
    mailOptions.subject = 'Joga-Bonito - Reset Password';
    mailOptions.html =
      '<div style="width: 680px;margin: 0 auto;">' +
      '<div style="background:#504482;height: 80px;">' +
      '<h3 style="color: #fff;font-size: 36px;font-weight: normal;padding: 18px 0 0 70px;margin: 0;">Joga Bonito </h3>' +
      '</div>' +
      '<div style="background: #fff;padding:23px 70px 20px 70px;">' +
      '<h4 style="font-size: 24px; color: #504482; margin: 20px 0 30px;">Hello ' +
      userDetails.userName +
      '</h4>' +
      '<div style="color: #8b8382; font-size: 15px;">' +
      'You requested to reset your password for Joga Bonito.Click the button below to reset it.' +
      '<div style="display:block;margin: 90px 0;">' +
      '<a style="font-size: 16px;font-weight: normal;color: #8b8382;cursor: pointer;border: 2px solid #d9d3d3;' +
      'padding: 15px 65px 15px 0;border-left: none;border-radius: 0 30px 30px 0;text-decoration: none" href = ' +
      link +
      '> Click here </a>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '<div style="height: 52px;background:#dfdfdf;"></div>' +
      '</div>';

    // console.log(mailOptions.html)

    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.log(err);
        let msg = 'some error occurred';
        sendResponse.sendErrorMessage(msg, res);
      } else {
        return res.status(200).send({
          message: 'Email sent',
          status: true,
        });
      }
    });
  }

  Player.findOne({ email: emailId }, function (err, userDetails) {
    if (err) {
      console.log(err);
      let msg = 'some error occurred';
      sendResponse.sendErrorMessage(msg, res);
    } else {
      if (userDetails) {
        sendResetPasswordMail(userDetails);
      }
    }
  });
};

/*
 * --------------------------------------------------------------------------
 * Send admin Reset password Email notification
 * ---------------------------------------------------------------------------
 */

exports.sendadminResetPasswordEmail = function (emailId, token) {
  console.log('inside sendadminResetPasswordEmail');

  var link = 'https://jiweman.com' + '/reset-password?token=' + token;

  if (config.NODE_ENV == 'production') {
    link = config.DEV_URL + '/forgetpassword?token=' + token;
  } else {
    link = `https://dev.jiweman.com/web/reset-password?email=${emailId}token=${token}`;
  }
  console.log(link);
  function sendResetPasswordMail(userDetails) {
    mailOptions.to = emailId;
    mailOptions.subject = 'Joga-Bonito - Reset Password';
    mailOptions.html =
      '<div style="width: 680px;margin: 0 auto;">' +
      '<div style="background:#504482;height: 80px;">' +
      '<h3 style="color: #fff;font-size: 36px;font-weight: normal;padding: 18px 0 0 70px;margin: 0;">Joga Bonito </h3>' +
      '</div>' +
      '<div style="background: #fff;padding:23px 70px 20px 70px;">' +
      '<h4 style="font-size: 24px; color: #504482; margin: 20px 0 30px;">Hello ' +
      userDetails.userName +
      '</h4>' +
      '<div style="color: #8b8382; font-size: 15px;">' +
      'You requested to reset your password for Joga Bonito.Click the button below to reset it.' +
      '<div style="display:block;margin: 90px 0;">' +
      '<a style="font-size: 16px;font-weight: normal;color: #8b8382;cursor: pointer;border: 2px solid #d9d3d3;' +
      'padding: 15px 65px 15px 0;border-left: none;border-radius: 0 30px 30px 0;text-decoration: none" href = ' +
      link +
      '> Click here </a>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '<div style="height: 52px;background:#dfdfdf;"></div>' +
      '</div>';

    // console.log(mailOptions.html)

    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.log(err);
        let msg = 'some error occurred';
        sendResponse.sendErrorMessage(msg, res);
      } else {
        return res.status(200).send({
          message: 'Email sent',
          status: true,
        });
      }
    });
  }

  Admin.findOne({ email: emailId }, function (err, userDetails) {
    if (err) {
      console.log(err);
      let msg = 'some error occurred';
      sendResponse.sendErrorMessage(msg, res);
    } else {
      if (userDetails) {
        sendResetPasswordMail(userDetails);
      }
    }
  });
};

/*
 * --------------------------------------------------------------------------
 * Send Username in Email notification to player
 * ---------------------------------------------------------------------------
 */

exports.sendUsernameEmail = function (emailId) {
  function getUsernameEmail(userDetails) {
    mailOptions.to = emailId;
    mailOptions.subject = 'Joga-Bonito - Get Username';
    mailOptions.html =
      '<div style="width: 680px;margin: 0 auto;">' +
      '<div style="background:#504482;height: 80px;">' +
      '<h3 style="color: #fff;font-size: 36px;font-weight: normal;padding: 18px 0 0 70px;margin: 0;">Joga Bonito </h3>' +
      '</div>' +
      '<div style="background: #fff;padding:23px 70px 20px 70px;">' +
      '<h3 style="font-size: 24px; color: #504482; margin: 20px 0 30px;">Hello ' +
      userDetails.fullName +
      '</h3>' +
      '<div style="color: #8b8382; font-size: 15px;">' +
      'You requested to get your username for <strong> Joga Bonito.</strong>' +
      ' Your username for Joga Bonito is' +
      '<h4><strong>' +
      userDetails.userName +
      '</strong></h4>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '<div style="height: 52px;background:#dfdfdf;"></div>' +
      '</div>';

    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.log(err);
        let msg = 'some error occurred';
        sendResponse.sendErrorMessage(msg, res);
      } else {
        return res.status(200).send({
          message: 'Email sent',
          status: true,
        });
      }
    });
  }

  Player.findOne({ email: emailId }, function (err, userDetails) {
    if (err) {
      console.log(err);
      let msg = 'some error occurred';
      sendResponse.sendErrorMessage(msg, res);
    } else {
      if (userDetails) {
        getUsernameEmail(userDetails);
      }
    }
  });
};

/*
 * --------------------------------------------------------------------------
 * converting date entered in string format to mongoDB ISODate format
 * ---------------------------------------------------------------------------
 */
exports.stringToDate = (date) => {
  darr = date.split('-');

  var dobj = new Date(
    parseInt(darr[2]),
    parseInt(darr[1]) - 1,
    parseInt(darr[0])
  );
  let ISOdate = dobj.toISOString();
  //console.log(ISOdate)
  return ISOdate;
};

/*
 * --------------------------------------------------------------------------
 * calculating player's age
 * ---------------------------------------------------------------------------
 */
exports.getAge = (dob) => {
  var today = new Date();
  var birthDate = new Date(dob);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  console.log('age:' + age);
  return age;
};

/*
 * --------------------------------------------------------------------------
 * converting time entered in string format to ISODate format
 * ---------------------------------------------------------------------------
 */
exports.splittime = (time) => {
  timearray = time.split(':');
  return timearray;
};

/*
 * --------------------------------------------------------------------------
 * Send account verification email notification on registered Email
 * ---------------------------------------------------------------------------
 */

exports.sendAccountVerificationMail = (userDetails) => {
  console.log('inside sendEmailVerificationMail');
  var link = `${config.BASE_URL}/api/auth/activateAccount?email=${userDetails.email}&verificationToken=${userDetails.verificationToken}`;
  console.log(link);

  mailOptions.to = userDetails.email;
  mailOptions.subject = 'Joga-Bonito - Account Verification';
  mailOptions.html =
    '<div style="width: 680px;margin: 0 auto;">' +
    '<div style="background:#504482;height: 80px;">' +
    '<h3 style="color: #fff;font-size: 36px;font-weight: normal;padding: 18px 0 0 70px;margin: 0;"> Welcome to Joga Bonito </h3>' +
    '</div>' +
    '<div style="background: #fff;padding:23px 70px 20px 70px;">' +
    '<h4 style="font-size: 24px; color: #504482; margin: 20px 0 30px;">Hello ' +
    userDetails.fullName +
    '</h4>' +
    '<div style="color: #8b8382; font-size: 15px;">' +
    `Congratulations!!! You have successfully registered with <strong> Joga Bonito </strong>. Your username is <strong> ${userDetails.userName} </strong>. Click the button below to activate your account.` +
    '<div style="display:block;margin: 90px 0;">' +
    '<a style="font-size: 16px;font-weight: normal;color: #8b8382;cursor: pointer;border: 2px solid #d9d3d3;' +
    'padding: 15px 65px 15px 0;border-left: none;border-radius: 0 30px 30px 0;text-decoration: none" href = ' +
    link +
    '>Activate account</a>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '<div style="height: 52px;background:#dfdfdf;"></div>' +
    '</div>';

  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log('>>>>>>>>>>>>>>>>>');
      console.log(err);
      console.log('>>>>>>>>>>>>>>>>>');
      let msg = 'some error occurred';
      sendResponse.sendErrorMessage(msg, res);
    } else {
      return res.status(200).send({
        message: 'Email sent',
        status: true,
      });
    }
  });
};

/*
 * --------------------------------------------------------------------------
 * Send mobile number verification sms (OTP) on registered Mobile number
 * ---------------------------------------------------------------------------
 */

exports.sendMobileVerificationSMS = (userDetails) => {
  console.log('inside sendMobileVerificationSMS');

  // Download the helper library from https://www.twilio.com/docs/node/install
  // Your Account Sid and Auth Token from twilio.com/console
  // DANGER! This is insecure. See http://twil.io/secure

  const accountSid = 'AC0768b7c61abdc110fa1a8d6e587a5f2a';
  const authToken = '7c36b59fab205a3e5e6ab5069ce4fc76';
  const client = require('twilio')(accountSid, authToken);

  client.messages
    .create({
      body: 'Your Joga Bonito verification code is: ' + userDetails.otp,
      from: '+12056971393',
      to: userDetails.mobile,
    })
    .then((err, message) => {
      if (err) {
        let msg = 'some error occurred';
        sendResponse.sendErrorMessage(msg, res);
      } else {
        console.log(message.sid);
        return res.status(200).send({
          message: 'Message sent',
          status: true,
        });
      }
    });
};

/*
 * --------------------------------------------------------------------------
 * Create default entry of MVP leader board points
 * ---------------------------------------------------------------------------
 */

exports.createDefaultPointsInfo = (next) => {
  const infonObj = new Point();

  infonObj.played = 1;
  infonObj.win = 5;
  infonObj.loss = -0.25;
  infonObj.goalFor = 1;
  infonObj.goalAgainst = -0.5;
  infonObj.cleanSheet = 3;
  infonObj.goalDifference = 1.5;

  Point.find({}).exec((err, data) => {
    if (err) {
      console.log(err);
      let msg = 'some error occurred';
      console.log(msg);
    } else if (data.length) {
      let msg = 'Data is inserted already';
      // console.log(msg)
    } else if (!data.length) {
      if (infonObj) {
        infonObj.save().then((data, err) => {
          if (err) {
            console.log(err);
            let msg = 'some error occurred';
            console.log(msg);
          } else {
            let msg = 'data inserted';
            // console.log(msg , infonObj)
          }
        });
      } else {
        let msg = 'some error occurred';
        // console.log(msg)
      }
    }
  });
};

/*
 * --------------------------------------------------------------------------
 * Super Admin registration
 * ---------------------------------------------------------------------------
 */

exports.createDefaultAdmin = async (next) => {

  var bettingCompanyData = await bettingCompany.find({ "name": "jiweman" });

  // console.log('2560',bettingCompanyData.length);

  const bettingObj = new bettingCompany();

  if (bettingCompanyData.length == 0) {
    bettingObj.name = 'jiweman';
    bettingObj.country = 'Kenya';
    bettingObj.apiToken = '42488b10b79eb74cfbe62479fb4f3c19c93a8a8f';
    bettingObj.status = 'Active';
    bettingObj.email = 'accounts@jiweman.com';
    bettingObj.password = '6mM$~-7Uc<;hWP6F';
    var result = await bettingObj.save();

    const admin = new Admin();

    admin.userName = bettingObj.email;
    admin.email = bettingObj.email;
    admin.password = bettingObj.password;
    admin.roleName = 'Admin';
    admin.bettingCompanyId = result._id;
    admin.isActive = true;
    admin.isSuperAdmin = true;

    Admin.find({ "isSuperAdmin": true }).exec((err, data) => {
      if (err) {
        console.log(err);
        let msg = 'some error occurred';
        console.log(msg);
      } else if (data.length) {
        let msg = 'Data is inserted already';
        // console.log(msg)
      } else if (!data.length) {
        if (admin) {
          admin.save().then((data, err) => {
            if (err) {
              console.log(err);
              let msg = 'some error occurred';
              console.log(msg);
            } else {
              let msg = 'data inserted';
              // console.log(msg , infonObj)
            }
          });
        } else {
          let msg = 'some error occurred';
          // console.log(msg)
        }
      }
    });
  };
};

/*
 * --------------------------------------------------------------------------
 * Add isLeagueValidForPlayer based on the Country allowed for Players
 * ---------------------------------------------------------------------------
 */

exports.addIsLeagueValidAndLocalCurrency = (leagueList, payload, callback) => {
  Player.findOne({ _id: payload.sub.toObjectId() }, async (err, userData) => {
    if (userData) {
      if (userData.roleName === 'player') {
        let isLeagueValidForPlayer = false;
        let beynoicAmountCoversionData = null;
        let usd_rate = 1;
        const foundCountry = allowedCountries.filter((ob) => {
          return ob.name === userData.countryOfRecidence;
        });


        if (foundCountry.length) {
          isLeagueValidForPlayer = true;

          beynoicAmountCoversionData = await currencydata.findOne({ id: foundCountry[0].beyonicCountryId })

          console.log(foundCountry[0].beyonicCountryId)
          console.log(beynoicAmountCoversionData)

          if (!beynoicAmountCoversionData) {

            const apiToken = await this.getBeyonicAPIToken(payload.bettingCompanyId)

            console.log("calling beyonic")
            beynoicAmountCoversionData = await axios.get(
              `https://app.beyonic.com/api/currencies/${foundCountry[0].beyonicCountryId}`,
              {
                headers: {
                  authorization: `Token ${apiToken}`,
                },
              }
            );

            console.log("got response from beyonic")

            var current_usd_rate = beynoicAmountCoversionData.data.usd_rate;
            var code = beynoicAmountCoversionData.data.code;


          } else {

            var current_usd_rate = beynoicAmountCoversionData.usd_rate
            var code = beynoicAmountCoversionData.code

          }


          // console.log(`https://app.beyonic.com/api/currencies/${foundCountry[0].beyonicCountryId}`)
          // console.log(beynoicAmountCoversionData.data)
        }

        // console.log(beynoicAmountCoversionData);
        let currencyConversionRisk;

        const modifiedList = leagueList.map((ob) => {
          const localTransactionDetails = {};

          if (isLeagueValidForPlayer && beynoicAmountCoversionData) {

            if (ob.gameRegionType === 'international') {

              usd_rate = current_usd_rate;
              currencyConversionRisk =
                (ob.currencyConversionRisk || 0) * 0.01;

              localTransactionDetails.prize = ob.prize.map((value) => {
                return parseFloat(value - value * currencyConversionRisk).toFixed(
                  2
                );
              });

            } else {
              localTransactionDetails.prize = ob.prize
              currencyConversionRisk = 0;
              usd_rate = 1;
            }

            localTransactionDetails.localEntryFee =
              ob.entryFee * usd_rate;
            localTransactionDetails.localPrizePoolAmount =
              ob.prizepoolAmount * usd_rate;
            localTransactionDetails.localCurrency = code;
            localTransactionDetails.conversionRate =
              usd_rate;

            localTransactionDetails.entryFeeWithCommission = Math.ceil(parseFloat(
              ob.entryFee + ob.entryFee * currencyConversionRisk // This is for PG Comission
            ));

            localTransactionDetails.localEntryFeeWithCommission = Math.ceil(
              localTransactionDetails.entryFeeWithCommission *
              usd_rate
            );

            localTransactionDetails.prizeInLocalCurrency = localTransactionDetails.prize.map(
              (value) => {
                return parseFloat(
                  value * usd_rate
                ).toFixed(2);
              }
            );

            localTransactionDetails.supportedNetworks =
              foundCountry[0].supportedNetworks;
          }

          // .toJSON() from below code
          const newOb = {
            ...ob,
            isLeagueValidForPlayer,
            ...localTransactionDetails,
          };
          return newOb;
        });
        callback(modifiedList);
      }
    } else {
      callback(leagueList);
    }
  });
};

/*
 * --------------------------------------------------------------------------
 * Add addIsLeagueAlreadyActiveForTheUser based on the Purchase by the user
 * ---------------------------------------------------------------------------
 */

exports.addIsLeagueAlreadyActiveForTheUser = async (
  leagueList,
  payload,
  callback
) => {
  const modifiedList = await Promise.all(
    leagueList.map(async (ob) => {
      var query = {
        userId: payload.sub,
        leagueId: ob._id,
        // remaining: {
        //   $gt: 0,
        // },
      };

      ob.isLeagueAlreadyActiveForUser = false;

      const queryResult = await playerLeague.find(query);
      console.log(queryResult);
      // .populate({
      //   path: 'userId',
      //   model: 'User',
      // });
      const remainingMatch = _.filter(queryResult, (ob) => ob.remaining > 0);
      ob.currentRound = queryResult.length;
      if (remainingMatch.length) {
        ob.isLeagueAlreadyActiveForUser = true;
      }
      return ob;
    })
  );

  callback(modifiedList);
};



/*
 * --------------------------------------------------------------------------
 * Add addIsOneOnOneBetAlreadyActiveForTheUser based on the Purchase by the user
 * ---------------------------------------------------------------------------
 */



exports.addIsOneOnOneBetAlreadyActiveForTheUser = async (
  list,
  payload,
  callback
) => {
  const modifiedList = await Promise.all(
    list.map(async (ob) => {
      var query = {
        userId: payload.sub,
        gameId: ob._id
      };

      ob.isBetAlreadyActiveForUser = false;
      ob.freeBets = 0;

      const queryResult = await playerBet.find(query);
      // console.log(queryResult);

      const remainingMatch = _.filter(queryResult, (ob) => ob.remaining > 0);
      const freeBets = _.filter(queryResult, (ob) => ob.freeBets > 0);

      ob.currentRound = queryResult.length;

      if (remainingMatch.length) {
        ob.isBetAlreadyActiveForUser = true;
      }

      if (freeBets.length) {
        freeBets.forEach ((element)=>{
          ob.freeBets = element.freeBets;
        })
      }
      return ob;
    })
  );

  callback(modifiedList);
};


/*
 * --------------------------------------------------------------------------
 * send mail funtion
 * ---------------------------------------------------------------------------
 */

exports.sendEmail = (userEmail, body, subject) => {
  console.log('inside sendEmail');
  return new Promise((resolve, reject) => {
    mailOptions.to = userEmail;
    mailOptions.subject = subject;
    mailOptions.html = body;

    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        return reject(err);
      }
      return resolve(info);
    });
  });
};

exports.getLocalCurrencyCoversionDetailsByCurrency = (currency) => {
  return new Promise(async (resolve, reject) => {

    let beynoicAmountCoversionData = null;
    const foundCountry = allowedCountries.filter((ob) => {
      return ob.currency === currency;
    });

    if (foundCountry.length) {
      beynoicAmountCoversionData = await currencydata.findOne({ id: foundCountry[0].beyonicCountryId })

      if (!beynoicAmountCoversionData) {

        const apiToken = await this.getBeyonicAPIToken(payload.bettingCompanyId)
        beynoicAmountCoversionData = await axios.get(
          `https://app.beyonic.com/api/currencies/${foundCountry[0].beyonicCountryId}`,
          {
            headers: {
              authorization: `Token ${apiToken}`,
            },
          }
        );
        resolve({
          ...beynoicAmountCoversionData.data,
          country: foundCountry[0],
        });

      }else{
        resolve({
          ...beynoicAmountCoversionData,
          country: foundCountry[0],
        });

      }

    }else{
      reject(null);
    }
  });
};


exports.getLocalCurrencyCoversionDetails = (payload) => {
  return new Promise(async (resolve, reject) => {
    var userData = await Player.findOne({ _id: payload.sub.toObjectId() });

    if (userData) {
      if (userData.roleName === 'player') {
        let beynoicAmountCoversionData = null;
        const foundCountry = allowedCountries.filter((ob) => {
          return ob.name === userData.countryOfRecidence;
        });

        if (foundCountry.length) {
          beynoicAmountCoversionData = await currencydata.findOne({ id: foundCountry[0].beyonicCountryId }).lean()

          if (!beynoicAmountCoversionData) {

            const apiToken = await this.getBeyonicAPIToken(payload.bettingCompanyId)
            beynoicAmountCoversionData = await axios.get(
              `https://app.beyonic.com/api/currencies/${foundCountry[0].beyonicCountryId}`,
              {
                headers: {
                  authorization: `Token ${apiToken}`,
                },
              }
            );
            resolve({
              ...beynoicAmountCoversionData.data,
              country: foundCountry[0],
            });

          }else{
            resolve({
              ...beynoicAmountCoversionData,
              country: foundCountry[0],
            });

          }

        }else{
          reject(null);
        }
      }
    } else {

      userData = await Admin.findOne({ _id: payload.sub.toObjectId() });

      let beynoicAmountCoversionData = null;
        const foundCountry = allowedCountries.filter((ob) => {
          return ob.name === payload.country;
        });

        if (foundCountry.length) {
          beynoicAmountCoversionData = await currencydata.findOne({ id: foundCountry[0].beyonicCountryId }).lean()

          if (!beynoicAmountCoversionData) {

            const apiToken = await this.getBeyonicAPIToken(payload.bettingCompanyId)
            beynoicAmountCoversionData = await axios.get(
              `https://app.beyonic.com/api/currencies/${foundCountry[0].beyonicCountryId}`,
              {
                headers: {
                  authorization: `Token ${apiToken}`,
                },
              }
            );
            resolve({
              ...beynoicAmountCoversionData.data,
              country: foundCountry[0],
            });

          }else{
            resolve({
              ...beynoicAmountCoversionData,
              country: foundCountry[0],
            });

          }

        }else{
          reject(null);
        }
      
    }
  });
};

exports.getLocalCurrencyConversionDetailsAsPerGameRegionType = async (game, originalConversionData) => {
  let conversionData = originalConversionData

  if (game.gameRegionType === 'local') {
    conversionData = {
      ...conversionData,
      usd_rate: 1
    }
  }

  return conversionData;
}

exports.updateLeaguePrize = (league, ticketSaleDateCrossed = false) => {
  return new Promise(async (resolve, reject) => {
    try {
      let prize = [];
      let prizepoolAmount;
      let nPos = 0;
      let getTotalTicketSoldCount = await playerLeague.countDocuments({
        //  status: 'successful',
        leagueId: league._id,
      });
      let prizePercentage = parseFloat(league.prizePercentage) || 0.04;

      getTotalTicketSoldCount = _.isEmpty(getTotalTicketSoldCount)
        ? getTotalTicketSoldCount
        : 0;
      if (
        league.prizeDistributionType == 'fixed' &&
        league.sponsorPrizeAmount
      ) {
        let totalPrice = league.sponsorPrizeAmount;
        // // if (league.prizePoolPercentage > 0) {
        // //   totalPrice =
        // //     league.sponsorPrizeAmount * (league.prizePoolPercentage / 100);
        // // }
        prizepoolAmount = totalPrice;

        nPos = league.numberOfPrizes;

        /**
         *  leagueData,
            nPos,
            entryFeeContributionToPrize,
            minimumReward,
            ticketsSold
         */
        prize = await this.pythonPrizeDistribution(
          league,
          nPos,
          0,
          league.entryFee,
          getTotalTicketSoldCount,
          null,
          prizePercentage
        );
      } else if (league.prizeDistributionType == 'variable') {
        console.log('sold tick', getTotalTicketSoldCount);

        if (getTotalTicketSoldCount < 2) {
          getTotalTicketSoldCount = 2;
        }

        if (getTotalTicketSoldCount) {
          let poolPrize;
          if (league.prizePoolPercentage > 0) {
            poolPrize = league.entryFee * (league.prizePoolPercentage / 100);
          } else {
            poolPrize = league.entryFee;
          }

          console.log("2955", poolPrize);

          prizepoolAmount = getTotalTicketSoldCount * poolPrize;

          console.log("2959", prizepoolAmount);

          // Need some inputs and pass it to python..in return we get the prizes...
          // we calculate the no. of prizes by Int(0.04 * tickets sold)
          nPos = parseInt(prizePercentage * getTotalTicketSoldCount);

          let isLastEvaluation = null;
          if (nPos === 0) {
            nPos = 1;
            isLastEvaluation = true
          }

          /**
           *  leagueData,
              nPos,
              entryFeeContributionToPrize,
              minimumReward,
              ticketsSold
           */

          prize = await this.pythonPrizeDistribution(
            league,
            nPos,
            poolPrize,
            poolPrize,
            getTotalTicketSoldCount,
            isLastEvaluation,
            prizePercentage
          );

          console.log("2989", prize);
        } else {
          prize = [];
        }
      } else if (
        league.prizeDistributionType == 'hybrid' &&
        league.sponsorPrizeAmount
      ) {
        let poolPrize = getTotalTicketSoldCount * league.entryFee; //(total ticket sold * amout)

        let totalPrize;
        let poolPrizeOfSingleTicket_variable;
        if (league.prizePoolPercentage > 0) {
          poolPrizeOfSingleTicket_variable =
            league.entryFee * (league.prizePoolPercentage / 100);
          totalPrize =
            league.sponsorPrizeAmount +
            poolPrize * (league.prizePoolPercentage / 100);
        } else {
          totalPrize = league.sponsorPrizeAmount + poolPrize;
          poolPrizeOfSingleTicket_variable = league.entryFee;
        }
        prizepoolAmount = totalPrize;
        // league.prizeDistributionPercentages.forEach((info, index) => {
        //   prize[index] = totalPrize * (info / 100);
        // });
        nPos = league.numberOfPrizes;
        prize = await this.pythonPrizeDistribution(
          league,
          nPos,
          poolPrizeOfSingleTicket_variable,
          league.entryFee,
          getTotalTicketSoldCount,
          null,
          prizePercentage
        );
      }

      const updateQuery = { prize: prize, prizepoolAmount: prizepoolAmount };

      if (league.prizeDistributionType == 'variable') {
        updateQuery.numberOfPrizes = nPos;
      }

      if (ticketSaleDateCrossed) {
        updateQuery.lastPrizeEvaluated = true;
      }

      await League.findOneAndUpdate({ _id: league._id }, { $set: updateQuery });
      resolve({ prizepoolAmount: prizepoolAmount });
    } catch (e) {
      reject(e);
    }
  });
};

exports.pythonPrizeDistribution = (
  leagueData,
  nPos,
  entryFeeContributionToPrize,
  minimumReward,
  ticketsSold,
  isLastEvaluation = null, // Boolean, true, false
  prizePercentage
) => {
  return new Promise((resolve, reject) => {
    let isLast = new Date() > new Date(leagueData.endSaleDate);
    if (isLastEvaluation !== null) {
      isLast = isLastEvaluation;
    }

    let result;
    let options = {
      mode: 'text',
      ...(process.platform !== 'win32' && { pythonPath: 'python3' }),

      /* [
        leagueType = str(sys.argv[1])
        nPos = int(sys.argv[2])
        EntryFeeContributionToPrize = int(sys.argv[3])
        RateOfParticipantsToReward = float(sys.argv[4])
        MinimumReward = float(sys.argv[5])
        WeightInit = float(sys.argv[6])
        WeightMin = float(sys.argv[7])
        NbTicketSold = int(sys.argv[8])
        FixedAmountOfPrizes = int(sys.argv[9])
        isLast: boolean
      ] */

      args: [
        leagueData.prizeDistributionType,
        nPos,
        entryFeeContributionToPrize,
        prizePercentage,
        minimumReward,
        0.6,
        0.1,
        ticketsSold,
        leagueData.sponsorPrizeAmount ? leagueData.sponsorPrizeAmount : 0,
        isLast,
      ],
    };

    PythonShell.run(__dirname + `/prize_distribution.py`, options, function (
      err,
      results
    ) {
      if (err) {
        console.log(err);
        reject([]);
        throw err;
      }
      // results is an array consisting of messages collected during execution
      console.log('Prize Distributions: ', results, options.args);
      let finalResult = [];
      if (results && results.length > 0) {
        finalResult = results;
      }
      resolve(finalResult);
    });
  });
};

exports.getCurrencyConversionRisk = (ob) => {
  return (ob.currencyConversionRisk || 0) * 0.01;
};

exports.getNetworkCharges = (conversionData, amount) => {
  let networkCharges = 0;

  const found = conversionData.country.networkCharges.filter((ob) => {
    if (amount >= ob.min && amount <= ob.max) {
      return true;
    }
  });

  if (found.length) {
    networkCharges = found[0].charge;
  }
  return networkCharges;
};

exports.checkAuthorizedPlayer = async (playerObject, player) => {
  console.log('inside auth');
  return new Promise(async (resolve, reject) => {
    var searchObj = {
      playerName: playerObject.playerName,
      gameType: playerObject.gameType,
    };
    searchObj['leagueId'] = playerObject.leagueId;
    var getLeagueData = await League.findOne({ _id: playerObject.leagueId });
    if (getLeagueData) {
      const playerDetail = await Player.findOne({
        userName: playerObject.playerName,
      });

      const ticketInfo = await playerLeague
        .findOne({
          userId: ObjectID(playerDetail._id),
          leagueId: ObjectID(playerObject.leagueId),
          remaining: {
            $gt: 0,
          },
        })
        .sort({
          remaining: 1,
        });

      const totalTicketsConsumedForALeague = await playerLeague.find({
        userId: ObjectID(playerDetail._id),
        leagueId: ObjectID(playerObject.leagueId),
        remaining: 0,
      });

      if (!ticketInfo) {
        reject({
          message: `Player ${player} not authorized to play this game`,
          status: false,
        });
      } else {
        searchObj.ticket = ticketInfo.ticket;
        playerObject.ticket = ticketInfo.ticket;
        playerObject.leagueRound = totalTicketsConsumedForALeague.length + 1;
        ticketInfo.remaining = ticketInfo.remaining - 1;
        await ticketInfo.save();
        searchObj['leagueRound'] = playerObject.leagueRound;
        resolve(searchObj);
      }
    }
  });
};


exports.checkAuthorizedPlayerForBet = async (playerObject, player, winnerName) => {
  console.log('inside auth');
  return new Promise(async (resolve, reject) => {
    var searchObj = {
      playerName: playerObject.playerName,
      gameType: playerObject.gameType,
    };
    searchObj['gameId'] = playerObject.gameId;
    var getBetData = await OneOnOne.findOne({ _id: playerObject.gameId });
    if (getBetData) {
      const playerDetail = await Player.findOne({
        userName: playerObject.playerName,
      });

      const ticketInfo = await playerBet
        .findOne({
          userId: ObjectID(playerDetail._id),
          gameId: ObjectID(playerObject.gameId)
        })
        .sort({
          _id: -1,
        });

      const totalTicketsConsumedForABet = await playerBet.find({
        userId: ObjectID(playerDetail._id),
        gameId: ObjectID(playerObject.gameId),
        remaining: 0,
      });

      // if (!ticketInfo) {
      //   reject({
      //     message: `Player ${player} not authorized to play this game`,
      //     status: false,
      //   });
      // } else 
      // while (ticketInfo.remaining = 0) {

        if (ticketInfo){
          if (playerDetail.userName == winnerName) {
            ticketInfo.win = ticketInfo.win + 1;
          }
          else {
            ticketInfo.loss = ticketInfo.loss + 1
          }
      // }

        //  searchObj.ticket = ticketInfo.ticket;
        playerObject.ticket = ticketInfo.ticket;
        // /playerObject.leagueRound = totalTicketsConsumedForABet.length + 1;
        // ticketInfo.remaining = ticketInfo.remaining - 1;
        await ticketInfo.save();
        resolve({ searchObj: searchObj, winCount: ticketInfo.win, lossCount: ticketInfo.loss, gameCount: getBetData.gameCount, player: playerDetail });
      }
    }
  });
};

exports.updateOneOnOneGamePlayChance = async (playerName, player, gameId, gameType) => {
  console.log('inside updateOneOnOneGamePlayChance');
  return new Promise(async (resolve, reject) => {
    var searchObj = {
      playerName: playerName,
      gameType: gameType
    };
    searchObj['gameId'] = gameId;
    var getBetData = await OneOnOne.findOne({ _id: gameId });
    if (getBetData) {
      const playerDetail = await Player.findOne({
        userName: playerName
      });

      const ticketInfo = await playerBet
        .findOne({
          userId: ObjectID(playerDetail._id),
          gameId: ObjectID(gameId),
          remaining: {
            $gt: 0,
          },
        })
        .sort({
          remaining: 1,
        });

      const totalTicketsConsumedForABet = await playerBet.find({
        userId: ObjectID(playerDetail._id),
        gameId: ObjectID(gameId),
        remaining: 0,
      });

      if (!ticketInfo) {
        reject({
          message: `Player ${player} not authorized to play this game`,
          status: false,
        });
      } else {
      //   if (playerDetail.userName == winnerName) {
      //     ticketInfo.win = ticketInfo.win + 1;
      //   }
      //   else {
      //     ticketInfo.loss = ticketInfo.loss + 1
      //   }
        //  searchObj.ticket = ticketInfo.ticket;
      //   playerObject.ticket = ticketInfo.ticket;
        // /playerObject.leagueRound = totalTicketsConsumedForABet.length + 1;
        ticketInfo.remaining = ticketInfo.remaining - 1;
        await ticketInfo.save();
        resolve({ gameCount: getBetData.gameCount, player: playerDetail, ticketInfo });
      }
    }
  });
}

exports.addOneOnOneFreeBetsCount = async (playerName, gameId ) => {
  console.log('inside addOneOnOneFreeBetsCount');

  return new Promise(async (resolve, reject) => {

    var getBetData = await OneOnOne.findOne({ _id: gameId });

    if (getBetData) {
      const playerDetail = await Player.findOne({
        userName: playerName
      });

      const ticketInfo = await playerBet
        .findOne({
          userId: ObjectID(playerDetail._id),
          gameId: ObjectID(gameId)
        }).sort({
          _id: -1
        });

      if (!ticketInfo) {
        reject({
          message: 'invalid',
          status: false,
        });
      } else {
        ticketInfo.freeBets = ticketInfo.freeBets + 1;
        await ticketInfo.save();
        resolve({ freeBets: getBetData.freeBets, player: playerDetail });
      }
    } else {
      reject({
        message: 'invalid gameId',
        status: false,
      });
    }
  });
}

exports.updateFreeBetsCount = async (playerName, gameId) => {
  console.log('inside addOneOnOneFreeBetsCount');

  return new Promise(async (resolve, reject) => {

    var getBetData = await OneOnOne.findOne({ _id: gameId });

    if (getBetData) {
      const playerDetail = await Player.findOne({
        userName: playerName
      });

      const ticketInfo = await playerBet
        .findOne({
          userId: ObjectID(playerDetail._id),
          gameId: ObjectID(gameId),
          freeBets: {
            $gt: 0
          }
        }).sort({
          freeBets: 1,
        });

      if (!ticketInfo) {
        reject({
          message: 'invalid',
          status: false,
        });
      } else {
        ticketInfo.freeBets = ticketInfo.freeBets - 1;
        await ticketInfo.save();
        resolve({ freeBets: getBetData.freeBets, player: playerDetail });
      }
    } else {
      reject({
        message: 'invalid gameId',
        status: false,
      });
    }
  });
}

exports.assignPlayerData = async (
  playerData,
  updatedPlayer,
  GFpts,
  GApts,
  GPpts,
  GDPoints,
  totalPoints
) => {
  console.log('assignPlayerData');

  return new Promise((resolve, reject) => {
    playerData.gameType = updatedPlayer.gameType;
    playerData.goalFor = updatedPlayer.goalFor + playerData.goalFor;
    playerData.goalAgainst = updatedPlayer.goalAgainst + playerData.goalAgainst;
    playerData.win = updatedPlayer.win + playerData.win;
    playerData.loss = updatedPlayer.loss + playerData.loss;
    playerData.cleanSheet = updatedPlayer.cleanSheet + playerData.cleanSheet;
    playerData.goalDiff = updatedPlayer.goalDiff + playerData.goalDiff;
    playerData.matchesPlayed =
      updatedPlayer.matchesPlayed + playerData.matchesPlayed;
    playerData.winPoints = updatedPlayer.winPoints + playerData.winPoints;
    playerData.lossPoints = updatedPlayer.lossPoints + playerData.lossPoints;
    playerData.cSpoints = updatedPlayer.cSpoints + playerData.cSpoints;
    playerData.GFpts = GFpts + playerData.GFpts;
    playerData.GApts = GApts + playerData.GApts;
    playerData.GPpts = GPpts + playerData.GPpts;
    playerData.GDpts = GDPoints + playerData.GDpts;
    playerData.points = totalPoints + playerData.points;
    resolve(playerData);
  });
};

exports.calculatePPM = async (
  p1durationInSeconds,
  p2durationInSeconds,
  playerOneData,
  playerTwoData,
  p1Obj,
  p2Obj,
  matchData
) => {
  return new Promise((resolve, rejcet) => {
    var p1MatchesPlayed = playerOneData;
    var p2MatchesPlayed = playerTwoData;
    console.log('p1 matches played', p1MatchesPlayed);
    console.log('p2 matches played', p2MatchesPlayed);

    //  slide 2

    if (p1durationInSeconds == 0 && p2durationInSeconds == 0) {
      console.log('Player Turn Time is 0 for both players (P1 and P2)');
      if (matchData.winnerName == matchData.playerOneUserName) {
        console.log('player one winner');
        p1Obj.pointsPerMinute = +0.001 * p1MatchesPlayed; //( note positive sign here for loser)
        p2Obj.pointsPerMinute = -0.001 * p2MatchesPlayed; // ( note negative sign here)
      } else {
        console.log('player two winner');
        p2Obj.pointsPerMinute = +0.001 * p2MatchesPlayed; // ( note positive sign here for loser)
        p1Obj.pointsPerMinute = -0.001 * p1MatchesPlayed; // ( note negative sign here)
      }
      resolve({ p1: p1Obj.pointsPerMinute, p2: p2Obj.pointsPerMinute });
    }

    //slide 4 2a

    if (
      p1durationInSeconds > 0 &&
      p1durationInSeconds < 1 &&
      p2durationInSeconds == 0 &&
      matchData.winnerName == matchData.playerOneUserName
    ) {
      console.log('0< x <1 for first player and X=0 for other player');
      console.log('player one winner');
      p1Obj.pointsPerMinute = 0.001 * p1MatchesPlayed; // ( note positive sign here for loser)
      p2Obj.pointsPerMinute = -1 * 0.001 * p2MatchesPlayed; // ( note negative 1 multiplied here
      resolve({ p1: p1Obj.pointsPerMinute, p2: p2Obj.pointsPerMinute });
    }

    if (
      p2durationInSeconds > 0 &&
      p2durationInSeconds < 1 &&
      p1durationInSeconds == 0 &&
      matchData.winnerName == matchData.playerTwoUserName
    ) {
      console.log('0< x <1 for second player and X=0 for other player');
      console.log('player two winner');
      p2Obj.pointsPerMinute = 0.001 * p2MatchesPlayed; //( note positive sign here for loser)
      p1Obj.pointsPerMinute = -1 * 0.001 * p1MatchesPlayed; //( note negative 1 multiplied here
      resolve({ p1: p1Obj.pointsPerMinute, p2: p2Obj.pointsPerMinute });
    }

    //slide 5 2a

    if (
      p1durationInSeconds >= 1 &&
      p1durationInSeconds < 30 &&
      p2durationInSeconds == 0 &&
      matchData.winnerName == matchData.playerOneUserName
    ) {
      console.log('1<= x < 30 for winning player and X=0 for losing player');
      console.log('player one winner');
      p1Obj.pointsPerMinute = p1Obj.points / (p1durationInSeconds / 60) / 1000;
      p2Obj.pointsPerMinute = -1 * p1Obj.pointsPerMinute; //  (note the negative sign before P1 PPM)
      resolve({ p1: p1Obj.pointsPerMinute, p2: p2Obj.pointsPerMinute });
    } else if (
      p2durationInSeconds >= 1 &&
      p2durationInSeconds < 30 &&
      p1durationInSeconds == 0 &&
      matchData.winnerName == matchData.playerTwoUserName
    ) {
      console.log('1<= x < 30 for winning player and X=0 for losing player');
      console.log('player two winner');
      p2Obj.pointsPerMinute = p2Obj.points / (p2durationInSeconds / 60) / 1000;
      p1Obj.pointsPerMinute = -1 * p2Obj.pointsPerMinute; //(note the negative sign before P1 PPM)
      resolve({ p1: p1Obj.pointsPerMinute, p2: p2Obj.pointsPerMinute });
    }

    //slide 6 2b

    if (
      p1durationInSeconds >= 1 &&
      p1durationInSeconds < 30 &&
      p2durationInSeconds == 0 &&
      matchData.winnerName == matchData.playerTwoUserName
    ) {
      console.log('1<= x < 30 for losing player and X=0 for winning player');
      console.log('player two winner');
      p1Obj.pointsPerMinute =
        -1 * (p1Obj.points / (p1durationInSeconds / 60) / 1000);
      p2Obj.pointsPerMinute = -1 * p1Obj.pointsPerMinute; //(note the negative sign before P1 PPM)
      resolve({ p1: p1Obj.pointsPerMinute, p2: p2Obj.pointsPerMinute });
    }

    if (
      p2durationInSeconds >= 1 &&
      p2durationInSeconds < 30 &&
      p1durationInSeconds == 0 &&
      matchData.winnerName == matchData.playerOneUserName
    ) {
      console.log('1<= x < 30 for losing player and X=0 for winning player');
      console.log('player one winner');
      p2Obj.pointsPerMinute =
        -1 * (p2Obj.points / (p2durationInSeconds / 60) / 1000);
      p1Obj.pointsPerMinute = -1 * p2Obj.pointsPerMinute; //(note the negative sign before P1 PPM)
      resolve({ p1: p1Obj.pointsPerMinute, p2: p2Obj.pointsPerMinute });
    }

    //slide 7 3

    if (
      p1durationInSeconds >= 30 &&
      p2durationInSeconds >= 0 &&
      p2durationInSeconds < 1 &&
      matchData.winnerName == matchData.playerOneUserName
    ) {
      console.log(
        'one player turn time X>=30 and other player turn time  is 0<=X<1'
      );
      console.log('player one winner');
      p1Obj.pointsPerMinute = p1Obj.points / (p1durationInSeconds / 60);
      p2Obj.pointsPerMinute = +0.001 * p2MatchesPlayed;
      resolve({ p1: p1Obj.pointsPerMinute, p2: p2Obj.pointsPerMinute });
    } else if (
      p2durationInSeconds >= 30 &&
      p1durationInSeconds >= 0 &&
      p1durationInSeconds < 1 &&
      matchData.winnerName == matchData.playerTwoUserName
    ) {
      console.log(
        'one player turn time X>=30 and other player turn time  is 0<=X<1'
      );
      console.log('player two winner');
      p2Obj.pointsPerMinute = p2Obj.points / (p2durationInSeconds / 60);
      p1Obj.pointsPerMinute = +0.001 * p1MatchesPlayed;
      resolve({ p1: p1Obj.pointsPerMinute, p2: p2Obj.pointsPerMinute });
    }

    //slide 8 4
    if (
      p1durationInSeconds >= 30 &&
      p2durationInSeconds >= 1 &&
      p2durationInSeconds < 30
    ) {
      console.log(
        'PPM calculation when losing player turn time is X>= 30s and winning player turn time is at 1<=X<30 seconds at the exact time of disconnection'
      );
      if (matchData.winnerName == matchData.playerTwoUserName) {
        {
          console.log('player one winner');
          p1Obj.pointsPerMinute = p1Obj.points / (p1durationInSeconds / 60);
          p2Obj.pointsPerMinute =
            p2Obj.points / (p2durationInSeconds / 60) / 1000;
          resolve({ p1: p1Obj.pointsPerMinute, p2: p2Obj.pointsPerMinute });
        }
      }
    } else if (
      p2durationInSeconds >= 30 &&
      p1durationInSeconds >= 1 &&
      p1durationInSeconds < 30
    ) {
      console.log(
        'PPM calculation when losing player turn time is X>= 30s and winning player turn time is at 1<=X<30 seconds at the exact time of disconnection'
      );

      if (matchData.winnerName == matchData.playerOneUserName) {
        console.log('player two winner');
        p2Obj.pointsPerMinute = p2Obj.points / (p2durationInSeconds / 60);
        p1Obj.pointsPerMinute =
          p1Obj.points / (p1durationInSeconds / 60) / 1000;
        resolve({ p1: p1Obj.pointsPerMinute, p2: p2Obj.pointsPerMinute });
      }
    }

    //slide 9  5

    if (p1durationInSeconds >= 30 && p2durationInSeconds >= 30) {
      console.log(
        'PPM calculation when losing player turn time is X>= 30s and winning player turn time is at X>=30 seconds at the exact time of disconnection'
      );
      p1Obj.pointsPerMinute = p1Obj.points / (p1durationInSeconds / 60);
      p2Obj.pointsPerMinute = p2Obj.points / (p2durationInSeconds / 60);
      resolve({ p1: p1Obj.pointsPerMinute, p2: p2Obj.pointsPerMinute });
    }

    //slide 11

    if (
      p1durationInSeconds > 0 &&
      p1durationInSeconds < 1 &&
      p2durationInSeconds > 0 &&
      p2durationInSeconds < 1
    ) {
      console.log('Both players have x at 0< x <1');

      if (matchData.winnerName == matchData.playerOneUserName) {
        console.log('player one winner');
        p1Obj.pointsPerMinute = +0.001 * p1MatchesPlayed; // ( note positive sign here for loser)
        p2Obj.pointsPerMinute = -0.001 * p2MatchesPlayed; // ( note negative sign here)
      } else {
        console.log('player two winner');
        p2Obj.pointsPerMinute = +0.001 * p2MatchesPlayed; // ( note positive sign here for loser)
        p1Obj.pointsPerMinute = -0.001 * p1MatchesPlayed; // ( note negative sign here)
      }
      resolve({ p1: p1Obj.pointsPerMinute, p2: p2Obj.pointsPerMinute });
    }

    //slide 12

    if (
      p1durationInSeconds >= 1 &&
      p1durationInSeconds < 30 &&
      p2durationInSeconds >= 1 &&
      p2durationInSeconds < 30
    ) {
      console.log('Both players have X at 1<= x < 30');
      p1Obj.pointsPerMinute = p1Obj.points / (p1durationInSeconds / 60) / 1000;
      p2Obj.pointsPerMinute = p2Obj.points / (p2durationInSeconds / 60) / 1000;
      resolve({ p1: p1Obj.pointsPerMinute, p2: p2Obj.pointsPerMinute });
    }

    //slide 13
    if (
      p1durationInSeconds >= 1 &&
      p1durationInSeconds < 30 &&
      p2durationInSeconds > 0 &&
      p2durationInSeconds < 1
    ) {
      console.log('One player at  1<=X<30    other player at  0<x<1');
      if (matchData.winnerName == matchData.playerOneUserName) {
        console.log('playerone winner');
        p1Obj.pointsPerMinute =
          p1Obj.points / (p1durationInSeconds / 60) / 1000;
        p2Obj.pointsPerMinute = -p1Obj.pointsPerMinute;
      }
      resolve({ p1: p1Obj.pointsPerMinute, p2: p2Obj.pointsPerMinute });
    }

    if (
      p2durationInSeconds >= 1 &&
      p2durationInSeconds < 30 &&
      p1durationInSeconds > 0 &&
      p1durationInSeconds < 1
    ) {
      console.log('Second player at 1<=X<30  other player at  0<x<1');

      if (matchData.winnerName == matchData.playerTwoUserName) {
        console.log('player two winner');
        p2Obj.pointsPerMinute =
          p2Obj.points / (p2durationInSeconds / 60) / 1000;
        p1Obj.pointsPerMinute = -p2Obj.pointsPerMinute;
      }
      resolve({ p1: p1Obj.pointsPerMinute, p2: p2Obj.pointsPerMinute });
    }
  });
};

exports.registerLeagueSuccessfulPurchase = async (
  leagueId,
  userId,
  wallet_id
) => {
  let totalAllowed = 0;
  let remaining = 0;
  var leagueData = await League.findOne({
    _id: leagueId,
  }).lean();
  if (leagueData) {
    totalAllowed = leagueData.gameCount;
    remaining = leagueData.gameCount;
  }

  let ticket = shortid.generate();

  var getPrevData = await playerLeague
    .find({ userId: userId, leagueId: leagueId })
    .sort({ _id: -1 })
    .limit(1);

  if (getPrevData.length > 1) {
    if (getPrevData[0].remaining == getPrevData[0].totalAllowed) {
      // TODO: Throw New Error, You have already joined this league. But what does this means, do we give back the money???
      console.log("Yeah it is going here in this case...")
    }
  }

  var obj = {
    userId: userId,
    leagueId: leagueId,
    ticket: ticket,
    wallet_id: wallet_id,
    totalAllowed: totalAllowed,
    remaining: remaining,
    jiwemanCommision: leagueData.jiwemanCommision,
    bettingCompanyId: leagueData.bettingCompanyId,
  };

  var playerLeagueObj = new playerLeague(obj);

  await playerLeagueObj.save();

  var playerData = await Player.findOne({
    _id: playerLeagueObj.userId,
  });

  console.log(playerData);
  console.log(leagueData);

  if (leagueData.leagueStatus == 'active') {
    let subject = `Joga-Bonito – ${leagueData.leagueName} Ticket Purchase Receipt`;
    let body = `<div style="width: 680px; margin: 0 auto;">
          <div style="background: #504482; height: 80px;">
          <h3 style="color: #fff; font-size: 36px; font-weight: normal; padding: 18px 0 0 70px; margin: 0;">Welcome to Joga Bonito</h3>
          </div>
          <div style="background: #fff; padding: 23px 70px 20px 70px;">
          <h4 style="font-size: 24px; color: #504482; margin: 20px 0 30px;">Hi ${playerData.userName},</h4>
          <div style="color: #8b8382; font-size: 15px;">
          <p>Congratulations, You have successfully purchased the ticket for <strong>${leagueData.leagueName}</strong>!</p>
          <p>Please, find below the ticket to get entry in the <strong>${leagueData.leagueName}</strong></p>
          <p><strong>${playerLeagueObj.ticket}</strong></p>
          <p>Please, find below the transaction ID for your reference. Please save this at your side.</p>
          <p><strong>${playerLeagueObj.wallet_id}</strong></p>
          <p>Let's play FANTASTIC Games together!!!</p>
          <p>Cheers!!!</p>
          <div style="display: block; margin: 90px 0;">&nbsp;</div>
          </div>
          </div>
          <div style="height: 52px; background: #dfdfdf;">&nbsp;</div>
          </div>`;

    //send ticket to player who purchased the league via Email
    this.sendEmail(playerData.email, body, subject);
    console.log('ticket email Sent');
  }

  try {
    this.updateLeaguePrize(leagueData);
  } catch (error) { }

  return playerLeagueObj;
};

exports.registerBetSuccessfulPurchase = async (
  gameId,
  userId,
  wallet_id
) => {
  let totalAllowed = 0;
  let remaining = 0;
  var gameData = await OneOnOne.findOne({
    _id: gameId,
  }).lean();
  if (gameData) {
    totalAllowed = gameData.gameCount;
    remaining = gameData.gameCount;
  }

  let ticket = shortid.generate();

  var getPrevData = await playerLeague
    .find({ userId: userId, gameId: gameId })
    .sort({ _id: -1 })
    .limit(1);

  if (getPrevData.length > 1) {
    if (getPrevData[0].remaining == getPrevData[0].totalAllowed) {
      // TODO: Throw New Error, You have already joined this league. But what does this means, do we give back the money???
      console.log("Yeah it is going here in this case...")
    }
  }

  var obj = {
    userId: userId,
    gameId: gameId,
    ticket: ticket,
    wallet_id: wallet_id,
    totalAllowed: totalAllowed,
    remaining: remaining,
    jiwemanCommision: gameData.jiwemanCommision,
    bettingCompanyId: gameData.bettingCompanyId,
  };

  var playerBetObj = new playerBet(obj);

  await playerBetObj.save();

  var playerData = await Player.findOne({
    _id: playerBetObj.userId,
  });

  console.log(playerData);
  console.log(gameData);

  // if (leagueData.leagueStatus == 'active') {
  // let subject = `Joga-Bonito – ${gameData.gameName} Bet Purchase Receipt`;
  // let body = `<div style="width: 680px; margin: 0 auto;">
  //       <div style="background: #504482; height: 80px;">
  //       <h3 style="color: #fff; font-size: 36px; font-weight: normal; padding: 18px 0 0 70px; margin: 0;">Welcome to Joga Bonito</h3>
  //       </div>
  //       <div style="background: #fff; padding: 23px 70px 20px 70px;">
  //       <h4 style="font-size: 24px; color: #504482; margin: 20px 0 30px;">Hi ${playerData.userName},</h4>
  //       <div style="color: #8b8382; font-size: 15px;">
  //       <p>Congratulations, You have successfully purchased the ticket for <strong>${gameData.gameName}</strong>!</p>
  //       <p>Please, find below the ticket to get entry in the <strong>${leagueData.leagueName}</strong></p>
  //       <p><strong>${playerBetObj.ticket}</strong></p>
  //       <p>Please, find below the transaction ID for your reference. Please save this at your side.</p>
  //       <p><strong>${playerBetObj.wallet_id}</strong></p>
  //       <p>Let's play FANTASTIC Games together!!!</p>
  //       <p>Cheers!!!</p>
  //       <div style="display: block; margin: 90px 0;">&nbsp;</div>
  //       </div>
  //       </div>
  //       <div style="height: 52px; background: #dfdfdf;">&nbsp;</div>
  //       </div>`;

  // //send ticket to player who purchased the league via Email
  // this.sendEmail(playerData.email, body, subject);
  // console.log('ticket email Sent');
  // }

  // try {
  //   this.updateBetPrize(gameData);
  // } catch (error) { }

  return playerBetObj;
};

exports.calculatePrize_1 = async (data, type) => {
  data.prize = [];

  var prizeAmount = data.origianlEntryFee * 2;

  let jiwemanCommisionPercentage = (data.jiwemanCommisionPercentage / 100) * data.origianlEntryFee;
  let bettingCompanyCommisionPercentage = (data.bettingCompanyCommisionPercentage / 100) * data.origianlEntryFee;
  // console.log(jiwemanCommisionPercentage);
  if (data.origianlEntryFee) {
    data.stakeAmount = parseFloat(jiwemanCommisionPercentage + bettingCompanyCommisionPercentage + data.origianlEntryFee).toFixed(2);

  } else {
    data.stakeAmount = 0;
  }
  let gameplayWinningsAmountToBeWonPerBet = data.origianlEntryFee;
  let salesTax = parseFloat((data.salesTax / 100) * data.stakeAmount);
  let taxOnStakeOfBet = parseFloat(data.stakeAmount * (data.taxOnStakeOfBet / 100)).toFixed(2);
  // console.log(data.stakeAmount + salesTax + taxOnStakeOfBet);
  data.entryFee = Math.ceil((parseFloat(data.stakeAmount) + parseFloat(salesTax) + parseFloat(taxOnStakeOfBet)));
  data.bettingCompanyCommission = parseFloat(bettingCompanyCommisionPercentage).toFixed(2);
  data.jiwemanCommision = parseFloat(jiwemanCommisionPercentage).toFixed(2);
  data.gameplayWinningsAmountToBeWonPerBet = data.origianlEntryFee;
  data.taxOnGrossSale = data.salesTax;
  data.taxOnBettingStake = taxOnStakeOfBet;

  // console.log('3772',data);
  // console.log('gameplayWinningsAmountToBeWonPerBet',data.origianlEntryFee);
  // console.log('bettingCompanyCommission',data.bettingCompanyCommission);
  // console.log('jiwemanCommision',data.jiwemanCommision);
  // console.log('stakeAmount',data.stakeAmount);
  // console.log('taxOnGrossSale',data.salesTax);
  // console.log('taxOnBettingStake',taxOnStakeOfBet);
  // console.log('entryFee',data.entryFee);

  if (type == 'oneonone') {
    var n = data.gameCount;
    var prize = prizeAmount / n;
    var playerInvolve = 2;
    var noOfGames = data.gameCount;
    for (var i = 0; i <= noOfGames; i++) {
      let position = i;
      if ((((gameplayWinningsAmountToBeWonPerBet * playerInvolve) / noOfGames) * position) > gameplayWinningsAmountToBeWonPerBet) {

        console.log('#######3794######',`((( ${gameplayWinningsAmountToBeWonPerBet}*${playerInvolve})/${noOfGames})*${position})-
        ((${data.winningTax}/100)*(((${gameplayWinningsAmountToBeWonPerBet}*${playerInvolve})/${noOfGames})*${position}-${data.origianlEntryFee}))`)

        data.prize[i] = ((((gameplayWinningsAmountToBeWonPerBet * playerInvolve) / noOfGames) * position) - ((data.winningTax / 100) * (((gameplayWinningsAmountToBeWonPerBet * playerInvolve) / noOfGames) * position - gameplayWinningsAmountToBeWonPerBet))).toFixed(2);

      }
      else {
        data.prize[i] = (((gameplayWinningsAmountToBeWonPerBet * playerInvolve) / noOfGames) * position).toFixed(2);
      }
    }
  }

  return data;

}


exports.calculatePrize_2 = async (data, type) => {
  console.log("customer_first");
  // console.log('3716',type);
  data.prize = [];
   
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
  let bettingCompanyCommission = parseFloat((data.bettingCompanyCommisionPercentage / 100) * gameplayWinningsAmountToBeWonPerBet).toFixed(2);

  // step 7 : Jiweman Betting Commission % * step 3
  let jiwemanBettingCommission = parseFloat((data.jiwemanCommisionPercentage / 100) * gameplayWinningsAmountToBeWonPerBet).toFixed(2);

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
  return data;

}

exports.getBeyonicAPIToken = async (bettingCompanyId) => {
  const result = await bettingCompany.findById(bettingCompanyId)
  return result.apiToken
}

exports.registerWebhookInAccount = async (apiToken) => {
  return await axios.post(
    `https://app.beyonic.com/api/webhooks`,
    {
      event: "payment.status.changed",
      target: "https://dev.jiweman.com/api/auth/winningsPaymentWebhook"
    },
    {
      headers: {
        authorization: `Token ${apiToken}`,
      },
    }
  );
}



exports.generateReferCode = () => {
  shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');
  return shortid.generate()
}


exports.createInvitorMailBody = (getFriendsUserName, userName, amount, userCurrency, email, type) => {
  let subject = `Joga-Bonito – Hooray, You are rewarded!!!`;
  let msg;
  if (type == 'signin') {
    msg = `<p>Congratulations, Your friends ${userName} use invite(referral) code to join Joga Bonito!!!</p>`
  }
  else if (type == 'league' || type == 'oneononebet') {
    msg = `<p>Congratulations, Your friends ${userName} completed 1st payment successfully.</p>`

  }

  let body = `<div style="width: 680px; margin: 0 auto;">
  <div style="background: #504482; height: 80px;">
  <h3 style="color: #fff; font-size: 36px; font-weight: normal; padding: 18px 0 0 70px; margin: 0;">Welcome to Joga Bonito</h3>
  </div>
  <div style="background: #fff; padding: 23px 70px 20px 70px;">
  <h4 style="font-size: 24px; color: #504482; margin: 20px 0 30px;">Hi ${getFriendsUserName},</h4>
  <div style="color: #8b8382; font-size: 15psrx;">
  ${msg} 
  <p>You won ${amount} ${userCurrency}</p>
  <p>Funds will be available shortly in your Joga Bonito Wallet.</p>
  <p>Let's play FANTASTIC Games together!!!</p>
  <p>Cheers!!!</p>
  <div style="display: block; margin: 90px 0;">&nbsp;</div>
  </div>
  </div>
  <div style="height: 52px; background: #dfdfdf;">&nbsp;</div>
  </div>`

  exports.sendEmail(email, body, subject);


}

exports.createInviteeMailBody = (playerName, userName, amount, userCurrency, email, type) => {
  let subject = `Joga-Bonito – Hooray, You are rewarded!!!`;
  let msg;
  if (type == 'signin') {
    msg = `<p>Congratulations, You accepted your friends ${userName} invite to join Joga Bonito!!!</p>`
  }
  else if (type == 'league' || type == 'oneononebet') {
    msg = `<p>Congratulations, You completed your 1st payment successfully.</p>`
  }

  let body = `<div style="width: 680px; margin: 0 auto;">
   <div style="background: #504482; height: 80px;">
   <h3 style="color: #fff; font-size: 36px; font-weight: normal; padding: 18px 0 0 70px; margin: 0;">Welcome to Joga Bonito</h3>
   </div>
   <div style="background: #fff; padding: 23px 70px 20px 70px;">
   <h4 style="font-size: 24px; color: #504482; margin: 20px 0 30px;">Hi ${playerName},</h4>
   <div style="color: #8b8382; font-size: 15psrx;">
    ${msg}
   <p>You won ${amount} ${userCurrency}</p>
   <p>Funds will be available shortly in your Joga Bonito Wallet.</p>
   <p>Let's play FANTASTIC Games together!!!</p>
   <p>Cheers!!!</p>
   <div style="display: block; margin: 90px 0;">&nbsp;</div>
   </div>
   </div>
   <div style="height: 52px; background: #dfdfdf;">&nbsp;</div>
   </div>`

  exports.sendEmail(email, body, subject);

}

exports.rewardFriend = (payload, type) => {
  return new Promise(async function (resolve, reject) {
    console.log("reward...")
    console.log(payload.player.referBy);
    if (_.isEmpty(payload.player.referBy)) {
      return resolve({ message: 'referBy empty', status: false })
    }

    var getBettingData = await BettingCompany.findOne({ _id: payload.bettingCompanyId }).lean();
    var getplayerLeagueData, getEvent;
    var userId = payload.sub;

    if (type == 'league') {
      getplayerLeagueData = await playerLeague
        .find({ userId: userId }).lean();
      if (getBettingData.referralSetting) {
        getEvent = _.find(getBettingData.referralSetting, { event: 'league_purchase' });
      }
    }
    else if (type == 'oneononebet') {
      getplayerLeagueData = await playerBet.find({ userId: userId }).lean();
      getEvent = _.find(getBettingData.referralSetting, { event: 'bet_purchase' });
    }
    else if (type == 'signin') {
      var getFriendsData = await Player.findOne({ userName: payload.player.referBy }).lean();
      getEvent = _.find(getBettingData.referralSetting, { event: 'signin' })

      await creditToWallet(getFriendsData._id, getFriendsData.bettingCompanyId, getEvent.amount, getEvent.amount, '', `Refer Reward - ${getEvent.event} by ${payload.player.userName}`, 'successful', false)
      await creditToWallet(payload.sub, getFriendsData.bettingCompanyId, getEvent.amount, getEvent.amount, '', `Rererral Code - ${getEvent.event} by ${payload.player.userName}`, 'successful', false)

      resolve({ message: `refer amount (${getEvent.amount}) added to your and your friends's account`, status: true });

      exports.createInvitorMailBody(getFriendsData.userName, payload.player.userName, getEvent.amount, payload.player.userCurrency, getFriendsData.email, type);
      exports.createInviteeMailBody(payload.player.userName, getFriendsData.userName, getEvent.amount, payload.player.userCurrency, payload.player.email, type)

    } else {
      resolve({ message: 'invalid type', status: false })
    }

    if (getplayerLeagueData && getplayerLeagueData.length == 0) {
      if (getEvent) {
        var getFriendsData = await Player.findOne({ userName: payload.player.referBy }).lean();
        await creditToWallet(payload.sub, getFriendsData.bettingCompanyId, getEvent.amount, getEvent.amount, '', `Refer Reward - ${getEvent.event} by ${payload.player.userName}`, 'successful', false)

        await creditToWallet(getFriendsData._id, getFriendsData.bettingCompanyId, getEvent.amount, getEvent.amount, '', `Refer Reward - ${getEvent.event} by ${payload.player.userName}`, 'successful', false)
        resolve({ message: `refer amount (${getEvent.amount}) added to your and your friends's account`, status: true });

        exports.createInvitorMailBody(getFriendsData.userName, payload.player.userName, getEvent.amount, payload.player.userCurrency, getFriendsData.email, type);
        exports.createInviteeMailBody(payload.player.userName, getFriendsData.userName, getEvent.amount, payload.player.userCurrency, payload.player.email, type)

      }
      else {
        resolve({ message: 'event not found', status: false });
      }
    }
    else {
      resolve({ message: 'not eligible for reward', status: false })
    }


  })
}

exports.log = (method,reqBody,statusCode,res) => {

  if(config.LOG_ENV){

    logger.info(method,{req:reqBody,statusCode:statusCode,res:res,env:config.LOG_ENV})

  }


}
