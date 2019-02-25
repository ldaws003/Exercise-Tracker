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

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/');
};

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
	
	app.post('/login', passport.authenticate('local', { failureRedirect: '/' }), function(req,res){
		res.redirect('/profile').get(function(req,res){
			res.render(process.cwd() + '/profile');
		});
	});
	
	app.route('/profile')
	   .get(ensureAuthenticated, (req, res) => {
		   res.render(process.cwd() + '/views/profile.pug');
	   });
	
	app.listen(process.env.PORT || 3000, () => {
		console.log("Listening on port " + process.env.PORT);
	});
});
