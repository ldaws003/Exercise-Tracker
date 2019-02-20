'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const saltRounds = 12;

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
		unique: true
	},
	password: {
		type: String,
		required: true
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
		validate: [questionValidator, '{PATH} does not equal the length of 2 or questions are the same']
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
	}]
});

userSchema.pre('save', function(next){
	var user = this;
	//maybe include different way of 
	if(user.security_questions.length < 2 && user.security_questions[0].question == user.security_questions[1].question){
		var err = new Error('')
	}
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