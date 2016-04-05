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

router.post('/register', passport.authenticate('register'), function(req, res) {
  res.json(req.user);
});

router.post('/login', function(req, res, next) {
  passport.authenticate('login', function(err, user, info) {
    console.log(user);
    console.log(req.session.flash);

    if (err) {
      return next(err); // will generate a 500 error
    }
    // Generate a JSON response reflecting authentication status
    if (!user) {
      return res.json({ success : false, message : 'authentication failed' });
    }

    req.login(user, function(err) {
      if (err) {
        return next(err);
      }
      return res.json({ success : true, message : 'authentication succeeded' });
    });      
  })(req, res, next);
});

// router.post('/login', passport.authenticate('login', { failureFlash: true }), function(req, res) {
//   console.log(req.session.flash);
//   res.json(req.user);
// });

router.post('/logout', function(req, res) {
  req.logout();
  res.json(req.isAuthenticated());
});

router.get('/user', function(req, res) {
  res.json(req.user);
});

router.get('*', function(req, res) {
  res.sendFile(process.cwd() + '/public/views/index.html');
});


module.exports = router;