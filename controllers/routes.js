var express = require('express');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var passport = require('passport');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
var nodemailer = require('nodemailer');
var xoauth2 = require('xoauth2');
var watson = require('watson-developer-cloud');
var googleCredentials = require('../config/google-credentials.js');
var ContentDB = require('../models/contentAnalysisModel.js');
var transporterObject;

var router = express.Router();

router.use(cookieParser());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: false
}));

var LOCAL_DB = 'mongodb://localhost/users';

var options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
                replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } };

if (process.env.NODE_ENV === 'production') {
  mongoose.connect(process.env.MONGODB_URI, options);
} else {
  mongoose.connect(LOCAL_DB, options);
}

router.use(session({
  secret: 'super secret',
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

router.use(flash());
router.use(passport.initialize());
router.use(passport.session());
require('../config/passport.js')(passport);

var auth = function(req, res, next) {
  (!req.isAuthenticated()) ? res.sendFile(process.cwd() + '/public/views/error_page.html') : next();
}

router.post('/register', function(req, res, next) {
  passport.authenticate('register', function(err, user, info) {

    if (err) {
      return next(err); // will generate a 500 error
    }

    if (!user) {
      var errorMessage = req.session.flash.registerMessage[req.session.flash.registerMessage.length-1];
      if (errorMessage.email) {
        return res.json({ registered: user, message: errorMessage.email.message });
      } else {
        return res.json({ registered: user, message: errorMessage });
      }
    }

    if (user) {
      return res.json('success');
    }

  })(req, res, next);
});

router.post('/login', function(req, res, next) {
  passport.authenticate('login', function(err, user, info) {
    console.log("authentication method began");
    if (err) {
      console.log("authentication method began");
      return next(err); // will generate a 500 error
    }
    // Generate a JSON response reflecting authentication status
    if (!user) {
      var errorMessage = req.session.flash.loginMessage[req.session.flash.loginMessage.length-1];
      return res.json({ authenticated: user, message: errorMessage });
    }

    req.login(user, function(err) {
      if (err) {
        return next(err);
      }
      return res.json({ authenticated: user });
    });
  })(req, res, next);
});

router.get('/loggedin', function(req, res) {
  res.json(req.isAuthenticated() ? req.user : '0');
});

function createTransporter(user, clientId, clientSecret, refreshToken, accessToken) {
  var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      xoauth2: xoauth2.createXOAuth2Generator({
        user: user,
        clientId: clientId,
        clientSecret: clientSecret,
        refreshToken: refreshToken,
        accessToken: accessToken
      })
    }
  })

  transporterObject = transporter;
}

router.get('/auth/google', passport.authenticate('google-auth', { scope: ['profile', 'email', 'https://mail.google.com'], accessType: 'offline', approvalPrompt: 'force' }));

router.get('/auth/google/callback', function(req, res, next) {
  passport.authenticate('google-auth', function(err, user, info) {
    if (err) {
      console.log(err);
      return next(err); // will generate a 500 error
    }

    if (!user) {
      return res.redirect('/welcome');
      // return res.json({ authenticated: user });
    }

    req.login(user, function(err) {
      if (err) {
        console.log(err);
        return next(err);
      }

      createTransporter(user.googleEmail, googleCredentials.clientId, googleCredentials.clientSecret, user.googleRefreshToken, user.googleAccessToken);

      res.redirect('/welcome');
    });


  })(req, res, next);
});

router.get('/main_page', auth, function(req, res) {
  if (req.user.googleEmail) {
    createTransporter(req.user.googleEmail, googleCredentials.clientId, googleCredentials.clientSecret, req.user.googleRefreshToken, req.user.googleAccessToken);
  }

  res.sendFile(process.cwd() + '/public/views/main_page.html');
});

router.post('/logout', function(req, res) {
  req.logout();
  res.json(req.isAuthenticated());
});

var tone_analyzer = new watson.ToneAnalyzerV3({
  url: "https://gateway.watsonplatform.net/tone-analyzer/api",
  password: "L1UkyZynb5Dr",
  username: "66e59ce0-1c42-4f0d-836d-0352d6d6ffb2",
  version: "2016-02-01",
  version_date: "2016-05-19"
});

router.post('/tonetext', function(req, res) {

  tone_analyzer.tone({ text: req.body.content },
    function(err, tone) {
      // console.log(tone)
      if (err) {
        return err
      } else {
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
        var content = new ContentDB ({
          content: req.body.content,
          htmlContent: req.body.htmlContent,
          emotion_tone_data: emotionToneArray,
          social_tone_data: socialToneArray,
          writing_tone_data: writingToneArray,
          userId: req.body.userId,
          drafttitle: req.body.draftTitle
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

router.get('/calldata', function(req, res){
  ContentDB.find({}).exec().then(function(response) {
    console.log(response);
    res.json(response);
  });
})


//Get a specific draft
router.get('/textdata/:id', function(req, res){
  var id = req.params.id
  ContentDB.find({_id: id}).exec().then(function(response) {
    console.log(response);
    res.json(response);
  });
})

//Get drafts on page load
router.get('/drafts', function(req, res){
  ContentDB.find({}).exec().then(function(response) {
    res.json(response);
  });
})

//Update a post
router.post('/updatetext/:id', function(req, res){

  var id = req.params.id;
  console.log(req.body.text)
  console.log(req.body.htmlText)

  tone_analyzer.tone({ text: req.body.text },
    function(err, tone) {
      if (err) {
        return err
      } else {
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
        ContentDB.findOneAndUpdate(
          {_id: req.params.id},
          {$set:
            {content: req.body.text,
             htmlContent: req.body.htmlText,
            emotion_tone_data: emotionToneArray,
            social_tone_data: socialToneArray,
            writing_tone_data: writingToneArray}
          }).then(function(response){
            console.log(response)
            res.json(response)
          })
      }
    });
  });

router.delete('/deletedraft/:id', function(req, res){
  console.log(req.params.id);
  ContentDB.find({ _id: req.params.id }).remove().then(function(response){
    res.json({});
  })
})

router.post('/send_email', function(req, res) {

  transporterObject.verify(function(error, success) {
     if (error) {
          console.log(error);
     } else {
          console.log('Server is ready to take our messages');
     }
  });

  transporterObject.sendMail({
    from: req.body.email,
    to: req.body.sendTo,
    subject: req.body.subject,
    html: req.body.message
  }, function(err, info) {
    if (err) {
      return console.log(err);
    }
    console.log('Message sent: ' + info.response);
  });

  res.send({ success: true, message: 'Email Successful!'});
});

router.get('*', function(req, res) {
  res.sendFile(process.cwd() + '/public/views/index.html');
});

module.exports = router;
