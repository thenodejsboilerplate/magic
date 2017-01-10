'use strict';
const restify = require('restify');  
const config = require('./src/config/get-config');
const server = restify.createServer({
  name    : config.name,
  version : config.version	
	//log:
});

require('./src/libs/mongoose-connect');

const morgan = require('morgan');  
const passport = require('passport');  
// Log requests to console
server.use(morgan('dev')); 

//middlewares
//Note: bodyParser() takes care of turning your request data into a JavaScript object on the server automatically.
server.use(restify.bodyParser());
//Parses the HTTP query string (i.e., /foo?id=bar&name=mark). If you use this, the parsed content will always be available in req.query, additionally params are merged into req.params.
server.use(restify.queryParser());
//Parses out the Accept header, and ensures that the server can respond to what the client asked for. You almost always want to just pass in server.acceptable here, as that's an array of content types the server knows how to respond to (with the formatters you've registered). If the request is for a non-handled type, this plugin will return an error of 406.
server.use(restify.acceptParser(server.acceptable));
//server.use(restify.gzipResponse());

// server.get('/', function(req,res,next){
//   console.log('enteringinto frontpage');
//   res.send('frontpage');
//   next();
// });
// server.get('/about', function(req,res,next){
//   console.log('entering into about');
//   res.send('frontpage about page');
//   next();
// });


// Initialize passport for use // Use the passport package in our application
server.use(passport.initialize());  
//And now we can import our JWT passport strategy. Enter this below our mongoose connection:

// Enable CORS from client-side
server.use(function(req, res, next) {  
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});





// Bring in defined Passport Strategy
require('./src/libs/passport')(passport);  
require('./src/routes')(server);


server.get(/\/assets\/.*(js|css|png|jpg)$/, restify.serveStatic({
  directory: './src/public'
}));

server.get(/\/?.*/, restify.serveStatic({
  directory: './src/views',
  default: 'index.html'
}));



/**
 * Error Handling
 */
server.on('uncaughtException', (req, res, route, err) => {
  console.error(err.stack);
  res.json(`error : ${err}`);
});


server.listen(config.port, function() {
  console.log('%s listening at %s', server.name, server.url);
});