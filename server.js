var express = require('express');
var app = express();
var logger = require('morgan');
var PORT = process.env.PORT || 3000;

app.use(logger('dev'));
app.use(express.static('public'));

var routes = require('./controllers/routes.js');

app.use('/', routes);

app.get('*', function(req, res) {
  res.sendFile(process.cwd() + '/public/views/index.html');
});

app.listen(PORT, function() {
  console.log("Listening on ", PORT);
});


