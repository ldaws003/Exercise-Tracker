'use strict'

const passport = require('passport');
const User = require('../schema/user_schema.js');
const DataDisplay = require('../api/exercise_data_processor.js');
const ObjectID = require('mongodb').ObjectID;
const moment = require('moment');

const dataDisplay = new DataDisplay();

module.exports = function(app){
	app.route('/register')
	   .get((req,res,next) => {
		   res.sendFile(process.cwd() + '/views/sign_up.html')
	   })
	   .post((req, res, next) => {
		   
		   if(req.body.password !== req.body.verify_password){
				res.status(400).send('The passwords must be the same.');
			}
		   
		   var security_questions = [
		   {
			   question: req.body.security_question1,
			   answer: req.body.security_answer1
		   },
		   {
			   question: req.body.security_question2,
			   answer: req.body.security_answer2
		   }];
		   var userData = {
			   username: req.body.username,
			   password: req.body.password,
			   security_questions: security_questions,
			   exercise_data: []
		   };
		   
		   var newUser = User(userData);
		   newUser.save((err) => {
			   if(err) console.log(err);
			   next();
		   });
	   },
	   passport.authenticate('local', { failureRedirect: '/' }),
	     (req, res, next) => {
			 res.redirect('/welcome');
		 });
		 
	app.route('/welcome')
		.get((req, res) => {
			res.sendFile(process.cwd() + '/views/welcome.html');
		})
	
	app.route('/')
	   .get((req, res) => {
		   
		   //check if the user is signed in
		   if(req.user){
			   var user = {
				   username: req.username
			   };
			   res.render(process.cwd() + '/views/index.pug', {user: user})
		   } else {
			   res.render(process.cwd() + '/views/index.pug');
		   }		   
	   });
	
    app.route('/login')
	  .get((req,res) => {
		  res.sendFile(process.cwd() + '/views/login.html');
	  })
      .post(passport.authenticate('local', { failureRedirect: '/' }), (req,res) => {
        res.redirect('/profile');
      });  
	
	app.route('/logout')
	   .get((req, res) => {
		   req.logout();
		   res.redirect('/');
	   });
	   
	app.route('/about')
	   .get((req, res) => {
		   
		   if(req.user){
			   res.render(process.cwd() + '/views/about.pug', {user: true})
		   } else {
			   res.render(process.cwd() + '/views/about.pug');
		   }
	   });
	   
	app.route('/contact')
	   .get((req, res) => {
		   if(req.user){
			   res.render(process.cwd() + '/views/contact.pug', {user: true});
		   } else {
			   res.render(process.cwd() + '/views/contact.pug');			   
		   }		   
	   });
	   
    app.route('/profile')
	   .get(ensureAuthenticated, (req, res) => {
		   
		   User.findById(new ObjectID(req.user._id), (err, user) => {
				if(err) throw err;

				if(user.exercise_data.length != 0){
					var chartData = {
						aerobic: dataDisplay.makeChart(user, 'aerobic')/*,
						strength: dataDisplay.makeChart(user, 'strength'),
						flexibility: dataDisplay.makeChart(user, 'flexibility'),
						balance: dataDisplay.makeChart(user, 'balance')*/	
					};					
				}
		
				
				
				var max = dataDisplay.maxPages(user, 10);
				
				user.exercise_data = dataDisplay.shown(user, 1, 10);
				
				res.render(process.cwd() + '/views/profile.pug', {
					user: true,
					username: req.user.username,
					exercise_data: user.exercise_data,
					chartData: !!chartData,
					max: max
				});
		   }
	   )});
	
	function ensureAuthenticated(req, res, next){

		if(req.isAuthenticated()){
			return next();
		}
		res.redirect('/');
	};
};