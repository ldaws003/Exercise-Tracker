const passport = require('passport');

module.exports = function(app, db){
	app.route('/register')
	   .post((req, res, next) => {
		   var userData = {
			   username: req.body.username,
			   password: req.body.password
			   security_questions: req.body.security_questions,
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