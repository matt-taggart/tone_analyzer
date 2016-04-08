var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth2').Strategy;
var User = require('../models/users.js');
var googleUser = require('../models/googleOAuth.js');
var googleCredentials = require('./google-credentials.js');
var bcrypt = require('bcryptjs');

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
    User.findOne({ username: username }, function(err, userData) {
      if (err) {
        console.log(err);
        return err;
      }

      if (!userData) {

        var newUser = new User(req.body);
        newUser.validateSync();

        newUser.save(function(err, userData) {
          if (err) {
            return done(null, false, req.flash('registerMessage', err.errors));
          } else {
            return done(null, userData);
          }
        });

      } else {
        return done(null, false, req.flash('registerMessage', 'Username already exists.'));
      }

    });
  }));

  passport.use('login', new LocalStrategy({
    passReqToCallback: true
  }, function(req, username, password, done) {
    User.findOne({ username: username}, function(err, userData) {
      if (err) {
        console.log(err);
        return err;
      }

      if (!userData) {
        console.log(err);
        return done(null, false, req.flash('loginMessage', 'Username or password is invalid.'));
      } 

     if (userData) {
      bcrypt.compare(password, userData.password, function(err, user) {
        if (user) {
          return done(null, userData);
        } else {
          console.log(err);
          return done(null, false, req.flash('loginMessage', 'Username or password is invalid.'));
        }
      });
     }

    });
  }));

  passport.use('google-auth', new GoogleStrategy({
    clientID: googleCredentials.clientId,
    clientSecret: googleCredentials.clientSecret,
    callbackURL: googleCredentials.callbackURL,
    passReqToCallback: true
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
          googleEmail: profile.emails.value
        });

        newGoogleUser.save(function(err) {
          if (err) {
            return err;
          } else {
            return done(null, newGoogleUser)
          }
        });
      }

    });

  }));

};



