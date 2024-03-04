// const mongoose=require('mongoose');
const booking = require('../models/bookingpayments');

module.exports={
  getallbooking: async (req, res)=>{
    try {
      const allbooking = await booking.aggregate([
        {
          $lookup: {
            from: 'agencies',
            localField: 'agencyid',
            foreignField: '_id',
            as: 'agencydetails',
          },
        },
        {
          $lookup: {
            from: 'usersignups',
            localField: 'userid',
            foreignField: '_id',
            as: 'userdetails',
          },
        },
        {
          $lookup: {
            from: 'packages',
            localField: 'packageid',
            foreignField: '_id',
            as: 'packagedetails',
          },
        },
      ]);

      res.json({data: allbooking});
    } catch (error) {
      res.json({message: error});
    }
  },
};
