'use strict'

const passport = require('passport');

module.exports = function(app, db){
	app.route('/register')
	   .post((req, res, next) => {
		   var security_qestions = [
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
		   });
	   }, 
	   passport.authenticate('local', { failureRedirect: '/' }),
	     (req, res, next) => {
			 res.redirect('profile');
		 });
	
	app.route('/')
	   .get((req, res) => {
		   res.render(process.cwd() + '/views/index.pug');
	   });
	
    app.route('/login')
      .post(passport.authenticate('local', { failureRedirect: '/' }), (req,res) => {
        res.redirect('/profile');
      });  
	
	app.route('/logout')
	   .get((req, res) => {
		   req.logout();
		   res.redirect('/');
	   });
	   
    app.route('/profile')
	   .get(ensureAuthenticated, (req, res) => {
		   res.render(process.cwd() + '/views/profile.pug', {username: req.user.username});
	   });
	
	function ensureAuthenticated(req, res, next){
		if(req.isAuthenticated()){
			return next();
		}
		res.redirect('/');
	};
}