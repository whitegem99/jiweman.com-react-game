/*
 * --------------------------------------------------------------------------
 * Created by Barquecon Technologies on 12/03/2019 by Dipak Adsul
 * ---------------------------------------------------------------------------
 */

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
// var logger = require('morgan');
var mongoose = require('mongoose');
// let winstonLogger = require('./logger/log');
const bodyParser = require('body-parser');
let expressValidator = require('express-validator');
var cors = require('cors');
var swaggerJSDoc = require('swagger-jsdoc');
var config = require('./config');
var passport = require('passport');
var Strategy = require('passport-facebook').Strategy;
const fs = require('fs');
const settingsRoute = require('./apis/settings/settings.route');
var compression = require('compression');
const nocache = require('nocache');
const helmet = require('helmet');


// logger.info("New Test!")
// logger.error("This is an error message!")
// logger.error("This is an error message with an object!", { error: true, message: "There was a problem!"})
/*
 * --------------------------------------------------------------------------
 *  DB connection import to database.js file
 * ---------------------------------------------------------------------------
 */
require('./apis/common/database')(app, mongoose);
var commonController = require('./apis/common/commonfunction');

mongoose.Promise = global.Promise;
var app = express();

require('./apis/cron/upcomingLeagueNotification')();
require('./apis/cron/startLeagueNotification')();
require('./apis/cron/updateLeaguePrizeDistribution')();
require('./apis/cron/calculateAnalytics')();
require('./apis/cron/updateLeagues')();
require('./apis/cron/updateCurrency')();
require('./apis/cron/generateInvoices')();

/*
 * --------------------------------------------------------------------------
 *  Swagger definition
 * ---------------------------------------------------------------------------
 */
var swaggerDefinition = {
  info: {
    title: 'Node Swagger API',
    version: '1.0.0',
    description: 'Demonstrating how to describe a RESTful API with Swagger',
  },
  securityDefinitions: {
    bearer: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      description: 'HTTP Basic Authentication. Works over `HTTP` and `HTTPS`',
    },
  },

  host: 'dev.jiweman.com/api',
  basePath: '/',
};

// options for the swagger docs
var options = {
  swaggerDefinition: swaggerDefinition,
  // path to the API docs
  apis: [
    './apis/leaderboard/*.js',
    './apis/league/*.js',
    './apis/playerAuth/*.js',
    './apis/matchPlay/*.js',
     './apis/player/*.js',
    './apis/oneonone/*.js',
    './apis/playerLeague/*.js',
    './apis/playWithFriends/*.js',
    './apis/paymentAPIs/collections/*.js',
    './apis/paymentAPIs/wallet/*.js',
    './apis/playerOneVSOneBet/*.js'
  ], // pass all in array
};

/*
 * --------------------------------------------------------------------------
 *  initialize swagger-jsdoc
 * ---------------------------------------------------------------------------
 */
var swaggerSpec = swaggerJSDoc(options);

/*
 * --------------------------------------------------------------------------
 *  view engine setup
 * ---------------------------------------------------------------------------
 */
