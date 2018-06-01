var express=require("express");
var Router = require("router");
var router=express.Router();
var passport=require("passport");
var User=require("../models/user");
var petition=require("../models/petition");
var fs=require("fs");
var path=require("path");

var config=JSON.parse(fs.readFileSync("package.json"));
var nodemailer=require("nodemailer");
var emailCheck = require('email-check');


//middleware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "please login first!");
    res.redirect("/login");
}

router.get("/",function (req,res) {
    petition.find({},function (err,all){
        if(err) {
            console.log("hi");

        }
        else {
            res.render("front.ejs",{petition:all,currentUser:req.user});
        }

    });
});

router.get("/contact",function (req,res) {
    res.render("contact.ejs");
});

router.get("/homepage",function (req,res) {

    petition.find({},function (err,all){
        if(err) {
            console.log("hi");

        }
        else {
            res.render("front.ejs",{petition:all,currentUser:req.user});
        }

    });
});


router.post("/contact/message",function (req,res) {


        var name=req.body.Name;
        var email=req.body.Email;
        console.log(email);
        var message=req.body.Message;

        let transporter=nodemailer.createTransport({
            host:'smtp.gmail.com',
            // service:'gmail',
            secure:true,
            port:465,
            auth:{
                user:'mypetitionorg@gmail.com',
                pass:'aryan&yash'
            }
            //,
            // tls:{
            //     rejectUnauthorized:false
            // }


        });

        // console.log("fyjfgyug");
        let HelperOptions={
            from:email,
            to:'geniousyashjaiswal@gmail.com',
            subject:'Mypetition',
            text:message

        };
        transporter.sendMail(HelperOptions,function(err,info) {
            if(err) {
                console.log(err);
            } else {
                console.log("message sent") ;
            }

            console.log(info);
        });

        console.log("Your message has been received by us");
        res.redirect("/contact");



});









router.get("/login",function (req,res) {
    res.render("login.ejs");
});
router.get("/signup",function (req,res) {
    res.render("signup.ejs");

});


//sign up logic
router.post("/signup",function (req,res) {
    var newUser=new User({username:req.body.username,email:req.body.email});
    User.register(newUser,req.body.password,function (err,user) {
        if(err)
        {
            console.log(err);
            return res.render("login.ejs");
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/homepage");
        });
    });
});
    //login logic
    router.post("/login", passport.authenticate("local",
        {
            successRedirect:"/homepage",
            failureRedirect:"/signup"
        }),function(req,res){

    });






//logout
router.get("/logout",function (req,res) {
    req.logout();
    res.redirect("/homepage");
});







module.exports=router;