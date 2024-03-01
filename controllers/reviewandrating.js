const mongoose = require('mongoose');
const review = require('../models/agencyreview');

module.exports={
  reviewandrating: async (req, res) =>{
    try {
      const id =new mongoose.Types.ObjectId(req.tokens.id);
      const {rating, comment} =req.body.data;
      const rev = new review({
        comment,
        rating,
        userId: id,
      });

      const saved= await rev.save();

      if (saved) {
        res.json({success: true, message: 'review added successfully'});
      } else {
        res.json({success: false, message: 'review added failed'});
      }
    } catch (err) {
      console.log(err);
    }
  },
};
