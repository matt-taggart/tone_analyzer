var express = require('express');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var passport = require('passport');
var MongoStore = require('connect-mongo')(session);

var flash = require('connect-flash');
var router = express.Router();

var google = require('googleapis');
var googleCredentials = require('../config/google-credentials.js')
var OAuth2 = google.auth.OAuth2;

var oauth2Client = new OAuth2(googleCredentials.clientId, googleCredentials.clientSecret, googleCredentials.callbackURL);
var scopes = [
  'https://www.googleapis.com/auth/gmail.readonly'
];

var url = oauth2Client.generateAuthUrl({
  access_type: 'online',
  scope: scopes
});

router.use(cookieParser());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: false
}));

var db = 'mongodb://localhost/users'
mongoose.connect(db);

router.use(session({
  secret: 'super secret',
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

router.use(flash());
router.use(passport.initialize());
router.use(passport.session());
require('../config/passport.js')(passport);

var googleUrl = require('./googleOAuth.js');
console.log(googleUrl);

router.post('/register', function(req, res, next) {
  passport.authenticate('register', function(err, user, info) {

    if (err) {
      return next(err); // will generate a 500 error
    }

    if (!user) {
      var errorMessage = req.session.flash.registerMessage[req.session.flash.registerMessage.length-1];
      return res.json({ authenticated: user, message: errorMessage });
    }

    if (user) {
      return res.json('success!');
    }

  })(req, res, next);
});

router.post('/login', function(req, res, next) {
  passport.authenticate('login', function(err, user, info) {

    if (err) {
      return next(err); // will generate a 500 error
    }
    // Generate a JSON response reflecting authentication status
    if (!user) {
      var errorMessage = req.session.flash.loginMessage[req.session.flash.loginMessage.length-1];
      return res.json({ authenticated: user, message: errorMessage });
    }

    req.login(user, function(err) {
      if (err) {
        return next(err);
      }
      console.log(req.isAuthenticated());
      return res.json({ authenticated: true, user: user });
    });      
  })(req, res, next);
});

router.post('/logout', function(req, res) {
  req.logout();
  res.json(req.isAuthenticated());
});

router.get('/user', function(req, res) {
  res.json({ authenticated: req.isAuthenticated(), user: req.user });
});

router.get('/auth/google/:url', function(req, res) {
  oauth2Client.getToken(req.query.code, function(err, tokens) {
    // Now tokens contains an access_token and an optional refresh_token. Save them.
    console.log(req.query.code);
    console.log(tokens);
    console.log(err);
    if(!err) {
      oauth2Client.setCredentials(tokens);
      gmail.users.messages.get({ userId: 'tone.analyzer@gmail.com'}, function(err, data) {
        if (!err) {
          console.log(data);
        }
      });
    }
  });
});

router.get('*', function(req, res) {
  res.sendFile(process.cwd() + '/public/views/index.html');
});

module.exports = router;