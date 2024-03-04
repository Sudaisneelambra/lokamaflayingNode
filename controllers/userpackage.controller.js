const mongoose = require('mongoose');
const packages = require('../models/package');

module.exports = {
  getpackages: async (req, res) => {
    try {
      const pack = await packages.aggregate([
        {$match: {blockstatus: {$ne: true}}},
        {
          $lookup: {
            from: 'agencies',
            localField: 'agencyid',
            foreignField: '_id',
            as: 'agencydetails',
          },
        },
      ]);
      if (pack) {
        res.json({
          success: true,
          data: pack,
          message: 'successfully got packages',
        });
      } else {
        res
            .status(404)
            .json({success: false, message: 'package getting failed'});
      }
    } catch (error) {
      console.log(error);
    }
  },
  getsinglepackage: async (req, res) => {
    try {
      const id = new mongoose.Types.ObjectId(req.params.id);
      const pack = await packages.aggregate([
        {
          $match: {_id: id},
        },
        {
          $lookup: {
            from: 'agencies',
            localField: 'agencyid',
            foreignField: '_id',
            as: 'agencydetails',
          },
        },
      ]);
      if (pack) {
        res.json({
          success: true,
          data: pack,
          message: 'successfully got packages',
        });
      } else {
        res
            .status(404)
            .json({success: false, message: 'package getting failed'});
      }
    } catch (error) {
      console.log(error);
    }
  },
  getpackage: async (req, res) => {
    try {
      const id =new mongoose.Types.ObjectId(req.params.id);
      const pls = await packages.find({agencyid: id});
      if (pls) {
        res.json({success: true, data: pls, message: 'successfully got places'});
      } else {
        res.status(404).json({success: false, message: 'places getting failed'});
      }
    } catch (error) {
      console.log(error);
    }
  },
};
