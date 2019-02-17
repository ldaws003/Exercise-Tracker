'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const saltRounds = 12;

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
	security_questions: [{
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
	bcrypt.hash(user.password, saltRounds, function(err, hash){
		if(err){
			return next(err);
		}
		
		user.password = hash;
		next();
	})
});

let User = mongoose.model('User', userSchema);

module.exports = User;