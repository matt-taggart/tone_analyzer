var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser')
var watson = require('watson-developer-cloud');
var mongoose = require('mongoose');
var app = express();

var PORT = process.env.PORT || 3000;

app.use(logger('dev'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

var db = 'mongodb://localhost/ToneDownForWhatDB'
var ContentDB = require('./model/contentAnalysisModel.js')
mongoose.connect(db)

var tone_analyzer = watson.tone_analyzer({
  url: "https://gateway.watsonplatform.net/tone-analyzer-beta/api",
  password: "B0jj6n5i9NXZ",
  username: "a52b4d31-5e94-4acb-bbbe-7de263677456",
  version: 'v3-beta',
  version_date: '2016-02-11'
})

app.post('/tonetext', function(req, res) {

  tone_analyzer.tone({ text: req.body.content },
    function(err, tone) {
      console.log(tone)
      if (err) {
        console.log('hit error')
        console.log(err);
      } else {
        console.log('hit api call')

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
        console.log('api call still good')
        var content = new ContentDB ({
          content: req.body.content,
          emotion_tone_data: emotionToneArray,
          social_tone_data: socialToneArray,
          writing_tone_data: writingToneArray
        })
        content.save(function(err, response){
          if (err) {
            throw err
          } else {
            console.log('content saved into db')
            res.json(response);
          }
        })
      }
  });
})

// app.get('*', function(req, res) {
//   res.sendFile(process.cwd() + '/public/views/index.html');
// });

app.get('/demobox', function(req, res){
  res.sendFile(__dirname+ '/public/input_demo.html')
})

app.get('/calldata', function(req, res){
  ContentDB.find({}).exec().then(function(response) {
    res.json(response);
  });
})

app.listen(PORT, function() {
  console.log('Listening on PORT %s', PORT);
});

