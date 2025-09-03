const mongoose=require('mongoose');
const passportLocalMongoose=require('passport-local-mongoose');
const Schema=mongoose.Schema;

const userSchema=new Schema({
    email:{
        type:String,
        required:true,
        unique:true,
    }
});
userSchema.plugin(passportLocalMongoose);   //adds to our schema the result of the passport thing

module.exports=mongoose.model('User',userSchema);