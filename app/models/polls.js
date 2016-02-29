'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserSchema = new Schema({
	local: {
		username: String,
		password: String
		},
	polls: [{ type: Schema.Types.ObjectId, ref: 'Polls'}]
});
var PollSchema = new Schema({
	_creator: { type: String, ref: 'User'},
        title: String,
	url: String,
        choices: [{
                option: String,
                votes: Number
        }]  
});

UserSchema.methods.validPassword = function( pwd ) {
    return ( this.password === pwd );
};
var Poll =  mongoose.model('Poll', PollSchema);
var User = mongoose.model('User', UserSchema);

module.exports = {
	User: User,
	Poll: Poll
};
