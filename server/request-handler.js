var qs = require('querystring');

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

  var headers = defaultCorsHeaders;
  var statusCode = 200;
  headers['Content-Type'] = 'application/json';
  // headers['Content-Type'] = 'text/plain';
  var result = [];


  console.log("Serving request type " + request.headers['access-control-request-method'] + '/' + request.method + " for url " + request.url);
  // console.log(request.headers);
  var url = (request.url).split('/');
  var room = url[2];
  console.log(url,room);

  if(request.headers['access-control-request-method'] === 'GET' || request.method === 'GET') {
    //give messageData
    //should 404 if file not there
    if(url[1] !== 'classes') {
      statusCode = 404;
    } else {
      // what is url[1]? Always a room? Ever something more in url? If there are messages for that room set results to them
      if(room in messageData) {
        result = messageData[room];
      }
    }
      
  }

  if(request.headers['access-control-request-method'] === 'POST' || request.method === 'POST') {
    if(url[1] === 'classes') {
      if(!(room in messageData)) {
        messageData[room] = [];
      }
      statusCode = 201;
      var body = '';
      request.on('data', function(data) {
        body += data;
      });
      request.on('end', function() {
        var post = JSON.parse(body);
        //extend with various things
        messageData[room].push(post);
      });  
    }
  }

  // See the note below about CORS headers.
  response.writeHead(statusCode, headers);
  response.write(JSON.stringify({results:result}));  
  
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.

  response.end();
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 30 // Seconds.
};

module.exports = requestHandler;