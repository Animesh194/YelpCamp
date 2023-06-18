const express = require("express"),
	  Campground = require("../models/campground"),
	  Comment = require("../models/comment");

//=================================================================
//MIDDLEWARE OBJECT TO STORE ALL MIDDLEWARES USED EXCEPT LOGGED IN 
//=================================================================

var Middleware = {};

Middleware.campAuthorised = function(req, res, next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, ground){
			if(err){
				req.flash("error", "No such campground exists");
				res.redirect("back");
			}else{
				if(ground.author.id.equals(req.user.id)){
					next();
				}else{
					req.flash("error", "You don't have permission to do that");
					res.redirect("back");
				}
			}
		});
	}else{
		req.flash("error", "You must be logged in");
		res.redirect("back");  
	}
}

Middleware.commentAuthorised = function(req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, comment){
			if(err){
				req.flash("error", "No such comment exists");
				res.redirect("back");
			}else{
				if(comment.author.id.equals(req.user.id)){
					next();
				}else{
					req.flash("error", "You don't have permission to do that");
					res.redirect("back");
				}
			}
		});
	}else{
		req.flash("error", "You must be logged in");
		res.redirect("back");  
	}
}

module.exports = Middleware;