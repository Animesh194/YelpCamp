const express = require("express"),
	  Campground = require("../models/campground"),
	  Comment = require("../models/comment"),
	  middleware = require("../middleware");
const router = express.Router();

//=================================================================
//CAMPGROUNDS ROUTES
//=================================================================
//index route
router.get("/campgrounds",function(req,res){
	Campground.find({},function(err,campGrounds){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/index",{campGrounds: campGrounds});
		}
	});
});

//create route
router.post("/campgrounds", isLoggedIn, function(req, res){
	req.body.ground.author = {id: req.user._id, username: req.user.username};
	Campground.create(req.body.ground, function(err, foundground){
		if(err){
			console.log(err);
			return res.render("campgrounds/new");
		}
		res.redirect("/campgrounds");
	});
});

//new route
router.get("/campgrounds/new", isLoggedIn, function(req,res){
	res.render("campgrounds/new");
});

//show route
router.get("/campgrounds/:id",function(req,res){
	Campground.findById(req.params.id).populate("comments").exec(function(err,foundCamp){ //We need to populate to show the actual comments not the id
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.render("campgrounds/show",{campGround: foundCamp});
		}
	});
});

//edit route
router.get("/campgrounds/:id/edit", middleware.campAuthorised, function(req, res){
	Campground.findById(req.params.id, function(err, foundGround){
		res.render("campgrounds/edit", {campground: foundGround});
	});
});

//update route
router.put("/campgrounds/:id", middleware.campAuthorised, function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.ground, function(err, foundGround){
		if(err){
			res.redirect("/campgrounds");
		}else{
			req.flash("success", "Successfully updated!");
			res.redirect("/campgrounds/" + foundGround._id);
		}
	});
});

//delete route
router.delete("/campgrounds/:id", middleware.campAuthorised,  function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err, ground){
		if(err){
			res.redirect("/campgrounds");
		}else{
			Comment.deleteMany( {_id: {$in: ground.comments}}, function(err){//To delete comments associated with that ground,or we can use a pre hook;
				if(err){
					res.redirect("/campgrounds");
				}else{
					res.redirect("/campgrounds");
				}
			});
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
	req.session.returnTo = req.url; //for smart redirect..redirects to where i left...means to the url requested before redirecting to login page
	req.flash("error", "You must be logged in"); // here that is "campgrounds/new";
	res.redirect("/login");         
}

module.exports = router;