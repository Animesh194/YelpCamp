const express = require("express"),
	  bodyParser = require("body-parser"),
	  mongoose = require("mongoose"),
	  methodOverride = require("method-override"),
	  passport = require("passport"),
	  LocalStrategy = require("passport-local"),
	  flash = require("connect-flash"),
	  Campground = require("./models/campground"),   
	  Comment = require("./models/comment"),
	  User = require("./models/user");
const app = express(); 

//=================================================================
//REQUIRING ROUTES
//=================================================================
const campgroundRoutes = require("./routes/campgrounds"),
	  commentRoutes = require("./routes/comments"),
	  authRoutes = require("./routes/index");

//=================================================================
//APP CONFIGURATION
//=================================================================
mongoose.connect("mongodb://localhost:27017/yelpcamp", {useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extende: true}));
app.use("/public",express.static("public"));
app.set("view engine","ejs");
app.use(methodOverride("_method"));
app.use(flash());

//=================================================================
//PASSPORT CONFIGURATION
//=================================================================
app.use(require("express-session")({
	secret: "A secret key",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//=================================================================
//CREATING MIDDLEWARE TO PASS VARIABLE(here user) TO EVER ROUTES
//=================================================================
app.use(function(req, res, next){
	res.locals.currentUser = req.user;  
	res.locals.error = req.flash("error");   
	res.locals.success = req.flash("success"); 
	next();   
}); 

//=================================================================
//USE REEQUIRED ROUTES TO MAKE THE APP WORK PROPERLY
//=================================================================
app.use(campgroundRoutes);
app.use(commentRoutes);
app.use(authRoutes);

//=================================================================
//LISTENING TO PORT
//=================================================================
app.listen(process.env.PORT || 3000, process.env.IP,function(){
	console.log("The Yelp Camp Server Has Started");
})