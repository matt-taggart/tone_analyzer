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

//Define a middleware function to be used for every secured route
var auth = function(req, res, next) {
  if (!req.isAuthenticated()) {
    res.send(401);
  } else {
    next();
  }
}

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
      return res.json({ authenticated: req.isAuthenticated(), user: user });
    });      
  })(req, res, next);
});

router.get('/loggedin', auth, function(req, res) {
  // console.log(req.isAuthenticated());
  // console.log(req.user);
  res.json(req.isAuthenticated() ? req.user : '0');
})

router.get('/auth/google', passport.authenticate('google-auth', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', function(req, res, next) {
  passport.authenticate('google-auth', function(err, user, info) {

    if (err) {
      return next(err); // will generate a 500 error
    }


    // Generate a JSON response reflecting authentication status
    // if (!user) {
    //   var errorMessage = req.session.flash.loginMessage[req.session.flash.loginMessage.length-1];
    //   return res.json({ authenticated: user, message: errorMessage });
    // }

    if (!user) {
      console.log(err);
    }

    req.login(user, function(err) {
      if (err) {
        return next(err);
      }
      var firstName = user.googleName;
      req.session.userData = { authenticated: req.isAuthenticated(), user: firstName };
      res.redirect('/auth/google/success');
    });  


  })(req, res, next);
});


router.post('/logout', function(req, res) {
  req.logout();
  res.json(req.isAuthenticated());
});


router.get('*', function(req, res) {
  res.sendFile(process.cwd() + '/public/views/index.html');
});

module.exports = router;