const userModel = require('../models/user');
const userBookModel = require("../models/userbook");
const bookModel = require("../models/book")
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const secretkey = "secretkey";
const transporter = require('../config/emailconfig');
const mail = require("../middlewares/emailsender");
const time = require("../middlewares/epochTime")
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const BookModel = require('../models/book');

dotenv.config();

function convertDateToTimestamp(dateString) {
  const parts = dateString.split('/');
  const day = parseInt(parts[0]);
  const month = parseInt(parts[1]) - 1; // Months in JavaScript are 0-indexed
  const year = parseInt(parts[2]);

  const utcTimestamp = Date.UTC(year, month, day);
  return utcTimestamp;
}

const issueBook = async (req, res) => {
  const bookId = req.body.bookId;
  const userId = req.body.userId;

  try {
    const user = await userModel.findById(userId);
    const book = await bookModel.findById(bookId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const Avaibility = book.isAvailable;

    if (Avaibility) {
      const newbookIssue = new userBookModel(
        {
          userId: userId,
          bookId: bookId,
        }
      );
      await newbookIssue.save();

      const obj = {};
      obj.user = user.name;
      obj.bookname = book.bookName;
      obj.submit = time.submitDateepoch();

      mail.sendbookdetails(user.email, obj);

    }
    if (!Avaibility) {
      return res.status(200).json({ message: "Book is currently out of stock" })
    }
  }
  catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

const submit_book = async (req, res) => {
  try {
    const BookId = req.body.BookId;

    // Update UserBook using Mongoose
    const updatedUserBook = await userBookModel.findOneAndUpdate(
      { BookId: BookId },
      { SubmitDate: time.epochtime(), updatedAt: time.epochtime() }
    );

    if (!updatedUserBook) {
      return res.status(404).send("Book not found");
    }

    const book_data = await userBookModel.findOne({ _id: updatedUserBook._id });
    const name_of_book = await BookModel.findOne({ _id: book_data.BookId });
    const email = await userModel.findOne({ _id: book_data.UserId });

    const book = {};
    book.user = email.Name;
    book.name = name_of_book.Name;
    const submitDate = book_data.updatedAt;
    book.date = submitDate;
    const submit = true;
    book.submit = submit;

    // Assuming `mail.sendbookdetails` is an asynchronous function, you can use `await` here
    await mail.sendbookdetails(email.Email, book);

    res.status(200).send(
      "Your book is successfully submitted, information about this will be shared with email"
    );
  } 
  
  catch (err) {
    console.error(err);
    res.status(500).send({
      message: err.message || "Error occurred during book submission",
    });
  }
}

const getImageController = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const imagePath = path.join(__dirname, '../public', user.profile);
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');

    return res.send({ base64Image });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

const loginController = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, Email, and Password are required!' });
    }

    const exist = await userModel.findOne({ email: email });

    if (!exist) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isValid = await bcrypt.compare(password, exist.password);

    if (!isValid) {
      return res.status(400).json({ message: 'Invalid Password' });
    }

    const token = jwt.sign(
      {
        name: exist.name,
        email: exist.email
      },
      secretkey,
      { expiresIn: '1h' }
    );

    // Update the user's token in the database
    try {
      await userModel.updateOne(
        { _id: exist._id },
        { $set: { token: token } }
      );
    } catch (error) {
      console.error('Error updating data:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    res.status(200).json({ name: exist.name, email: exist.email, token: token, message: "Login Successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getAllby = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const searchField = req.query.search_field;
  const searchValue = req.query.search_value;
  const sortField = req.query.sort_field || "DateCreated";
  const sortOrder = req.query.sort_order || 'asc';
  var startDate = convertDateToTimestamp(req.query.start_date || "01/02/2003");
  var endDate = convertDateToTimestamp(req.query.end_date || "01/02/2030");
  console.log(searchField);

  const aggregationPipeline = [];

  if (searchField && searchValue) {
    aggregationPipeline.push({
      $match: {
        "DateCreated": {
          $gte: startDate,
          $lt: endDate
        },
        [searchField]: searchValue
      }
    });
  }
  else if (!searchField && !searchValue && startDate && endDate) {
    aggregationPipeline.push({
      $match: {
        "DateCreated": {
          $gte: startDate,
          $lt: endDate
        }
      }
    });
  } else if (!startDate && !endDate && searchField && searchValue) {
    aggregationPipeline.push({
      $match: {
        [searchField]: searchValue
      }
    });
  }

  aggregationPipeline.push(
    {
      $sort: {
        [sortField]: sortOrder === "asc" || sortOrder === "ASC" ? 1 : -1
      }
    },
    { $skip: skip },
    { $limit: limit }
  );

  const response = await userModel.aggregate([
    {
      $facet: {
        results: aggregationPipeline,
        totalCount: [
          {
            $count: "count"
          }
        ]
      }
    }
  ]);

  res.send(response);
}

const getcontroller = (req, res, next) => {
  userModel.findById(req.params.id)
    .then(result => {
      res.status(200).json({
        user: result
      })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      })
    })
}

