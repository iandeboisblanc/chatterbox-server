var express = require('express');
var app = express();

app.get('/', function(req, res) {
  res.send('WORDS!');
});

app.get('/classes/messages', function(req, res) {
  //some stuff
});

app.get('/classes/*', function(req, res) {
  //some stuff
});

var port = 3000;

app.listen(port, function() {
  console.log('Listening on port' + port);
});















