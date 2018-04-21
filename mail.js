// var fs=require("fs");
// var path=require("path");

// var config=JSON.parse(fs.readFileSync("package.json"));

var relation=require("./models/relation");
var petition=require("./models/petition");
var User=require("./models/user");

var nodemailer=require("nodemailer");

 let transporter=nodemailer.createTransport({
    host:'smtp.gmail.com',
     // service:'gmail',
    secure:true,
    port:465,
    auth:{
        user:'geniousyashjaiswal@gmail.com',
        pass:'xyz9621729272'
    }
    //,
    // tls:{
    //     rejectUnauthorized:false
    // }


});

 console.log(User.email);
let HelperOptions={
    from:'geniousyashjaiswa1@gmail.com',
    to:User.email,
    subject:'Hello world',
    text:'petitions'

};
 transporter.sendMail(HelperOptions,function(err,info) {
 if(err) {
     console.log(err);
 } else {
         console.log("message sent") ;
         }

console.log(info);
});