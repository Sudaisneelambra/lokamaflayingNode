const mongoose = require('mongoose');
const review = require('../models/sitereview');
const profile = require('../models/profileadd');
const agencyreview = require('../models/agencyreview');

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
  agencyreview: async (req, res) =>{
    try {
      const id =new mongoose.Types.ObjectId(req.tokens.id);
      const {rating, comment, agencyid} =req.body.data;
      const rev = new agencyreview({
        comment,
        rating,
        agencyid,
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
  getingagencyreview: async (req, res) =>{
    try {
      const id = new mongoose.Types.ObjectId(req.params.id);
      const rev = await agencyreview.aggregate(
          [
            {
              $match: {
                agencyid: id,
              },
            },
            {$lookup:
                {
                  from: 'usersignups',
                  localField: 'userId',
                  foreignField: '_id',
                  as: 'userdetails',
                },
            },
            {$lookup:
                {
                  from: 'agencies',
                  localField: 'agencyid',
                  foreignField: '_id',
                  as: 'agencydetails',
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
  getallagencyreview: async (req, res) =>{
    try {
      const rev = await agencyreview.aggregate(
          [
            {$lookup:
                {
                  from: 'usersignups',
                  localField: 'userId',
                  foreignField: '_id',
                  as: 'userdetails',
                },
            },
            {$lookup:
                {
                  from: 'agencies',
                  localField: 'agencyid',
                  foreignField: '_id',
                  as: 'agencydetails',
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
  getreview: async (req, res) =>{
    try {
      const id = new mongoose.Types.ObjectId(req.tokens.id);
      const prof = await profile.findOne({userId: id});
      if (prof) {
        const rev = await agencyreview.aggregate(
            [
              {
                $match: {
                  agencyid: prof._id,
                },
              },
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
      } else {
        res.json({success: false, message: 'review getting failed'});
      }
    } catch (err) {
      console.log(err);
    }
  },
};
