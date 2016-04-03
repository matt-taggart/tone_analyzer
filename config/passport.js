var LocalStrategy = require('passport-local');
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

  passport.use('register', new LocalStrategy ({
    passReqToCallback: true
  }, function(req, username, password, done) {

      User.findOne({ username: username}, function(err, userData) {

        if (err) {
          return err;
        }

        if (!userData) {
          var newUser = new User(req.body);

          User.save(function(err, userData) {
            if (err) {
              return err;
            } else {
              done(null, userData);
            }
          });
        }

      });
  }));

  passport.use('login', new LocalStrategy ({
    passReqToCallback: true
  }, function(req, username, password, done) {
      User.findOne({ username: username}, function(err, userData) {

        if (err) {
          return err
        }

        if (!userData) {
          done(null, false);
        }

        if (userData) {
          bcrypt.compare(password, userData.password, function(err, user) {
            if (user) {
              done(null, user);
            } else {
              return err;
            }
          });
        }

      });
  }));

}



