'use strict'

const mongodbo = require('mongodb');
const mongoose = require('mongoose');
const User = require('../schema/user_schema.js');
const express = require('exrpess');
const router = express.Router();
const bodyParser = require('body-parser');
const DataDisplay = require('../api/exercise_data_processor.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const connection = process.env.DB;

var dataDisplay = DataDisplay();

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

router.get('/:profile/journal', function(req, res, next){
	
	User.findById(new ObjectID(req.user._id), (err, user) => {
		if(err) throw err;
		
		var chartData = {
			aerobic: dataDisplay.makeChart(user, 'aerobic'),
			strength: dataDisplay.makeChart(user, 'strength'),
			flexibility: dataDisplay.makeChart(user, 'flexibility'),
			balance: dataDisplay.makeChart(user, 'balance')			
		};
		
		user.exercise_data = dataDisplay.shown(user, 1, 20);
		
		res.render(process.cwd() + '/views/journal.pug', {
			username: user.username,
			exercise_data: user.exercise_data,
			chartData: chartData
		});
	})
	
});

router.get('/:profile/:pg', function(req, res, next){
	
	if(!(req.params.pg >= 1)){
		res.status(404).type('text').send('Invalid page number');
		return;
	}
	
	User.findById(new ObjectID(req.user._id), (err, user) => {
		if(err) throw err;
		
		user.exercise_data = dataDisplay(user, req.params.pg, 20);
		res.json({exercise_data: user.exercise_data});
	});
});

module.exports = router;