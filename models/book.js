const mongoose=require('mongoose');
const time=require("../middlewares/epochTime")
const bookSchema=new mongoose.Schema({
    
    bookName:{
        type:String,
    },
    isAvailable:{
        type:Boolean
    },
    libID:{
        type:mongoose.Schema.Types.ObjectId
    },
    createdAt:{
        type:Number,
        default:time.epochtime()   
    },
    updatedAt:{
        type:Number,
        default:time.epochtime()  
    }
});

const BookModel=mongoose.model('Book',bookSchema);

module.exports=BookModel;