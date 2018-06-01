var mongoose=require("mongoose");

var petitionSchema=new mongoose.Schema({
    title:String,
    description:String,
    image:String,
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username:String
    },
    sub:String,


});

module.exports=mongoose.model("petition",petitionSchema);