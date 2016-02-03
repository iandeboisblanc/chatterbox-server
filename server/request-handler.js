var fs = require('fs');

/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

var messageData ={};

var requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 30 // Seconds.
};
// console.log(request.url);

  var headers = defaultCorsHeaders;
  var statusCode = 404;
  if(request.url === '/') {
    // open historicalFile
    fs.readFile(__dirname + '/messages.txt', 'utf-8', function(err, data) {
      if(!err) {
        messageData = JSON.parse(data);
      }
    });
    fs.readFile(__dirname + '/../client/index.html', "utf-8", function(error,data){
      if(error) {
        console.log('error!!!');
        headers['Content-Type'] = 'text/plain';
        response.writeHead(405, headers);
        response.end();
      } else {
        headers['Content-Type'] = 'text/html';
        response.writeHead(202,headers);
        response.end(data);
      }
   });
  }
  var url = (request.url).split('/');
  var room = url[2];

  if(url[1] === 'client') {
    if(url[2] === 'styles') {
      fs.readFile(__dirname + '/../client/styles/styles.css', "utf-8", function(error,data){
        if(error) {
          console.log('error!!!');
          headers['Content-Type'] = 'text/plain';
          response.writeHead(406, headers);
          response.end();
        } else {
          console.log(request.url);
          headers['Content-Type'] = 'text/css';
          response.writeHead(202,headers);
          response.end(data, "utf-8");
          return;
        }
     }); 
    }

    if(url[2] === 'env') {
      fs.readFile(__dirname + '/../client/env/config.js', "utf-8", function(error,data){
        if(error) {
          console.log('error!!!');
          headers['Content-Type'] = 'text/plain';
          response.writeHead(406, headers);
          response.end();
        } else {
          console.log(request.url);
          headers['Content-Type'] = 'text/javascript';
          response.writeHead(202,headers);
          response.end(data, "utf-8");
          return;
        }
     }); 
    }

    if(url[2] === 'scripts') {
      fs.readFile(__dirname + '/../client/scripts/app.js', "utf-8", function(error,data){
        if(error) {
          console.log('error!!!');
          headers['Content-Type'] = 'text/plain';
          response.writeHead(406, headers);
          response.end();
        } else {
          console.log(request.url);
          headers['Content-Type'] = 'text/javascript';
          response.writeHead(202,headers);
          response.end(data, "utf-8");
          return;
        }
     }); 
    }
  }
  if(request.method === 'GET') {
    if(url[1] === 'classes') {
      var result = [];
      statusCode = 200;
      headers['Content-Type'] = 'application/json';
      if(room === 'messages') {
        // serve all messages
        for(var r in messageData) {
          for(var i = 0; i < messageData[r].length; i++) {
            result.push(messageData[r][i]);
          }
        }
      } else if(room in messageData) {
        result = messageData[room];
      }
      response.writeHead(statusCode, headers);
      response.end(JSON.stringify({results:result}));
    }    
  }

  if(request.method === 'POST') {
    console.log('Post requested.', url[1]);
    if(url[1] === 'classes') {
      if(!(room in messageData)) {
        messageData[room] = [];
      }
      statusCode = 201;
      headers['Content-Type'] = 'application/json';
      var body = '';
      request.on('data', function(data) {
        body += data;
      });
      request.on('end', function() {
        var post = JSON.parse(body);
        //extend with various things
        messageData[room].push(post);
        // write to historical file
        var stringData = JSON.stringify(messageData);
        fs.writeFile(__dirname + '/messages.txt', stringData, function(err) {
          if(err) {
            console.log('Oh no, it is ' + err);
          }
        });
      });  

      response.writeHead(statusCode, headers);
      response.end();
    }
  }
};

exports.requestHandler = requestHandler;




