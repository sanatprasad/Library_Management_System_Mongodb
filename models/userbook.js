const mongoose=require('mongoose');
const time=require("../middlewares/epochTime");
const userbookSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
    },
    bookId:{
        type:mongoose.Schema.Types.ObjectId,
    },
    issueDate:{
        type:Number
    },
    submitDate:{
        type:Number,
        default:time.submitDateepoch()
    },
    createdAt:{
        type:Number,
        default:time.epochtime()  
    },
    updatedAt:{
        type:Number
    }
});

const userBookModel=mongoose.model('userBook',userbookSchema);

module.exports=userBookModel;