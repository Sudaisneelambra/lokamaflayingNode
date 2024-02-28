// const mongoose = require('mongoose');
const packages = require('../models/package');

module.exports = {
  getpackages: async (req, res) => {
    try {
      const pack = await packages.aggregate([{$match: {blockstatus: {$ne: true}}},
        {$lookup: {from: 'agencies', localField: 'agencyid',
          foreignField: '_id', as: 'agencydetails'}}]);
      if (pack) {
        res.json({success: true, data: pack, message: 'successfully got packages'});
      } else {
        res.status(404).json({success: false, message: 'package getting failed'});
      }
    } catch (error) {
      console.log(error);
    }
  },
};
