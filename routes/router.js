'use strict'

const mongodbo = require('mongodb');
const mongoose = require('mongoose');
const User = require('../schema/user_schema.js');
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const DataDisplay = require('../api/exercise_data_processor.js');

/*app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));*/
const connection = process.env.DB;

var dataDisplay = new DataDisplay();

router.post('/', function(req,res,next){
	
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
			
			var security_questions = [
				{question: req.body.security_question1, answer: req.body.security_answer1},
				{question: req.body.security_question2, answer: req.body.security_answer2}
			];
			
			var userData = {
				username: req.body.username,
				password: req.body.password,
				security_questions: security_questions
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