const mongoose=require('mongoose');
const time=require("../middlewares/epochTime")

const libSchema=new mongoose.Schema({
    
    libName:{
        type:String,
    },
    location:{
        type:String
    },
    OpeningTime:{
        type: String
    }
    ,
    CloseTime: {
        type:String
    },
    createdAt:{
        type:Number,
        default:time.epochtime()  
    },
    updatedAt:{
        type:Number
    }
});

const libModel=mongoose.model('Library',libSchema);

module.exports=libModel;