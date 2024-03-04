const mongoose =require('mongoose');
const agencies = require('../models/profileadd');


module.exports={
  getagencies: async (req, res) => {
    try {
      const agen = await agencies.find({blockstatus: {$ne: true}});
      if (agen) {
        res.json({success: true, data: agen, message: 'successfully got agency'});
      } else {
        res.status(404).json({success: false, message: 'agency getting failed'});
      }
    } catch (error) {
      console.log(error);
    }
  },
  getingsingleagency: async (req, res) => {
    try {
      const id = new mongoose.Types.ObjectId(req.params.id);
      const agen = await agencies.find({_id: id});
      if (agen) {
        res.json({success: true, data: agen, message: 'successfully got agency'});
      } else {
        res.status(404).json({success: false, message: 'agency getting failed'});
      }
    } catch (error) {
      console.log(error);
    }
  },
};
