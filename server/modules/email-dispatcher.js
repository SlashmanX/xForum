
var ES = require('./email-settings');
var UEV = require('../models/UserEmailVerification.js');
var	mongoose	=	require('mongoose');
var	moment		=	require('moment');
var	ObjectId	=	mongoose.Types.ObjectId;
var EM = {};
module.exports = EM;

EM.server = require("emailjs/email").server.connect({

   	host 	    : ES.host,
   	user 	    : ES.user,
   	password    : ES.password,
    ssl		    : true

});

EM.send = function(credentials, callback)
{
    EM.drawVerificationEmail(credentials, function(att){
        EM.server.send({
            from         : ES.sender,
            to           : credentials.email,
            subject      : '[xForum] Verify your email',
            text         : 'something went wrong... :(',
            attachment   : att
        }, callback );
    })

}

EM.drawVerificationEmail = function(o, callback)
{
    e = new UEV({user: o._id, dateSent: moment().format()});
    e.save(function(err, v){
        var link = 'http://xforum.slashmanx.com/profile/verify/?token='+v._id;
        var html = "<html><body>";
        html += "Hi "+o.username+",<br><br>";
        html += "<a href='"+link+"'>Please click here to verify your email</a><br><br>";
        html += "Cheers,<br>";
        html += "<a href='http://twitter.com/SlashmanX'>Slashman X</a><br><br>";
        html += "</body></html>";
        callback([{data:html, alternative:true}]);
    })

}

EM.verifyEmail = function(data, callback)
{
    UEV.findOneAndRemove({_id: data.token, user: data.user_id}, function(err, o){
        callback(err, o);
    });
}