const mongodbo = require('mongodb');
const mongoose = require('mongoose');
const User = require('../user_schema');
const express = require('exrpess');
const router = express.Router();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const connection = process.env.DB;

//this route signs up a userAgent

router.post('/', function(req,res,next)){
	
	//check if the password and confirmation password are the same
	if(req.body.password !== req.body.verify_password){
		var err = new Error('Passwords do not match.');
		err.status = 400;
		return next(err);
	}
	
	if (req.body.username &&
	    req.body.password &&
		req.body.security_questions &&
		req.body.verify_password){
			
			var userData = {
				username: req.body.username,
				password: req.body.password,
				security_questions: req.body.security_questions
			}
			
			User.create(userData, function(err, user){
				if(err){
					return next(err)
				} else {
					return res.redirect('/profile');
				}
			});
			
		} else {
			var err = new Error('All fields have to be filled out.');
			err.status = 400;
			return next(err);
		}
	
});

module.exports = router;