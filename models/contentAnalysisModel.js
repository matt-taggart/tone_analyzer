var mongoose = require('mongoose');
var Schema = mongoose.Schema

var contentSchema = new Schema({
  name: String,
  content: String,
  emotion_tone_data: [{tone_type: String, tone_score: Number}],
  writing_tone_data: [{tone_type: String, tone_score: Number}],
  social_tone_data: [{tone_type: String, tone_score: Number}]
  // user: [{type: Schema.Types.ObjectId, ref: 'UsersDB'}]
});

module.exports = mongoose.model('Content', contentSchema)