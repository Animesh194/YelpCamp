const express = require("express"),
	  Campground = require("../models/campground"),
	  Comment = require("../models/comment"),
	  middleware = require("../middleware");
const router = express.Router();

//=================================================================
//COMMENTS ROUTE
//=================================================================
//create route
router.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, ground){
		if(err){
			console.log(err);
			return res.render("campgrounds/index");
		}
		var comment = {text: req.body.comment_text, author: {id: req.user._id, username: req.user.username}};
		Comment.create(comment, function(err, commentFound){
			if(err){
				console.log(err);
			}else{
				ground.comments.push(commentFound);
				ground.save();
				res.redirect("/campgrounds/"+ground._id);
			}
		});
	});
});

//edit route
router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.commentAuthorised, function(req, res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			res.redirect("back");
		}else{
			Campground.findById(req.params.id).populate("comments").exec(function(err, ground){
				if(err){
					res.redirect("back");
				}
			});	
		}
	});
});

//update route
router.put("/campgrounds/:id/comments/:comment_id", middleware.commentAuthorised, function(req, res){
	var text = req.body.comment_text;
	var comment = {text: text};
	Comment.findByIdAndUpdate(req.params.comment_id, comment, function(err, foundComment){
		if(err){
			res.redirect("back");
		}else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
});

//delete route
router.delete("/campgrounds/:id/comments/:comment_id", middleware.commentAuthorised, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("back");
		}else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//=================================================================
//MIDDLEWARE TO CHECK IF LOGGED IN 
//=================================================================
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.session.returnTo = req.headers.referer; //"/campgrounds/"+req.params.id...both are same;
	req.flash("error", "You must be logged in")
	res.redirect("/login");
}

module.exports = router;