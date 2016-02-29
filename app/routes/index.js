'use strict';

var path = process.cwd();
var PollHandler = require(path + '/app/controllers/pollHandler.server.js');
module.exports = function(app, passport) {

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()&&req.user) {
		console.log(req.user);
		return next();
	} else {
		res.redirect('/login');
	}
}

var pollHandler = new PollHandler();
	
app.route('/')
	.get(isLoggedIn, function(req, res) {
		res.sendFile(path+ '/public/index.html');
	})
	.post(pollHandler.addPoll);
app.route('/poll/*')
	.get(pollHandler.getPoll)
	.post(pollHandler.addVote);

app.route('/polls/admin')
	.get(isLoggedIn, pollHandler.getAdmin);	

app.route('/login')
	.get(function(req, res) {
		res.sendFile(path+'/public/login.html')
	})
	.post(passport.authenticate('local', { 	successRedirect: '/',
                                   		failureRedirect: '/login',
                                   		failureFlash: true 
						})
	);
app.route('/login/create')
	.post(pollHandler.addUser, function(req, res, next) {
		passport.authenticate('local', function(err, user, info) {

			req.login(user, function(err) {
				if (err) { return next(err); }
				res.json(200);
			});
		})(req, res, next);
	});
app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');	
});
};
