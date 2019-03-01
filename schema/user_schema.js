'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const Sanitizer = require('../api/sanitizer.js');
const Checker = require('../api/checker.js');
const saltRounds = 12;

var sanitizer = Sanitizer();
var checker = Checker();


function questionValidator(val){
	if(val.length === 2){
		return val[0].question !== val[1].question; 
	}
	return false;
}

userSchema = new Schema({
	username: {
		type: String,
		required: true,
		trim: true,
		unique: true,
		validate: checker.isUsernameOk
	},
	password: {
		type: String,
		required: true,
		validate: checker.isPasswordOk
	},
	security_questions: {
		type: [{
			question: {
				type: String,
				required: true
			},
			answer: {
				type: String,
				required: true,
				trim: true
			}
		}],
		validate: checker.isSecurityQuestionsOk
	},
	exercise_data: [{
		description: {
			type: String,
			required: true
		},
		date: {
			type: Date,
			required: true
		},
		duration: {
			type: Number,
			required: true
		}
		validate: checker.isEntryOk
	}]
});

userSchema.pre('save', function(next){
	var user = this;
	
	sanitzer.sanitizeUsername(user);
	sanitizer.sanitizePassword(user);
	sanitizer.sanitizeEntry(user);
	
	bcrypt.hash(user.password, saltRounds, function(err, hash){
		if(err){
			return next(err);
		}
		
		user.password = hash;
		next();
	})
});

userSchema.statics.authenticate = function(username, password, callback){
	User.findOne({username:username ,password: password})
	    .exec(function(err,user){
			if(err){
				return callback(err);
			} else if(!user){
				var err = new Error('User not found.');
				err.status = 401;
				return callback(err);
			}
			bcrypt.compare(password, user.password, function(err, result){
				if(result === true){
					return callback(null,user);
				} else {
					return callback();
				}
			});
		});
}

let User = mongoose.model('User', userSchema);

module.exports = User;