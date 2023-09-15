const mongoose=require('mongoose');
const time=require("../middlewares/epochTime")
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Name is required']
    },
    email:{
        type:String,
        required:[true,'Email is required']
    },
    password:{
        type:String,
        required:[true,'Password is required']
    },
    AccountType:{
        type:Number,
    },
    profile:{
        type:String,
        required:[false]
    },
    token:{
        type:String,
        required:[false]
    },
    DateCreated:{
        type:Number,
        default: time.epochtime()   
    }
});

const userModel=mongoose.model('users',userSchema);

module.exports=userModel;