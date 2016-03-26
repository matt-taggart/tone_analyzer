var express = require('express');
var logger = require('morgan');
var watson = require('watson-developer-cloud');
var app = express();

var PORT = process.env.PORT || 3000;

app.use(logger('dev'));
app.use(express.static(__dirname + '/public'));

 
// var alchemy_language = watson.alchemy_language({
//   api_key: '<api_key>'
// });
 
// var params = {
//   text: 'IBM Watson won the Jeopardy television show hosted by Alex Trebek'
// };
 
// alchemy_language.sentiment(params, function (err, response) {
//   if (err)
//     console.log('error:', err);
//   else
//     console.log(JSON.stringify(response, null, 2));
// });

app.use('*', function(req, res) {
  res.send('hello world!');
});

app.listen(PORT, function() {
  console.log('Listening on PORT %s', PORT);
});

