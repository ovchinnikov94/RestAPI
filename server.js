
//NECESSARY VARIABLES 
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var methodOverride = require('method-override');
var log = require('./libs/log')(module);
var config = require('./libs/config');
var mongoose = require('mongoose');

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

//HANDLERS
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

app.get('/credit', function (req, res){
	return CreditModel.find(function(err, credits) {
		if (!err) {
			return res.json(credits);
		}
		else {
			res.statusCode = 500;
            log.error('Internal error (%d): %s', res.statusCode, err.message);
            res.json({error : 'Server error'});
		}
	});
});

app.get('/credit/:year', function(req, res){
	var start = new Date(req.params.year, 0, 1);
	var end = new Date(req.params.year, 11, 31);
	return CreditModel.find({"date" : {$gte : start, $lte : end}}, function(err, result){
		if (!err) {return res.json(result);}
		else {
			res.statusCode = 500;
			log.error('Internal error (%d) : %s', res.statusCode, err.message);
			res.json({error : 'Server error'});
		}
	});
});

app.get('/credit/:year/:month', function(req, res) {
	var start_time = new Date(req.params.year, req.params.month - 1, 1);
	var end_time = new Date(req.params.year, req.params.month - 1, 31);
	return CreditModel.find({"date" : {$gte : start_time, $lt : end_time}}, function(err, credits){
        if (!err) {
            return res.json(credits);
        }
        else {
            res.statusCode = 500;
            log.error('Internal error (%d): %s', res.statusCode, err.message);
            res.json({error : 'Server error'});
        }
    });
});

app.get('/credit/:year/:month/:day', function(req, res){
	var start = new Date(req.params.year, req.params.month - 1, req.params.day);
	var end = new Date(req.params.year, req.params.month - 1, req.params.day);
	start.setHours(0, 0, 0, 0);
	end.setHours(23, 59, 59, 999);
	return CreditModel.find({"date" : {$gte : start, $lte : end}}, function(err, result){
		if (!err) {return res.json(result);}
		else {
			res.statusCode = 500;
			log.error('Internal error %d : %s', res.statusCode, err.message);
			res.json({error : 'Server error'});
		}
	});
});

app.post('/credit', function (req, res) {
	var credit;
	if (req.body.date) {
		credit = new CreditModel({
        	name : req.body.name,
        	sum : req.body.sum,
        	date : req.body.date
    	});
	}
	else {
    	credit = new CreditModel({
        	name : req.body.name,
        	sum : req.body.sum
    	});
    }
    credit.save(function(err){
        if (!err) {
            log.info('Credit Created!');
            return res.json({status : 'OK'});
        }
        else {
            res.statusCode = 500;
            log.error('Internal error (%d): %s', res.statusCode, err.message);
            res.json({error : 'Server error!'});
        }
    });
});

app.delete('/credit/:name', function (req, res){
	if (req.params.name){
		CreditModel.find({"_id" : mongoose.Types.ObjectId(req.params.name)}).remove().exec(function(err){
			if (!err) {
				log.info('Deleted credit %s', req.params.name);
				return res.json({status : 'OK'});
			}
			else {
				res.statusCode = 500;
				log.error('Internal error %s', err.message);
				return res.json({error : 'Server error!'});
			}
		});
	}
});

app.get('/ErrorExample', function(req, res, next){
	next(new Error('Random error!'));
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



//START SERVER
app.listen(config.get('port'), function() {
	console.log('Express server listening port ' + config.get('port');
});