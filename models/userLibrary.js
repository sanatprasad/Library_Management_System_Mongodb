const mongoose=require('mongoose');
const time=require("../middlewares/epochTime")
const userlibSchema=new mongoose.Schema({
    userId:{
        type:String,
    },
    libId:{
        type:String,
    },
    createdAt:{
        type:Number,
        default:time.epochtime() 
    },
    updatedAt:{
        type:Number
    }
});

const userlibModel=mongoose.model('userlibrary',userlibSchema);

module.exports=userlibModel;