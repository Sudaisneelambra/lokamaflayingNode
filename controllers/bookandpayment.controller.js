/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
const razorpay =require('../utils/rozorpay');
const bookingpayment =require('../models/bookingpayments');
const package =require('../models/package');
const profile =require('../models/profileadd');
const mongoose =require('mongoose');

module.exports={
  creatingorder: async (req, res) => {
    const {price, agencyid, packageid} =req.body;

    const options = {
      amount: price *100, // amount in the smallest currency unit
      currency: 'INR',
      receipt: 'order_rcptid_11',
    };

    try {
      const order = await razorpay.orders.create(options);
      res.json(order);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  },
  bookingpayment: async (req, res) => {
    try {
      const {razorpay_payment_id, razorpay_order_id, packageid, agencyid, price, Noofpersons}=req.body;
      const userid= new mongoose.Types.ObjectId(req.tokens.id);
      const bookingsave = new bookingpayment({
        paymentid: razorpay_payment_id,
        orderid: razorpay_order_id,
        userid: userid,
        agencyid: agencyid,
        packageid: packageid,
        price,
        Noofpersons,
      });

      const saved= await bookingsave.save();
      const pack = await package.findOne({_id: packageid});
      const latestslot= parseInt(pack.availableSlot)-parseInt(Noofpersons);
      await package.updateOne({_id: packageid}, {$set: {availableSlot: latestslot}});
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
  bookingdetails: async (req, res) => {
    try {
      const userid= new mongoose.Types.ObjectId(req.tokens.id);
      const booking = await bookingpayment.aggregate([
        {
          $match: {userid: userid},
        },
        {
          $lookup: {from: 'agencies', localField: 'agencyid', foreignField: '_id', as: 'agencydetails'},
        },
        {
          $lookup: {from: 'packages', localField: 'packageid', foreignField: '_id', as: 'packagedetails'},
        }]);
      if (booking) {
        res.json({success: true, data: booking});
      } else {
        res.json({success: false});
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  },
  getbooking: async (req, res) => {
    try {
      const userid= new mongoose.Types.ObjectId(req.tokens.id);
      const prof = await profile.findOne({userId: userid});
      if (prof) {
        const booking = await bookingpayment.aggregate([
          {
            $match: {agencyid: prof._id},
          },
          {
            $lookup: {from: 'usersignups', localField: 'userid', foreignField: '_id', as: 'userdetails'},
          },
          {
            $lookup: {from: 'packages', localField: 'packageid', foreignField: '_id', as: 'packagedetails'},
          }]);
        if (booking) {
          res.json({success: true, data: booking});
        } else {
          res.json({success: false});
        }
      } else {
        res.json({success: false});
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  },
};
