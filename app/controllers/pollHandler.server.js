'use strict';
var path = process.cwd();
var models = require(path+'/app/models/polls');
var page = path + '/public/pollpage.html';

function pollHandler () {

	this.addPoll = function(req, res) {
		var spaces = /\s/g;
		var special = /[^\w\s]/g; 
        	var poll = new models.Poll(); 
		var question= req.body.PollQuestion;
		question = question.replace(special, '');
        	poll.title = question; 
		question = question.replace(spaces, '%20');
		poll.url = 'https://mongoose-kevinvan1990.c9users.io/poll/' +req.user.username+'/'+ question;
		poll['_creator'] = req.user.username; 
        	delete req.body.PollQuestion;
        	var arr = []
        	for (var name in req.body) {
                	var temp = {};
                	temp.option = req.body[name];
                	temp.votes = 0;
                	arr.push(temp);
        	}
        	poll.choices = arr;
		poll.save(function(err, result) {
			if (err) throw err;
			res.send(poll.url);
		});
	},

	this.getPoll = function(req, res, next) {
		var arr = req.url.split('/');
		var param = arr.pop();
		var user = arr.pop();
		var match = /%20/g;
		console.log(req.body);
		param = param.replace(match, ' ');
		models.Poll
			.find({"_creator": user, "title": param})
			.exec(function(err, result) {
				if (err) throw err;
				if (result) {
					console.log(result);
					var title = result[0].title;
					var context = {question: title, options: result[0].choices };
					console.log(result[0].choices);
					res.render('pollpage',  context); 
				}
			});
	},
	//adds a vote for an option
	this.addVote = function(req, res, next) {
		var arr = req.url.split('/');
		arr.pop();
		var user = arr.pop();
		models.Poll
			.update(
				{"_creator": user, "title": req.body.title, "choices.option": req.body.option},
				{ $inc : {"choices.$.votes": 1}})
			.exec(function(err, result) {
				if (err) throw err;
				if (result) {
					res.send("Success");
				}
			});
	},
	//returns all polls for the admin page	
	this.getAdmin = function(req, res, next) {
		models.Poll
			.find({"_creator":req.user.username})
			.exec(function(err, result) {
				res.json(result);
			});
	},

	this.addUser = function(req, res, next) {
		models.User
			.findOne({"local.username": req.body.username}, function(err, user) {
				if (err) throw err;
				if (user) {
					console.log(user);
					res.send('username already exists');
				}
				if (!user) {
					var newUser = new models.User();
					newUser.local.username = req.body.username;
					newUser.local.password = req.body.password;
					newUser.save(function(err, result) {
						if (err) throw err;
						else return next(); 
					});
				}
			});
	}
};    
module.exports = pollHandler;
