'use strict'

const bcrypt = require('bcrypt');
const ObjectID = require('mongodb').ObjectID;
const passport = require('passport');
const LocalStrategy = require('passport-local');

module.exports = function(app, db){
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
				if(bcrypt.compareSync(password, user.password)){return done(null, false);}
				return done(null, user);
			});
		}
	));
	
	s
};