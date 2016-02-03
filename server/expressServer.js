var express = require('express');
var app = express();
var fs = require('fs');
var messageData = {};

app.get('/', function(req, res) {
  fs.readFile(__dirname + '/messages.txt', 'utf-8', function(err, data) {
    if(!err) {
      messageData = JSON.parse(data);
    }
  });
  fs.readFile(__dirname + '/../client/index.html', "utf-8", function(error,data){
    if(error) {
      res.send(error);
    } else {
      res.send(data);
    }
  });
});

app.get('/client/*', function(req, res) {
  var reqUrl = req.url.split('/')[2];
  if(reqUrl === ___) {
    //do a ___ thing
  } else if(reqUrl === __d__) {
    //do a __d__ thing
  }
});

app.get('/classes/*', function(req, res) {
  if(req.url.split('/')[2] === 'messages') {
    //all
  } else {
    //some
  }
});

app.post('/classes/*', function(req, res) {
  var room = req.url.split('/')[2];
  if(!(room in messageData)) {
    messageData[room] = [];
  }
  // headers['Content-Type'] = 'application/json';
  var body = '';
  req.on('data', function(data) {
    body += data;
  });
  req.on('end', function() {
    messageData[room].push(JSON.parse(body));
    var stringData = JSON.stringify(messageData);
    fs.writeFile(__dirname + '/messages.txt', stringData, function(err) {
      if(err) {
        console.log('Oh no, it is ' + err);
      }
    });
  });  
});

app.listen(3000, function() {
  console.log('Listening on port 3000');
});















