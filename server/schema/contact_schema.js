'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
}

var contactSchema = new Schema({
	name: {
		type: String,
		required: true,
		trim: true,
		minlength: 1,
		maxlength: 16
	},
	email: {
		type: String,
		trim: true,
		lowercase: true,
		required: 'Email address is required',
		validate: {
			validator: validateEmail,
			message: 'This isn\'t the correct format'
		}
	},
	message: {
		type: String,
		trim: true,
		minlength: 1,
		maxlength: 500
	}
});

let Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;