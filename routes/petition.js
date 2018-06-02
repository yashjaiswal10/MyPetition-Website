
var express=require("express");
var Router = require("router");
var router=express.Router();
var petition=require("../models/petition");
var relation=require("../models/relation");
var User=require("../models/user");
var nodemailer=require("nodemailer");


var passport=require("passport");
var LocalStrategy=require("passport-local");

var bodyParser=require("body-parser");


//middleware


function isLoggedIn(req,res,next){
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}


router.get("/petitions",function (req,res) {

    petition.find({},function (err,allpetitions){
        if(err) {
            console.log("hi");

        }
        else {
            relation.find({}, function (err, allrelation) {

                    res.render("petitions.ejs", {petition: allpetitions, relation: allrelation});
                }
            )

        }});

});



router.post("/petitions",function (req,res) {
    // console.log(req.User+"ff");
    var title = req.body.title;
    var image = req.body.image;
    var desc = req.body.description;
    var author={
        id:req.user._id,
        username:req.user.username
    };
    var sub=req.body.sub;
    var newpetition = {title: title, image: image, description: desc,author:author,sub:sub};

    petition.create(newpetition, function (err, newly) {
        if (err) {
            console.log(err);
        }
        else {
            var maillist  = [];
            var users = [];
            User.find({},function (err,all){
                // console.log(all.email+"ccccccxxx");
                for (var i=0; i<all.length; i++)
                {
                    maillist[i]=all[i].email;
                    // users[i] = all[i].Name;
                }



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
                    from:'mypetitionorg@gmail.com',
                    to:maillist,
                    subject:'Mypetition',
                    text:'A New Petition '+title+ ' has been created by '+author.username+'.Do visit it.'

                };
                transporter.sendMail(HelperOptions,function(err,info) {
                    if(err) {
                        console.log(err);
                    } else {
                        console.log("message sent") ;
                    }

                    console.log(info);
                });

                console.log(newly);
            res.redirect("/petitions");
        })}
    });
});

router.get("/new",isLoggedIn,function (req,res) {
    res.render("new.ejs");

});


router.get("/:id",isLoggedIn,function (req,res) {
    // console.log(req.params.id+"fsjuh");
    petition.findById(req.params.id,function (err,petition) {

        if(err)
            console.log(".");
        else {

            relation.find({petid:req.params.id},function (err,rel) {
                if(err)
                {
                    console.log(err);
                }

                res.render("show.ejs", {petition:petition,rel:rel,User:req.user.username})

            });
            // relation.findById(req.params.id1,function (err,rel) {



            // })
        }
    });
            // res.render("show.ejs");
});

//
//
router.post("/petition/:id/sign",function (req,res) {

    petition.findById(req.params.id,function(err,petition) {
        if (err) {
            console.log(err);
            res.redirect("/petition");
        }
        else {
            console.log(req.params.id);

            var f=0;

            var username = req.body.username;
            var petid = req.params.id;

            var rel = {username: username, petid:petid};
            var maillist  = [];
            var users = [];
            User.find({},function (err,all){

                for (var i=0; i<all.length; i++)
                {
                    maillist[i]=all[i].email;
                    // users[i] = all[i].Name;
                }



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
                from:'mypetitionorg@gmail.com',
                to:maillist,
                subject:'Mypetition',
                text:' Petition named '+petition.title+' has been signed by '+ username+'.Visit the website to see increase in signatures'

            };
            transporter.sendMail(HelperOptions,function(err,info) {
                if(err) {
                    console.log(err);
                } else {
                    console.log("message sent") ;
                }

                console.log(info);
            });



                    relation.create(rel, function (err, newly) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            console.log(newly+"noerrr");
                            res.redirect("/" + req.params.id);
                        }
                    });


                    console.log("happy");
                })}            });


    // res.redirect("/petitions/"+req.params.id);
});




module.exports=router;