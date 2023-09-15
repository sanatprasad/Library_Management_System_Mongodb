const dotenv=require('dotenv');
const nodemailer=require('nodemailer');

dotenv.config();

const transporter=nodemailer.createTransport({
    host:process.env.EMAIL_HOST,
    port:process.env.EMAIL_PORT,
    secure:false,
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    },

})

transporter.verify(function(error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email Server is ready'.bgGreen.white);
    }
});

module.exports=transporter;