var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');
var GoogleStrategy = require('passport-google-oauth2').Strategy;
var User = require('../models/users.js');
var googleUser = require('./google-oauth.js');

module.exports = function(passport) {

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use('register', new LocalStrategy({
    passReqToCallback: true
  }, function(req, username, password, done) {
    console.log(req.session);
    User.findOne({ username: username }, function(err, userData) {
      if (err) {
        return err;
      }

      if (!userData) {

        var newUser = new User(req.body);

        newUser.save(function(err, userData) {
          if (err) {
            console.log(err);
          } else {
            return done(null, userData);
          }
        });

      } else {
        console.log('That user is already taken.');
      }

    });
  }));

  passport.use('login', new LocalStrategy({
    passReqToCallback: true
  }, function(req, username, password, done) {
    User.findOne({ username: username}, function(err, userData) {
      if (err) {
        return err;
      }

      if (!userData) {
        console.log(err);
        done(null, false);
      } 

     if (userData) {
      bcrypt.compare(password, userData.password, function(err, user) {
        if (user) {
         done(null, userData);
        } else {
          console.log(err);
        }
      });
     }

    });
  }));


  passport.use('google-auth', new GoogleStrategy ({
    clientId: googleCredentials.clientId,
    clientSecret: googleCredentials.clientSecret,
    callbackURL: googleCredentials.callbackURL
  }, function(request, accessToken, refreshToken, profile, done) {
    console.log(profile);
    User.findOne({ googleId: profile.id }, function(err, user) {
      if (err) {
        return err;
      }

      if (user) {
        return done(null, user);
      } else {
        var newGoogleUser = new googleUser({
          googleId: profile.id,
          googleToken: request,
          googleName: profile.displayName,
          googleEmail: profile.emails[0].value
        });

        newGoogleUser.save(function(err) {
          if (err) {
            return err;
          } else {
            return done(null, newGoogleUser)
          }
        })
      }


    });


  }))

};



