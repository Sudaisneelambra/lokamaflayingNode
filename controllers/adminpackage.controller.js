const packages = require('../models/package');

module.exports = {
  gettingpackages: async (req, res) => {
    try {
      const pkg = await packages.aggregate([
        {
          $lookup: {
            from: 'agencies',
            localField: 'agencyid',
            foreignField: '_id',
            as: 'agencydetails',
          },
        },
      ]);
      console.log(pkg);
      if (pkg) {
        res.json({
          success: true,
          data: pkg,
          message: 'succesfully got the all packages',
        });
      } else {
        res.json({
          success: false,
          message: 'getting packages failed',
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
  packageblock: async (req, res) => {
    try {
      const {id}= req.body;
      const update = await packages.updateOne({_id: id}, {$set: {blockstatus: true}});
      if (update) {
        res.json({success: true, message: 'package blocked successfully'});
      } else {
        res.json({success: false, message: 'package blocked failed'});
      }
    } catch (err) {
      console.log(err);
    }
  },
  packageunblock: async (req, res) => {
    try {
      const {id}= req.body;
      const update = await packages.updateOne({_id: id}, {$set: {blockstatus: false}});
      if (update) {
        res.json({success: true, message: 'package unblocked successfully'});
      } else {
        res.json({success: false, message: 'package unblock failed'});
      }
    } catch (err) {
      console.log(err);
    }
  },
};
