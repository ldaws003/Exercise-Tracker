'use strict'

const bcrypt = require('bcrypt');
const ObjectID = require('mongodb').ObjectID;
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('../schema/user_schema');

module.exports = function(app){
	passport.serializeUser((user, done) => {

		done(null, user._id);
	});

    passport.deserializeUser((id, done) => {
		User.findOne(
		{_id: new ObjectID(id)},
		(err, doc) => {
			var passUser = {
					_id: doc._id,
					username: doc.username,
					password: doc.password
			};
			done(null, passUser);
		}
	  );		
	});
	
	passport.use(new LocalStrategy(
		function(username, password, done){

			User.findOne({username: username}, function(err, user){
				if(err){return done(err);}
				if(!user){return done(null, false);}
				if(!bcrypt.compareSync(password, user.password)){return done(null, false);}
				return done(null, user);
			});
		}
	));
	
};