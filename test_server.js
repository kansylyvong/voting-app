var path = __dirname + '/index.html';
var qs = require('querystring');
var express = require('express');
var app = express();
var routes = require('./app/routes/index.js');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
var User = require(__dirname+'/app/models/polls.js');
var session = require('express-session');
var cookieParser = require('cookie-parser');

require('./app/config/passport')(passport);
mongoose.connect('mongodb://localhost:27017/pollappjs');

app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({ extended: false }));
app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use('/common', express.static(process.cwd() + '/app/common'));
app.use('/public', express.static(process.cwd() + '/public'));

app.use(cookieParser('keyboard cat'));
//app.use(session({ cookie: { maxAge: 60000 }}));
app.use(session({ secret: 'keyboard cat'}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

routes(app, passport);
app.listen(process.env.PORT, process.env.IP, function() {
	console.log('server listening at port: ' + process.env.PORT);
});
