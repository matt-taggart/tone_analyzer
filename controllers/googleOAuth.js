var google = require('googleapis');
var googleCredentials = require('google-credentials.js')
var OAuth2 = google.auth.OAuth2;

var oauth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);