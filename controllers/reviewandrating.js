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
  gettingpagereview: async (req, res) =>{
    try {
      const rev = await review.aggregate(
          [
            {$lookup:
                {
                  from: 'usersignups',
                  localField: 'userId',
                  foreignField: '_id',
                  as: 'userdetails',
                },
            },
          ]);

      if (rev) {
        res.json({success: true, message: 'review getted successfully', data: rev});
      } else {
        res.json({success: false, message: 'review getting failed'});
      }
    } catch (err) {
      console.log(err);
    }
  },
};
