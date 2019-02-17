const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;
const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const io = require('socket.io');
const passportio = require('passport.socketio');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const session = require('express-session');
const sessionStore = new session.MemoryStore();
const app = express();
const http = require('http').Server(app);

require('dotenv').config();

app.set('view engine', 'pug');
app.use('/public', express.static(process.cwd() + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet({
	frameguard: { action: 'deny' },
	hidePoweredBy: { setTo: 'PHP 4.2.0'}
}));


