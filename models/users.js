var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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
    unique: [true, "Sorry, that username has been taken"]
  },

  password: {
    type: String,
    trim: true,
    required: [true, "Must enter a password to register"]
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

var User = mongoose.model('User', UserSchema);
module.exports = User; 