
//NECESSARY VARIABLES 
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var methodOverride = require('method-override');
var log = require('./libs/log')(module);

var app = express();


//USES 
app.use(favicon('./favicon.ico'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, "public")));


//ROUTING


// ERRORS
app.use(function(req, res, next) {
	res.status(404);
	log.debug("Not found URL: %s", req.url);
	res.send({error: 'Not found'});
	return;
});

app.use(function(req, res, next){
	res.status(err.status || 500);
	log.error('Internal error: %s', res.statusCode, err.message);
	res.json({error: err.message});
	return;
});

app.get('/ErrorExample', function(req, res, next){
	next(new Error('Random error!'));
});


//START SERVER
app.listen(1337, function() {
	console.log('Express server listening port 1337');
});