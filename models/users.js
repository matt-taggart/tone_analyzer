var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');

var UserSchema = new Schema({
 
  firstname: {
    type: String,
    trim: true,
    lowercase: true
  },

  lastname: {
    type: String,
    trim: true,
    lowercase: true
  },

   username: {
    type: String,
    trim: true,
    lowercase: true,
    minlength: [6, 'Username must be at least 5 characters.']
  },

  password: {
    type: String,
    trim: true
  },

  email: {
    type: String,
    trim: true,
    lowercase: true
  },

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
  },

  created: {
    type: Date,
    default: Date.now
  }

});

UserSchema.pre('save', function(next) {
  var user = this;
  if(user.password !== undefined) {
    user.password = bcrypt.hashSync(user.password, 10);
  }
  next();
});

var User = mongoose.model('User', UserSchema);
module.exports = User; 