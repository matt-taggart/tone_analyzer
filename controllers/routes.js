var express = require('express');
var mongoose = require('mongoose');
var session = require('express-session');
var bodyParser = require('body-parser');
var passport = require('passport');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
var router = express.Router();

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

require('../config/passport.js')(passport);
router.use(passport.initialize());
router.use(passport.session());
router.use(flash());

router.post('/register', passport.authenticate('register'), function(req, res) {
  res.json(req.user);
});

router.post('/login', passport.authenticate('login', { failureFlash: true }), function(req, res) {
  console.log(req);
  res.json(req.user);
});

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