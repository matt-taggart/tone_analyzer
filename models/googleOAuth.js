var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var googleProfile = new Schema({

  googleId: {
    type: String
  },

  googleToken: {
    type: String
  },

  googleName: {
    type: String
  },

  googleEmail: {
    type: String
  }

});

var googleUser = mongoose.model('googleUser', googleProfile);
module.exports = googleUser;