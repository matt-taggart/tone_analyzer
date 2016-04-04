var express = require('express');
var mongoose = require('mongoose');
var session = require('express-session');
var bodyParser = require('body-parser');
var passport = require('passport');
var router = express.Router();

var db = 'mongodb://localhost/users'
mongoose.connect(db);

router.use(session({
  secret: 'super secret',
  resave: false,
  saveUninitialized: false
}));

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: false
}));

require('../config/passport.js')(passport);
router.use(passport.initialize());
router.use(passport.session());

router.post('/register', passport.authenticate('register'), function(req, res) {
  console.log(req.isAuthenticated());
  console.log(req.user);
  console.log(req.body);
});

router.post('/login', passport.authenticate('login'), function(req, res) {
  console.log(req.body);
  console.log(req.user);
});

router.get('*', function(req, res) {
  res.sendFile(process.cwd() + '/public/views/index.html');
});


module.exports = router;