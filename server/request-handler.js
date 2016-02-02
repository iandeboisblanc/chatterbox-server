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
  var result = [];


  // console.log("Serving request type " + request.method + " for url " + request.url);
  var url = (request.url).split('/');
  var room = url[2];

  if(request.method === 'GET') {
    if(url[1] !== 'classes') {
      statusCode = 404;
    } else {
      if(room in messageData) {
        result = messageData[room];
      }
    }
  }

  if(request.method === 'POST') {
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

  response.writeHead(statusCode, headers);
  // console.log(response.write);
  // response.write();  
  response.end(JSON.stringify({results:result}));
};

var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 30 // Seconds.
};

exports.requestHandler = requestHandler;




