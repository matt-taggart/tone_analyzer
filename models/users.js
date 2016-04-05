var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');

var UserSchema = new Schema({
 
  firstname: {
    type: String,
    trim: true,
    lowercase: true,
    required: [true, "Must enter your first name to register"]
  },

  lastname: {
    type: String,
    trim: true,
    lowercase: true,
    required: [true, "Must enter your last name to register"]
  },

   username: {
    type: String,
    trim: true,
    lowercase: true,
    required: [true, "Must enter a username to register"],
    unique: [true, "Sorry, that username has been taken"],
    minlength: [6, 'Username must be at least 5 characters.']
  },

  password: {
    type: String,
    trim: true,
    required: [true, "Must enter a password to register"],
    minlength: [6, 'Password must be at least 6 characters.']
  },

  email: {
    type: String,
    trim: true,
    lowercase: true,
    required: [true, "Must enter Email is required to register."],
  },

  created: {
    type: Date,
    default: Date.now
  }

});

UserSchema.pre('save', function(next) {
  var user = this;
  user.password = bcrypt.hashSync(user.password, 10);
  next();
});

var User = mongoose.model('User', UserSchema);
module.exports = User; 