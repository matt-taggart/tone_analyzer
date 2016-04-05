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

};



