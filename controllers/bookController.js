const { reset } = require('nodemon');
const bookModel = require('../models/book');
const authbookModel=require('../models/authorBook')

const getallbooks = async (req, res) => {
    try {
        const books = await bookModel.find({});
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getbyid = async (req, res) => {
    try {
        const id = req.params.id;
        const book = await bookModel.findOne({ _id: id });
        res.json(book);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const createbook = async (req, res) => {
    const { bookName, isAvailable, libID,authId } = req.body;



    if (!bookName || !isAvailable || !libID || !authId) {
        return res.status(400).json({ message: 'Book Name, Avaibility info and libID is required.' });
    }

    const newBook = new bookModel(
        {
            bookName: bookName,
            isAvailable: isAvailable,
            libID: libID,
        }
    );
    await newBook.save();
    
    const newbookauthobj=new authbookModel(
        {
            bookId:newBook._id,
            authId:authId
        }
    )
    await newbookauthobj.save();
    return res.status(201).json({ message: 'Created Successfully', success: true });


}

const updatebook = async (req, res) => {
    try {
        const id = req.params._id;
        const book = await bookModel.findById(id);
        if (book) {
            if (!req.body.bookName && !req.body.isAvailable) {
                res.send("Please enter any field to update");
            }
            else{
                book.bookName = req.body.bookName;
                book.isAvailable = req.body.isAvailable;
                res.send({ status: 'updated' }).status(200);
            }
        }  
        else {
            res.send("Book doesnt exist").status(403);
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const deletebookbyid = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await userModel.findOneAndDelete({ _id: id });
    
        if (result === null) {
          res.status(404).send('Document not found');
        } 
        else {
          res.status(200).json(result).send({ status: 'deleted' });
        }
      }
      catch (error) {
        console.error('Error occurred:', error);
        res.status(500).send('Internal Server Error');
      }
}

module.exports={getallbooks,getbyid,createbook,updatebook,deletebookbyid};