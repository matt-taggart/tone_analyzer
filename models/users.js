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
    minlength: [6, 'Username must be at least 6 characters.']
  },

  password: {
    type: String,
    trim: true,
    minlength: [6, 'Password must be at least 6 characters']
  },

  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i
, 'Please enter a valid e-mail address.']
  },

  googleId: {
    type: String
  },

  googleAccessToken: {
    type: String
  },

  googleRefreshToken: {
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
