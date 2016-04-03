var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var router = express.Router();

router.use(session({
  secret: 'super secret',
  resave: false,
  saveUninitialized: false
}));

router.use(bodyParser.urlencoded({
  extended: false
}));

router.post('/login', function(req, res) {

});

router.post('/register', function(req, res) {

});

router.get('*', function(req, res) {
  res.sendFile(process.cwd() + '/public/views/index.html');
});


module.exports = router;