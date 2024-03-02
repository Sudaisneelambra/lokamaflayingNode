/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
const razorpay =require('../utils/rozorpay');
const bookingpayment =require('../models/bookingpayments');
const mongoose =require('mongoose');

module.exports={
  creatingorder: async (req, res) => {
    const {price, agencyid, packageid} =req.body;
    console.log(price);
    console.log(agencyid);
    console.log(packageid);


    const options = {
      amount: price *100, // amount in the smallest currency unit
      currency: 'INR',
      receipt: 'order_rcptid_11',
    };

    try {
      const order = await razorpay.orders.create(options);
      console.log(order);
      res.json(order);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  },
  bookingpayment: async (req, res) => {
    try {
      const {razorpay_payment_id, razorpay_order_id, packageid, agencyid, price}=req.body;
      const userid= new mongoose.Types.ObjectId(req.tokens.id);
      const bookingsave = new bookingpayment({
        paymentid: razorpay_payment_id,
        orderid: razorpay_order_id,
        userid: userid,
        agencyid: agencyid,
        packageid: packageid,
        price,
      });

      const saved= await bookingsave.save();
      if (saved) {
        res.json({success: true, message: 'successfully added'});
      } else {
        res.json({success: false, message: 'failed to add data base'});
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  },
  checkingalraedybooked: async (req, res) => {
    try {
      const packageid =new mongoose.Types.ObjectId(req.params.id);
      const userid= new mongoose.Types.ObjectId(req.tokens.id);
      const booking = await bookingpayment.findOne({packageid, userid});
      if (booking) {
        res.json({already: true, message: 'this package is already booked this user'});
      } else {
        res.json({already: false});
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  },
};
