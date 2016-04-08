var google = require('googleapis');
var googleCredentials = require('../config/google-credentials.js')
var OAuth2 = google.auth.OAuth2;

var oauth2Client = new OAuth2(googleCredentials.clientId, googleCredentials.clientSecret, googleCredentials.callbackURL);

var scopes = [
  'https://www.googleapis.com/auth/gmail.readonly'
];

var url = oauth2Client.generateAuthUrl({
  access_type: 'online',
  scope: scopes
});



