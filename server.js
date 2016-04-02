var express = require('express');
var logger = require('morgan');
var watson = require('watson-developer-cloud');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')
// var tonez = require('./tone_analyzer_intro.js')
var app = express();

var PORT = process.env.PORT || 3000;

app.use(logger('dev'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

var db = 'mongodb://localhost/ToneDownForWhatDB'
var ContentDB = require('./model/contentAnalysisModel.js')
mongoose.connect(db)

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

var tone_analyzer = watson.tone_analyzer({
  url: "https://gateway.watsonplatform.net/tone-analyzer-beta/api",
  password: "B0jj6n5i9NXZ",
  username: "a52b4d31-5e94-4acb-bbbe-7de263677456",
  version: 'v3-beta',
  version_date: '2016-02-11'
});

app.post('/texttone', function(req, res) {

  tone_analyzer.tone({ text: req.body.toneText },
    function(err, tone) {
      if (err)
        console.log(err);
      else

      var emotionToneArray = []
      var writingToneArray = []
      var socialToneArray = []

      for (var i = 0; i < tone.document_tone.tone_categories[0].tones.length; i++) {
        emotionToneArray.push({
          tone_type: tone.document_tone.tone_categories[0].tones[i].tone_name, 
          tone_score: tone.document_tone.tone_categories[0].tones[i].score 
        })
      };

      for (var i = 0; i < tone.document_tone.tone_categories[1].tones.length; i++) {
        writingToneArray.push({
          tone_type: tone.document_tone.tone_categories[1].tones[i].tone_name, 
          tone_score: tone.document_tone.tone_categories[1].tones[i].score 
        })
      };

      for (var i = 0; i < tone.document_tone.tone_categories[2].tones.length; i++) {
        socialToneArray.push({
          tone_type: tone.document_tone.tone_categories[2].tones[i].tone_name, 
          tone_score: tone.document_tone.tone_categories[2].tones[i].score 
        })
      };
      
    //Save to DB- put into a post request
    var content = new ContentDB ({
      content: req.body.toneText,
      emotion_tone_data: emotionToneArray,
      social_tone_data: socialToneArray,
      writing_tone_data: writingToneArray
    })
    content.save(function(err, response){
      if (err) {throw err}
      return response
    })
  });


})

// app.use('*', function(req, res) {
//   res.send('hello world!');
// });

app.get('/demobox', function(req, res){
  res.sendFile(__dirname+ '/public/input_demo.html')
})

app.listen(PORT, function() {
  console.log('Listening on PORT %s', PORT);
});

