'use strict'

var models = require('../models/polls');
var LocalStrategy = require('passport-local').Strategy;
module.exports = function(passport) {
	passport.serializeUser(function (user, done) {
        	done(null, user);
    	});

	passport.deserializeUser(function (user, done) {
            		done(null, user);
        });

	passport.use(new LocalStrategy(
  		function(username, password, done) {
    			models.User.findOne({ "local.username": username }, function(err, user) {
      				if (err) { return done(err); }
      				if (!user) {
					console.log('not a valid username');
        				return done(null, false, { message: 'Incorrect username.' });
     			 	}
      				if (!user.local.validPassword(password)) {
					console.log('Not a valid password')
        				return done(null, false, { message: 'Incorrect password.' });
      				}
				console.log('Authenticated succesfully');
      				return done(null, user.local);
    			});
  		}
	));
};
