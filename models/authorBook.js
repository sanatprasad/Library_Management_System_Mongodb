const mongoose = require('mongoose');
const Author = require('./author'); // Import the Author model
const Book = require('./book'); 
const time=require("../middlewares/epochTime")
const authbookSchema = new mongoose.Schema({
    authId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'author' 
    },
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'book' 
    },
    createdAt: {
        type: Number,
        default: time.epochtime()
    },
    updatedAt: {
        type: Number
    }
});

const authBookModel = mongoose.model('AuthorBook', authbookSchema);

module.exports = authBookModel;