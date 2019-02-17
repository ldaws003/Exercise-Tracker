'use strict'

mongoose = require('mongoose');
mongodb = require('mongodb');

Schema = mongoose.Schema;

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

let User = mongoose.model('User', userSchema);

module.exports = User;