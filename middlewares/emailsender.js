const dotenv=require('dotenv');
const nodemailer=require('nodemailer');

dotenv.config();
async function sendbookdetails(email, book) {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "sanat.prasad@teksun.com",
        pass: "zmcfxaaxobzqjfmt",
      },
    });
    if (!book.submit) {
      var title = "Issue";
      var htmlline = `<h3>Hello ${book.user}</h3><p>You are issuing ${book.name} on ${book.date}</p>`;
    } 
    else {
      var title = "Submit";
      var htmlline = `<h3>Hello ${book.user}</h3><p>You are submiting ${book.name} on ${book.date}</p>`;
    }

    const mailOptions = {
      from: "sanat.prasad@teksun.com",
      to: email,
      subject: `Book ${title} Confirmation`,
      html: htmlline,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.response);
  } 
  catch (error) {
    console.log("Error sending email: ", error);
  }
}

module.exports = {
  sendbookdetails,
};