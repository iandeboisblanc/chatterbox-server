var express = require('express');
var app = express();
var fs = require('fs');
var messageData = {};

app.use(express.static(__dirname + '/../client'));

app.get('/', function(req, res) {
  fs.readFile(__dirname + '/messages.txt', 'utf-8', function(err, data) {
    if(!err) {
      messageData = JSON.parse(data);
    }
  });
  fs.readFile('/client/index.html', "utf-8", function(error,data){
    if(error) {
      res.send(error);
    } else {
      res.send(data);
    }
  });
});

app.get('/classes/*', function(req, res) {
  var result = [];
  if(req.url.split('/')[2] === 'messages') {
    for(var r in messageData) {
      for(var i = 0; i < messageData[r].length; i++) {
        result.push(messageData[r][i]);
      }
    }
  } else {
    result = messageData[room];
  }
  res.send({results:result});
});

app.post('/classes/*', function(req, res) {
  var room = req.url.split('/')[2];
  if(!(room in messageData)) {
    messageData[room] = [];
  }
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
  res.send();  
});

app.listen(3000, function() {
  console.log('Listening on port 3000');
});















