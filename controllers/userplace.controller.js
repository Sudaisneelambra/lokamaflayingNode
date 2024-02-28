const mongoose =require('mongoose');
const place= require('../models/placeadd');

module.exports={
  getplaces: async (req, res) => {
    try {
      const pls = await place.find();
      if (pls) {
        res.json({success: true, data: pls, message: 'successfully got places'});
      } else {
        res.status(404).json({success: false, message: 'places getting failed'});
      }
    } catch (error) {
      console.log(error);
    }
  },
  getsingleplace: async (req, res) =>{
    try {
      const id= new mongoose.Types.ObjectId(req.params.id);
      console.log(id);
      const singleplace = await place.aggregate([{$match: {_id: id}}, {$lookup: {from: 'agencies',
        localField: 'agencyid', foreignField: '_id', as: 'agencydetails'}}]);
      if (singleplace) {
        res.json({success: true, data: singleplace, message: 'successfully get the place data'});
      } else {
        res.status(404).json({message: 'failed on getting place data'});
      };
    } catch (error) {
      res.status(404).json({message: 'failed on getting place data', error: error});
    }
  },
};

