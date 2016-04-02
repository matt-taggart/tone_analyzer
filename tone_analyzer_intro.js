var watson = require('watson-developer-cloud');

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
});