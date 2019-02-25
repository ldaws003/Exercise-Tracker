'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;
const mongo = require('mongodb').MongoClient;
const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const io = require('socket.io');
const passport = require('passport.socketio');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const session = require('express-session');
const sessionStore = new session.MemoryStore();
const app = express();
const http = require('http').Server(app);
const router = require('./routes');
const User = require('./schema/user_schema');

require('dotenv').config();

app.set('view engine', 'pug');
app.use('/public', express.static(process.cwd() + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use(helmet({
	frameguard: { action: 'deny' },
	hidePoweredBy: { setTo: 'PHP 4.2.0'}
}));

app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: true,
	saveUninitialized: false,
	store: new MongoStore({
		url: process.env.DB
	})
}));

app.use('/', router);

mongo.connect(process.env.DB, (err, db) => {
	if(err) console.log(err);
	
    passport.serializeUser((user, done) => {
		done(null, user._id);		
	});

    passport.deserializeUser((id, done) => {
		db.collections('users').findOne(
		{_id: new ObjectID(id)},
		(err, doc) => {
			done(null, doc);
		}
	  );		
	});
	
	passport.use(new LocalStrategy(
		function(username, password, done){
			//maybe collections
			db.collection('users').findOne({username: username}, function(err, user){
				if(err){return done(err);}
				if(!user){return done(null, false)};
				if(password !== user.password){return done(null, false);}
				return done(null, user);
			});
		}
	));
	
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
		   })
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
	
	app.use((req, res, next) => {
		res.status(404).type('text').send('Not Found');
	});
	
	app.listen(process.env.PORT || 3000, () => {
		console.log("Listening on port " + process.env.PORT);
	});
});
