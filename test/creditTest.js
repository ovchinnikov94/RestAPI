var creditModel = require('../libs/mongo').CreditModel;
var config = require('../libs/config');
var http = require('http');
var assert = require('assert');
var server = require('../server');
var async = require('async');

describe('Testing Credit Model', function(){

	before(function(){

	});

	after(function(){

	});

	it('Saving CreditModel', function(done){
		var data = {name : 'Test1', sum : 12000};
		var options = {
			hostname : '127.0.0.1',
			port : config.get('port').toString(),
			path : '/credit/',
			method : 'POST',
			headers : {
				'Content-Type': 'application/json',
				'Content-Length': Buffer.byteLength(JSON.stringify(data),'utf8')
			}
		};
		var req = http.request(options, function(res){
			var results = '';
			res.on('data', function(chunk){
				results = results + chunk;
			});
			res.on('end', function(){
				assert.equal(JSON.parse(results).status, "OK");
			});
			done();
		});
		req.on('error', function(e){
			assert(1, 'Error occured');
			done();
		});
		req.write(JSON.stringify(data));
		req.end();
	});

	it('Getting CreditModel', function(done){
		var curDate = new Date();
		var year  = curDate.getFullYear();
		var month = curDate.getMonth() + 1;
		var day = curDate.getDate();
		var options = {
			hostname : '127.0.0.1',
			port : config.get('port').toString(),
			path : '/credit/' + year.toString() + '/' + month.toString() + '/' + day.toString(),
			method : 'GET',
			headers : {
			}
		};
		var req = http.request(options, function(res){
			var results = '';
			res.on('data', function(chunk) {results = results + chunk;});
			res.on('end', function(){
				var credits = JSON.parse(results);
				credits = credits.filter(function(x){ return x.name === 'Test1'});
				assert.notEqual(credits.length, 0);
				done();
			});
			res.on('error', function(e){
				assert('Error occured!');
				done();
			});
		});
		req.end();
	});

	it('Deleting CreditModel', function(done){
		done();
	});
});