require('dotenv').config();
// rozorpay
const Razorpay = require('razorpay');

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEYID,
  key_secret: process.env.RAZORPAY_KEYSECRET,
});

module.exports= instance;
