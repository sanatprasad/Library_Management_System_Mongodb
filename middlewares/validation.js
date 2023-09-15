const express = require('express');
const bodyParser = require('body-parser');

const app=express();
// Parse JSON and URL-encoded bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const validateUserInput = (req, res, next) => {
    const { email, password } = req.body;

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    if (!passwordRegex.test(password)) {
        return res.status(400).json({
            message: 'Password must contain at least 1 lowercase letter, 1 uppercase letter, 1 number, 1 special character, and be at least 8 characters long'
        });
    }

    next(); 
};

module.exports = {validateUserInput};
