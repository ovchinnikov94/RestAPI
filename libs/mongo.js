var mongoose = require('mongoose');
var log = require('./log')(module);
var config = require('./config');
var crypto = require('crypto');

mongoose.connect(config.get('mongoose:uri'));

var db = mongoose.connection;

db.on('error', function(err){
	log.error('Connection error:', err.message);
});

db.once('open', function callback(){
	log.info("Connected to DB!");
});

var Schema = mongoose.Schema;

//SCHEMAS
var Person = new Schema({
	name : {type: String, required : true},
	surname : {type: String, required : true},
	phone : {type : String}
});

var Debit = new Schema({
	name : {type : String, required : true},
	sum : {type : String, required : true},
	date :{type : Date, default : Date.now}
});

var Credit = new Schema({
	name : {type : String, required : true},
	sum : {type : Number, required : true},
	date : {type : Date, default: Date.now}
});



//VALIDATING
Person.path('phone').validate(function(v){
	return v.length > 5 && v.length < 20;
});

Debit.path('sum').validate(function (v) {
	return v > 0.0 && v < 10000000.0;
});

Credit.path('sum').validate(function(v){
	return v > 0.0 && v < 10000000.0;
});

//EXPORT
var PersonModel = mongoose.model('Person', Person);
var DebitModel = mongoose.model('Debit', Debit);
var CreditModel = mongoose.model('Credit', Credit);

module.exports.PersonModel = PersonModel;
module.exports.DebitModel = DebitModel;
module.exports.CreditModel = CreditModel;

