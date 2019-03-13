'use strict'

const passport = require('passport');
const User = require('../schema/user_schema.js');

module.exports = function(app, db){
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
		   res.render(process.cwd() + '/views/profile.pug', {user: true, username: req.user.username});
	   });
	   
	app.route('/profile/journal')
	    .get(ensureAuthenticated, (req, res) => {
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
			});
		});
	
	//this is questionable
	app.route('/profile/chart')
	   .get(ensureAuthenticated, (req, res) => {
		   
		   User.findById(new ObjectID(req.user._id), (err, user) => {
			   if(err) throw err;
			   
			   user.exercise_data = dataDisplay(user, req.params.pg, 20);
			   res.json({exercise_data: user.exercise_data});
		   });
	   });
	
	function ensureAuthenticated(req, res, next){

		if(req.isAuthenticated()){
			return next();
		}
		res.redirect('/');
	};
}