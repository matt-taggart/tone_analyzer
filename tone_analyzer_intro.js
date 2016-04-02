var watson = require('watson-developer-cloud');
var mongoose = require('mongoose');
var db = 'mongodb://localhost/ToneDownForWhatDB'

var ContentDB = require('./model/contentAnalysisModel.js')
mongoose.connect(db)

var tone_analyzer = watson.tone_analyzer({
  url: "https://gateway.watsonplatform.net/tone-analyzer-beta/api",
  password: "B0jj6n5i9NXZ",
  username: "a52b4d31-5e94-4acb-bbbe-7de263677456",
  version: 'v3-beta',
  version_date: '2016-02-11'
});

tone_analyzer.tone({ text: 'A word is dead when it is said, some say. Emily Dickinson' },
  function(err, tone) {
    if (err)
      console.log(err);
    else
      console.log(JSON.stringify(tone, null, 2));
      // for (var i = 0; i < tone.document_tone.tone_categories.length; i++) {

      //   for (var j = 0; j < tone.document_tone.tone_categories.tones.length; j++) {
      //     console.log(tone.document_tone.tone_categories.tones[j])
      //   };

        // var content = new ContentDB({
        //   content : text,
        //   tone_score: [tone_type: ]
        // })
      // };
});
