var mongoose=require("mongoose");

var relationSchema=new mongoose.Schema({
         petid:String,
        username: String,
        // flag:String,

    }

);

module.exports=mongoose.model("relation",relationSchema);