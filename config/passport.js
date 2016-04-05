var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');
var User = require('../models/users.js');

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
        console.log(err);
        return err;
      }

      if (!userData) {
        console.log(err);
        done(null, false, req.flash('loginMessage', 'Username or password is invalid.'));
      } 

     if (userData) {
      bcrypt.compare(password, userData.password, function(err, user) {
        if (user) {
         done(null, userData);
        } else {
          console.log(err);
          done(null, false, req.flash('loginMessage', 'Username or password is invalid.'));
        }
      });
     }

    });
  }));

};



