var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'tone.analyzer@gmail.com',
        pass: 'toneanalyzer'
    }
});

console.log('created');
transporter.sendMail({
from: 'toneanalyzer@gmail.com',
  to: 'mtaggart89@gmail.com',
  subject: 'hello world!',
  text: 'hello world!'
});