
//NECESSARY VARIABLES 
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var methodOverride = require('method-override');
var log = require('./libs/log')(module);
var config = require('./libs/config');

var app = express();


//USES 
app.use(favicon('./favicon.ico'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, "public")));


var PersonModel = require('./libs/mongo').PersonModel;
var DebitModel = require('./libs/mongo').DebitModel;
var CreditModel = require('./libs/mongo').CreditModel;

//ROUTING
app.get('/persons', function(req, res){
	return PersonModel.find(function(err, persons){
		if (!err) {
			return res.json(persons);
		}
		else {
			res.statusCode = 500;
			log.error('Internal error(%d): %s', res.statusCode, err.message);
			res.json({error : 'Server error'});
		}
	});
});
app.post('/persons', function(req, res){
	var Person = new PersonModel({
		name : req.body.name,
		surname : req.body.surname,
		phone : req.body.phone
	});

	Person.save(function(err) {
		if (!err) {
			log.info('Person created');
			return res.json({status: 'OK'});
		}
		else {
			console.log(err);
			if (err.name === 'ValidationError') {
				res.statusCode = 400;
				res.json({error : 'ValidationError'});
			}
			else {
				res.statusCode = 500;
				res.json({error : 'Server error'});
			}
			log.error('Internal error(%d): %s', res.statusCode, err.message);
		}
	});

});

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
app.listen(config.get('port'), function() {
	console.log('Express server listening port 1337');
});