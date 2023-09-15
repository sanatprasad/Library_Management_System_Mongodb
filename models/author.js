const mongoose=require('mongoose');
const time=require("../middlewares/epochTime")
const authSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'name is required']
    },
    email:{
        type:String,
        required:[true,'Email is required']
    },
    createdAt:{
        type:Number,
        default:time.epochtime()   
    },
    updatedAt:{
        type:Number
    }
    
});

const authModel=mongoose.model('author',authSchema);

module.exports=authModel;