// app.disable('etag');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// app.use(logger('dev'));
app.use(cors());
app.options('*', cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// compress all responses
app.use(compression());
// app.use(helmet());
// app.use(nocache())
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(expressValidator());

// app.use(function (req, res, next) {
//   if (config.LOGGER) {
//     winstonLogger.info(req.path);
//     if (req.method === 'GET') {
//       winstonLogger.info('Request Query', req.query);
//     }
//     if (req.method === 'POST') {
//       winstonLogger.info('Request Body', req.body);
//     }
//     if (req.method === 'DELETE') {
//       winstonLogger.info('Request Body', req.body);
//     }
//     winstonLogger.info('Auth Token', req.headers.authorization);
//     next();
//   } else {
//     next();
//   }
// });

/*
 * --------------------------------------------------------------------------
 *  Importining API routers
 * ---------------------------------------------------------------------------
 */

let playerAuthRoute = require('./apis/playerAuth/player.auth.route');
let pushRoute = require('./apis/pushNotification/push.route');
let playerFormationRoute = require('./apis/formations/formations.route');
let bettingRoute = require('./apis/betting/betting.route');
let bettingTransactionRoute = require('./apis/betting/betting.transaction.route');
let playersRoute = require('./apis/player/player.route');
let PlayerStadiumsRoute = require('./apis/stadium/stadium.route');
let teamManagementroute = require('./apis/team-management/team-management.routes');

let currencyToRpRoute = require('./apis/settlemetrequest/currencytorp.route');
let rpToCurrencyRoute = require('./apis/settlemetrequest/rptocurrency.route');
let userSettlementRequestRoute = require('./apis/settlemetrequest/usersettlementrequest.route');
let playerTournamentRoute = require('./apis/temp-apis/playertournament.route');
let matchIdRoute = require('./apis/temp-apis/matchid.route');
let realMoneyTournamentRoute = require('./apis/temp-apis/terminate.route');
let winnerDeclarationRoute = require('./apis/temp-apis/winnerdeclaration.route');
let endRoute = require('./apis/temp-apis/end.route');
let startRoute = require('./apis/temp-apis/start.route');
//let getTournamentRoute = require('./apis/temp-apis/getalltournamentroom.route');
let bettingOneOnOneRoute = require('./apis/temp-apis/bettingoneonone.route');
let virtualCurrencyRoute = require('./apis/temp-apis/virtualcurrency.route');
let feedbackRoute = require('./apis/temp-apis/answerforfeedbackquestion.route');
let companyFeedback = require('./apis/temp-apis/answerforfeedbackquestion.route');
let questionFeedback = require('./apis/temp-apis/getallcompanyfeedbackquestion.route');
//let getAllChallangesRoute = require('./apis/temp-apis/getallchallanges.route');
//let removesFriendRoute = require('./apis/temp-apis/removefriends.route');
//let getAllFriendListRoute = require('./apis/temp-apis/getallfriendlist.route');

let FriendsRoute = require('./apis/playWithFriends/playwithfriends.routes');
let leaderboard = require('./apis/leaderboard/leaderboard.routes');
let league = require('./apis/league/league.routes');
let prizePercentage = require('./apis/league/prizePercentage.routes');

let adminRoute = require('./apis/admin/admin.routes');
let analyticsRoute = require('./apis/analytics/analytics.routes');

let checkBalanceRoutes = require('./apis/paymentAPIs/checkBalance/checkBalance.routes');
let paymentOptionsOrProvidersRoutes = require('./apis/paymentAPIs/paymentOptionsOrProviders/paymentOptionsOrProviders.routes');
let bankBranchesRoutes = require('./apis/paymentAPIs/bankBranches/bankBranches.routes');
let collectionRoutes = require('./apis/paymentAPIs/collections/collections.routes');
let payoutRoutes = require('./apis/paymentAPIs/payout/payout.routes');
let pointsRoutes = require('./apis/points/points.routes');
let webHookRoutes = require('./apis/paymentAPIs/webHooks/webHooks.routes');
let playerAnalysisRoutes = require('./apis/playerAnalysis/playerAnalysis.routes');
let MatchRoutes = require('./apis/matchPlay/Match.routes');
let playerLeagues = require('./apis/playerLeague/playerLeague.routes');
let walletRoute = require('./apis/paymentAPIs/wallet/wallet.routes');
let userVerification = require('./apis/userVerification/userVerification_routes');
let oneOnOne = require('./apis/oneonone/oneonone.routes');
let feedback = require('./apis/feedback/feedback.routes');
let bettingCompany = require('./apis/bettingCompany/bettingCompany.route');
let invoice = require('./apis/invoice/invoice.routes');
let oneononeBet = require('./apis/playerOneVSOneBet/playerOneVSOneBet.routes');
let updateMatchState = require('./apis/matchStates/matchStates.routes');
let coneectionState = require('./apis/connectionStates/connectionStates.routes');

app.use('/api/auth', playerAuthRoute);
app.use('/api', pushRoute);
app.use('/api', playerFormationRoute);
app.use('/api/betting', bettingRoute);
app.use('/api/getAllBetCompanies', bettingRoute);
app.use('/api/bettingtransactions', bettingTransactionRoute);
app.use('/api', playersRoute);
app.use('/api', PlayerStadiumsRoute);
app.use('/api', teamManagementroute);
app.use('/api/settlemet', currencyToRpRoute);
app.use('/api/settlemet', rpToCurrencyRoute);
app.use('/api/settlemet', userSettlementRequestRoute);
app.use('/api/8PlayerTournament', playerTournamentRoute);
app.use('/api/8PlayerTournament', matchIdRoute);
app.use('/api/8PlayerTournament', realMoneyTournamentRoute);
app.use('/api/8PlayerTournament', winnerDeclarationRoute);
app.use('/api/8PlayerTournament', endRoute);
app.use('/api/8PlayerTournament', startRoute);
//app.use('/8PlayerTournament', getTournamentRoute);
app.use('/api/BettingOneOnOne', bettingOneOnOneRoute);
app.use('/api/VirtualCurrency', virtualCurrencyRoute);
app.use('/api/CompanyFeedback', feedbackRoute);
app.use('/api/CompanyFeedback', companyFeedback);
app.use('/api/CompanyFeedback', questionFeedback);
//app.use('/PlayWithFriend', getAllChallangesRoute);
//app.use('/PlayWithFriend', removesFriendRoute);
//app.use('/PlayWithFriend', getAllFriendListRoute);
app.use('/api/PlayWithFriend', FriendsRoute);
app.use('/api', leaderboard);
app.use('/api', league);
app.use('/api', prizePercentage);
app.use('/api', adminRoute);
app.use('/api/analytics', analyticsRoute);

app.use('/api', checkBalanceRoutes);
app.use('/api', paymentOptionsOrProvidersRoutes);
app.use('/api', bankBranchesRoutes);
app.use('/api', collectionRoutes);
app.use('/api', payoutRoutes);
app.use('/api', pointsRoutes);
app.use('/api', webHookRoutes);
app.use('/api', playerAnalysisRoutes);
app.use('/api', MatchRoutes);
app.use('/api', playerLeagues);
app.use('/api/settings', settingsRoute);
app.use('/api/wallet', walletRoute);
app.use('/api',oneOnOne)
app.use('/api',userVerification);
app.use('/api',feedback);
app.use('/api',bettingCompany);
app.use('/api',invoice);
app.use('/api',oneononeBet);
app.use('/api',updateMatchState);
app.use('/api',coneectionState);

app.use('/master', express.static(path.join(__dirname, 'master', 'www')));

app.get('/master*', function (req, res) {
  res.sendFile(path.join(__dirname, 'master', 'www', 'index.html'));
});

app.use('/player', express.static(path.join(__dirname, 'player', 'www')));

app.get('/player*', function (req, res) {
  res.sendFile(path.join(__dirname, 'player', 'www', 'index.html'));
});

app.get('/', function (req, res) {
  res.redirect('/player');
});
// Configure the Facebook strategy for use by Passport.
//
// OAuth 2.0-based strategies require a `verify` function which receives the
// credential (`accessToken`) for accessing the Facebook API on the user's
// behalf, along with the user's profile.  The function must invoke `cb`
// with a user object, which will be set at `req.user` in route handlers after
// authentication.
passport.use(
  new Strategy(
    {
      // clientID: process.env['FACEBOOK_CLIENT_ID'],
      // clientSecret: process.env['FACEBOOK_CLIENT_SECRET'],
      clientID: '330458494316586',
      //clientID: '892621001073012',
      clientSecret: 'f938b5ac1d94aded9066735d9f2710e3',
      //clientSecret: '99b262d91b4b3f7ead79baa5a8f39d39',
      callbackURL: 'https://localhost:8080/return',
    },
    function (accessToken, refreshToken, profile, cb) {
      // In this example, the user's Facebook profile is supplied as the user
      // record.  In a production-quality application, the Facebook profile should
      // be associated with a user record in the application's database, which
      // allows for account linking and authentication with other identity
      // providers.
      return cb(null, profile);
    }
  )
);

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing.  However, due to the fact that this
// example does not have a database, the complete Facebook profile is serialized
// and deserialized.
passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

// Configure view engine to render EJS templates.
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

//app.use('/oneononematch', oneOnOneRoomRoute);
app.get('/swagger.json', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// app.get('/', function (req, res) {
//   res.render('home', { user: req.user });
// });

// app.get('/login', function (req, res) {
//   res.render('login');
// });

//app.get('/login/facebook', passport.authenticate('facebook'));

// app.get('/return', function (req, res) {
//   console.log('awesomekick');

//   res.redirect('/profile');
// });

// app.get('/profile', function (req, res) {
//   console.log('prof');
//   res.render('profile', { user: req.user });
// });

/*
 * --------------------------------------------------------------------------
 *  Creating default roles import from comman/commonfunction
 * ---------------------------------------------------------------------------
 */

commonController.createDefaultRoles(() => {});

/*
 * --------------------------------------------------------------------------
 *  Creating default Fornations import from comman/commonfunction
 * ---------------------------------------------------------------------------
 */

commonController.createDefaultFormations(() => {});

/*
 * --------------------------------------------------------------------------
 *  Creating default Points Information from common/commonfunction
 * ---------------------------------------------------------------------------
 */

commonController.createDefaultPointsInfo(() => {});

/*
 * --------------------------------------------------------------------------
 *  Creating default Admin entry from common/commonfunction
 * ---------------------------------------------------------------------------
 */

commonController.createDefaultAdmin(() => {});

/*
 * --------------------------------------------------------------------------
 *  Creating default Stadium import from common/commonfunction
 * ---------------------------------------------------------------------------
 */

commonController.createDefaultStadium(() => {});

/*
 * --------------------------------------------------------------------------
 *  catch 404 and forward to error handler
 * ---------------------------------------------------------------------------
 */

app.use(function (req, res, next) {
  next(createError(404));
});

/*
 * --------------------------------------------------------------------------
 *  error handler
 * ---------------------------------------------------------------------------
 */
app.use(function (err, req, res, next) {
  console.log('In Error Handler');
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(res.locals);
  // render the error page
  res.status(err.status || 500);
  res.json(res.locals);
});

String.prototype.toObjectId = function () {
  var ObjectId = require('mongoose').Types.ObjectId;
  return new ObjectId(this.toString());
};

module.exports = app;
