var env = require('dotenv').config({ silent: true })
var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser')
var mongoose = require('mongoose');
var app = express();
var PORT = process.env.PORT || 3000;

app.use(logger('dev'));
app.use(express.static('public'));

var routes = require('./controllers/routes.js');

app.use('/', routes);

app.listen(PORT, function() {
  console.log('Listening on PORT %s', PORT);
});

