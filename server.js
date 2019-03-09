'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;
const mongo = require('mongodb').MongoClient;
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const io = require('socket.io');
const passportio = require('passport.socketio');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const sessionStore = new session.MemoryStore();
const app = express();
const http = require('http').Server(app);
const router = require('./routes/router.js');
const User = require('./schema/user_schema');
const user_authentication = require('./auth/user_authentication.js');
const base_routes = require('./routes/base_routes.js');
const getExercise = require('./api/get_exercise_data.js');
const deleteUser = require('./api/delete_user.js');

require('dotenv').config();

app.set('view engine', 'pug');
app.use('/public', express.static(process.cwd() + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var mongOptions = {
	reconnectTries: 7,
	reconnectInterval: 1500,
	useNewUrlParser: true
};

mongoose.connect(process.env.DB, mongOptions);

app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: true,
	saveUninitialized: false,
	store: new MongoStore({
		url: process.env.DB
	})
}));


app.use(passport.initialize());
app.use(passport.session());

app.use(helmet({
	frameguard: { action: 'deny' },
	hidePoweredBy: { setTo: 'PHP 4.2.0'}
}));


app.use('/', router);

mongo.connect(process.env.DB, { useNewUrlParser: true }, (err, db) => {
	if(err) console.log(err);
	
	user_authentication(app, db);
	base_routes(app, db);
	getExercise(app);
	deleteUser(app);
	
	
	app.use((req, res, next) => {
		res.status(404).type('text').send('Not Found');
	});
	
	app.listen(process.env.PORT || 3000, () => {
		console.log("Listening on port " + process.env.PORT);
	});
});
