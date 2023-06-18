const express = require("express"),
	  passport = require("passport"),
	  User = require("../models/user");
const router = express.Router();

//=================================================================
//ROUTE SETTINGS
//=================================================================
router.get("/",function(req,res){
	res.render("campgrounds/home");
});

//=================================================================
//AUTH ROUTES
//=================================================================
router.get("/signup",function(req, res){
	res.render("users/signup");
});

router.post("/signup",function(req, res){
	var newUser = new User ({username: req.body.username, email: req.body.email});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log(err);
			req.flash("error", err.message);
			return res.render("users/signup");
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Successfully logged in");
			res.redirect("/campgrounds");
		});
	});
});

router.get("/login",function(req, res){
	if(!req.session.returnTo)  //******to make the other smart authentication from comments and campgrounds route work
	req.session.returnTo = req.headers.referer; //headers.referer...returns from where the login request is made..
	res.render("users/login");
});

router.post("/login",passport.authenticate("local",{
	successReturnToOrRedirect: ("/campgrounds"),
	failureRedirect: "/login"
}), function(req, res){
	// res.redirect(req.session.returnTo); //above one works just like this...if here used 307,req.session.returnTo then it sends post request 
});

router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Successfully logged out");
	res.redirect("/campgrounds");
});

module.exports = router;