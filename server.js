const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const passport = require('passport');
const passportLocal = require('passport-local');
const bcrypt = require('bcrypt');
const socketio = require('socket.io');
const passportio = require('passport.socketio');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const app = express();

app.set('view engine', 'pug');
app.use('/public', express.static(process.cwd() + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet({
	frameguard: { action: 'deny' },
	hidePoweredBy: { setTo: 'PHP 4.2.0'}
}));

app.route('/')
   .get(function(req, res){
	   res.render();	   
   });