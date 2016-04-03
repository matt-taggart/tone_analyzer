var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var passport = require('passport');
var router = express.Router();

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

router.post('/login', function(req, res) {
  console.log(req.body);
  res.json(req.body)
});

router.post('/register', function(req, res) {
  console.log(req.body);
});

router.get('*', function(req, res) {
  res.sendFile(process.cwd() + '/public/views/index.html');
});


module.exports = router;