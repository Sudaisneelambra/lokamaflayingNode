require('dotenv').config();
const password=process.env.USER_PASS;
const nodemailer = require('nodemailer');

const sendEmail = async (email, subjectSend, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      port: 587,
      secure: true,
      auth: {
        user: 'sudaisanuneelambra21@gmail.com',
        pass: password,
      },
    });

    await transporter.sendMail({
      from: 'sudaisanuneelambra21@gmail.com',
      to: email,
      subject: subjectSend,
      text: `your verification otp is ${otp}. please verify this otp`,
    });
    console.log('email sent successfully');
  } catch (error) {
    console.log('email not sent');
    console.log(error);
  }
};

module.exports = sendEmail;