const deletecontroller = async (req, res) => {
  try {
    const dename = req.params.name;
    const result = await userModel.findOneAndDelete({ name: dename });

    if (result === null) {
      res.status(404).send('Document not found');
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).send('Internal Server Error');
  }
}

const updatecontroller = async (req, res) => {
  try {
    let result = await userModel.updateOne(
      { _id: req.params.id },
      { $set: req.body }
    );
    res.send({ status: 'updated' });
  } catch (error) {
    console.error('Error updating data:', error);
    res.status(500).send('Internal Server Error');
  }
}

const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const existingUser = await userModel.findOne({ email: email });

    if (existingUser) {
      return res.status(200).json({ message: 'User Exists!' });
    }

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    let profileName = null;
    if (req?.file?.filename) {
      profileName = req.file.filename; // Use the image filename as the profile name
    }


    req.body.password = hashedPassword;
    const newUser = new userModel(
      {
        name: req?.body?.name,
        password: hashedPassword,
        email: req?.body?.email,
        profile: profileName
      }
    );
    await newUser.save();

    return res.status(201).json({ message: 'Register Successfully', success: true });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ success: false, message: `register controller ${error.message}` });
  }
};

const resetController = async (req, res) => {
  const { email } = req.body;
  if (email) {
    const user = await userModel.findOne({ email: email });
    console.log(user);
    const secret = user._id + secretkey;
    if (user) {
      const token = jwt.sign({ _id: user._id }, secret, { expiresIn: '1h' });
      const link = `http://127.0.0.1:8080/api/v1/user/password-updation/${user._id}/${token}`;
      console.log(link);

      const info = await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: "PASSWORD RESET LINK",
        html: `<a href=${link}>Click Here</a> to Reset Your Password`
      })

      res.send({ "status": "success", "message": "Password Reset Link Sent...." })
    }
    else {
      res.send({ "status": "failed", "message": "Email doesnt exist " })
    }
  }

  else {
    res.send({ "status": "failed", "message": "Email is required" })
  }
}

const changepassword = async (req, res) => {
  try {
    const { email, oldpassword, newpassword } = req.body;

    if (!oldpassword || !email || !newpassword) {
      return res.status(400).json({ message: ' Email, and Old and New Passwords are required!' });
    }

    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isValid = bcrypt.compare(oldpassword, user.password);

    if (!isValid) {
      return res.status(400).json({ message: 'Invalid Password' });
    }

    if (isValid) {
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(newpassword, salt);

      try {
        let result = await userModel.updateOne(
          { email: user.email },
          { $set: { password: hashedPassword } }
        );
        res.send({ status: 'updated' });
      }
      catch (error) {
        console.error('Error updating data:', error);
        res.status(500).send('Internal Server Error1');
      }

    }
  }
  catch (error) {
    console.error('Error updating data:', error);
    res.status(500).send('Internal Server Error2');
  }

}

const userPasswordReset = async (req, res) => {
  const { password, password_confirmation } = req.body
  const { id, token } = req.params

  const user = await userModel.findById(id);

  try {
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    const new_secret = user._id + secretkey;
    if (password && password_confirmation) {
      jwt.verify(token, new_secret)
      if (password === password_confirmation) {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);

        try {
          let result = await userModel.updateOne(
            { _id: user._id },
            { $set: { password: hashedPassword } }
          );
          res.send({ status: 'updated' });
        }
        catch (error) {
          console.error('Error updating data:', error);
          res.status(500).send('Internal Server Error');
        }
      }
    }
    else {
      res.send({ "status": "failed", "message": "All the fields are required" });
    }
  }
  catch (error) {
    console.log(error);
    res.send({ "status": "failed", "message": "Invalid Token" });
  }

}

module.exports = { issueBook,submit_book,getImageController, userPasswordReset, changepassword, registerController, updatecontroller, deletecontroller, getcontroller, loginController, resetController, getAllby };