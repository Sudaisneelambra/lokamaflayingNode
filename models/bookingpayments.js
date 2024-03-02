const mongoose = require('mongoose');
const bookingpayament = new mongoose.Schema({
  paymentid: {
    type: String,
    required: true,
  },
  orderid: {
    type: String,
    required: true,
  },
  userid: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  agencyid: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  packageid: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});


const payment = mongoose.model('bookingpayment', bookingpayament);

module.exports = payment;
