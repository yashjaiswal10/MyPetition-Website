var express=require("express");
var app=express();
var bodyParser=require("body-parser");
var relation=require("./models/relation");

var indexRoutes=require("./routes/index");
var petitionRoutes=require("./routes/petition");
var passport=require("passport");
var LocalStrategy=require("passport-local");
var User=require("./models/user");
var petition=require("./models/petition");



var mongoose=require("mongoose");
mongoose.connect('mongodb://yash:12345@ds247439.mlab.com:47439/petitions');

// mongoose.connect('mongodb://localhost/petition');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("design"));
// app.use(express.static("views"));


var currentUser;

app.use(require("express-session")({
    secret:"nice",
    resave:false,
    saveUninitialized:false

}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req,res,next) {
    res.locals.currentUser=req.user;
    next();
});



//routes
app.use(indexRoutes);
app.use(petitionRoutes);







app.listen(process.env.PORT||2000 ,function () {


    console.log("server started");
});