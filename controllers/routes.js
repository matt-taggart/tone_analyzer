var express = require('express');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var passport = require('passport');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
var router = express.Router();

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

// router.post('/register', passport.authenticate('register'), function(req, res) {
//   res.json(req.user);
// });


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

router.post()

router.post('/logout', function(req, res) {
  req.logout();
  res.json(req.isAuthenticated());
});

router.get('/user', function(req, res) {
  res.json({ authenticated: req.isAuthenticated(), user: req.user });
});

router.get('*', function(req, res) {
  res.sendFile(process.cwd() + '/public/views/index.html');
});


module.exports = router;